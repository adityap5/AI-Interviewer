import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import { getInterviewerPrompt } from "@/lib/prompts";
import { evaluateAnswer, streamInterviewerResponse } from "@/lib/ollama";
import { StreamingTextResponse, OpenAIStream } from "ai";

export async function POST(req: Request) {
  try {
    const { sessionId, answer, questionIndex } = await req.json();

    // Body Validation
    if (!sessionId || answer === undefined || questionIndex === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, answer, and questionIndex are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Fetch Session from MongoDB
    const session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status === "completed") {
      return NextResponse.json({ error: "This interview session is already completed" }, { status: 400 });
    }

    // 2. Identify the last interviewer question text
    const interviewerMessages = session.messages.filter((m: any) => m.role === "interviewer");
    const lastQuestionText = interviewerMessages[interviewerMessages.length - 1]?.content || "";

    // 3. Save User's answer to messages array
    session.messages.push({
      role: "user",
      content: answer,
      timestamp: new Date(),
    });

    // 4. Increment the session question index and save user answer immediately
    session.currentQuestionIndex = questionIndex + 1;

    // 5. Handle interview completion
    if (questionIndex >= 5) {
      // 6th question (index 5) evaluation complete, ending interview room
      session.status = "completed";

      let evaluationResult;
      try {
        evaluationResult = await evaluateAnswer(
          session.role,
          session.difficulty,
          session.interviewType,
          lastQuestionText,
          answer
        );
      } catch (evalError: any) {
        console.error("Answer evaluation failed for final question, using default scores.", evalError);
        evaluationResult = {
          technical: 5,
          clarity: 5,
          depth: 5,
          confidence: 5,
          flags: ["evaluation_failed"],
        };
      }

      session.evaluations.push({
        questionIndex,
        technical: evaluationResult.technical,
        clarity: evaluationResult.clarity,
        depth: evaluationResult.depth,
        confidence: evaluationResult.confidence,
        flags: evaluationResult.flags,
        questionText: lastQuestionText,
        answerText: answer,
      });

      const finalMsgText = "That concludes our interview. Thank you for your time.";
      session.messages.push({
        role: "interviewer",
        content: finalMsgText,
        timestamp: new Date(),
      });
      await session.save();

      const staticStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(finalMsgText));
          controller.close();
        },
      });

      return new StreamingTextResponse(staticStream);
    }

    // Save session database state before starting stream response (e.g. user message and index)
    await session.save();

    // 6. Trigger Evaluator call in the background (do not await it here!)
    const evaluationPromise = evaluateAnswer(
      session.role,
      session.difficulty,
      session.interviewType,
      lastQuestionText,
      answer
    ).catch((evalError: any) => {
      console.error("Background answer evaluation failed, using default scores.", evalError);
      return {
        technical: 5,
        clarity: 5,
        depth: 5,
        confidence: 5,
        flags: ["evaluation_failed"],
      };
    });

    // 7. Build next prompt using the current difficulty multiplier
    const systemPrompt = getInterviewerPrompt(
      session.role,
      session.difficulty,
      session.interviewType,
      session.difficultyMultiplier || 1.0
    );

    // Format full messages history for OpenAI API input format
    const formattedHistory = session.messages.map((m: any) => ({
      role: m.role === "interviewer" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    // Call Ollama for streaming interviewer response
    try {
      const stream = await streamInterviewerResponse(systemPrompt, formattedHistory);

      // Create a custom stream using OpenAIStream to intercept the completed response
      const interceptedStream = OpenAIStream(stream as any, {
        onCompletion: async (completion) => {
          try {
            // Await the background evaluation that ran in parallel
            const evaluationResult = await evaluationPromise;

            // Re-fetch the session and persist the new question and the evaluation result together
            const s = await Session.findById(sessionId);
            if (s) {
              s.messages.push({
                role: "interviewer",
                content: completion,
                timestamp: new Date(),
              });

              // Apply adaptive difficulty logic using evaluation results
              const overallScore =
                (evaluationResult.technical +
                  evaluationResult.clarity +
                  evaluationResult.depth +
                  evaluationResult.confidence) /
                4;

              let currentMultiplier = s.difficultyMultiplier || 1.0;
              if (overallScore > 8) {
                currentMultiplier = Math.min(2.0, currentMultiplier + 0.2);
              } else if (overallScore < 5) {
                currentMultiplier = Math.max(0.5, currentMultiplier - 0.1);
              }
              s.difficultyMultiplier = currentMultiplier;

              s.evaluations.push({
                questionIndex,
                technical: evaluationResult.technical,
                clarity: evaluationResult.clarity,
                depth: evaluationResult.depth,
                confidence: evaluationResult.confidence,
                flags: evaluationResult.flags,
                questionText: lastQuestionText,
                answerText: answer,
              });

              await s.save();
            }
          } catch (dbErr) {
            console.error("Failed to persist interviewer streamed message and evaluation to DB:", dbErr);
          }
        },
      });

      return new StreamingTextResponse(interceptedStream);
    } catch (aiError: any) {
      console.error("AI service error in /api/interview/answer:", aiError);
      return NextResponse.json(
        { error: "AI service is offline. Please make sure Ollama is running: ollama serve", code: "AI_OFFLINE" },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("Critical error in /api/interview/answer:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing the answer", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
