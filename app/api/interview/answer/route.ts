import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import { getInterviewerPrompt } from "@/lib/prompts";
import { evaluateAnswer, streamInterviewerResponse, generateFinalScore } from "@/lib/ollama";
import { validateEnv } from "@/lib/validateEnv";
import { Evaluation } from "@/types";

validateEnv();

function getAdaptiveInstruction(
  evaluations: Evaluation[], 
  currentDifficulty: string
): string {
  if (evaluations.length < 2) return ''
  
  const recent = evaluations.slice(-2)
  const avgRecent = recent.reduce((sum, e) => sum + e.overall, 0) / recent.length
  
  const allAvg = evaluations.reduce((sum, e) => sum + e.overall, 0) / evaluations.length
  
  if (avgRecent >= 8 && allAvg >= 7.5) {
    return `\nThe candidate is performing excellently. 
    Significantly increase complexity. Ask about:
    - System design tradeoffs
    - Edge cases and failure scenarios  
    - Performance at scale
    - Architecture decisions and their consequences
    This should challenge even a senior engineer.`
  }
  
  if (avgRecent >= 6.5) {
    return `\nThe candidate is doing well. 
    Moderately increase complexity. 
    Ask about real-world scenarios and practical applications.
    Probe for depth in their previous answers' weak areas.`
  }
  
  if (avgRecent >= 4.5) {
    return `\nThe candidate is showing average performance.
    Keep the same difficulty level.
    Ask a different topic area — avoid the topics they struggled with 
    but do not simplify the question.`
  }
  
  if (avgRecent < 4.5) {
    return `\nThe candidate is struggling.
    Slightly simplify the next question.
    Ask about a fundamental concept that underpins what they got wrong.
    Use a more concrete, specific scenario rather than abstract concepts.`
  }
  
  return ''
}

function sanitizeUserAnswer(answer: string): string {
  const metaPatterns = [
    /ask (me |us )?(about |on |)?(easier|harder|different|node|backend|frontend|react)/i,
    /change (the |)topic/i,
    /skip this/i,
    /give me (an |a |)(easier|harder|different) question/i,
    /ask (backend|frontend|node|python|java) questions/i,
  ]
  
  const isMeta = metaPatterns.some(pattern => pattern.test(answer.trim()))
  
  if (isMeta) {
    return '[Candidate did not answer the question]'
  }
  
  return answer
}

export async function POST(req: Request) {
  try {
    const { sessionId, answer, questionIndex } = await req.json();

    if (!sessionId || answer === undefined || questionIndex === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, answer, and questionIndex are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    let session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status === "completed") {
      return NextResponse.json({ error: "This interview session is already completed" }, { status: 400 });
    }

    // Save user answer to DB first
    await Session.findByIdAndUpdate(sessionId, {
      $push: {
        messages: {
          role: 'user',
          content: answer,
          questionIndex,
          timestamp: new Date()
        }
      },
      $inc: { questionsAnswered: 1 }
    });

    // Re-fetch after update
    session = await Session.findById(sessionId);

    const interviewerMessages = session.messages.filter((m: any) => m.role === "interviewer");
    const lastQuestionText = interviewerMessages[interviewerMessages.length - 1]?.content || "";

    const sanitizedAnswer = sanitizeUserAnswer(answer);

    // Run evaluation
    const evaluationPromise = evaluateAnswer(
      lastQuestionText,
      sanitizedAnswer,
      session.role,
      session.difficulty,
      session.interviewType,
      session.selectedTechnologies
    );

    // If this was the 10th answer (questionIndex === 9), end interview IMMEDIATELY before generating next question
    if (questionIndex >= 9) {
      let evaluationResult;
      try {
        evaluationResult = await evaluationPromise;
      } catch (evalError: any) {
        console.error("Answer evaluation failed for final question.", evalError);
        evaluationResult = {
          technical: 5, clarity: 5, depth: 5, confidence: 5, overall: 5, flags: ["evaluation_failed"], detailedFeedback: "Evaluation failed"
        };
      }

      await Session.findByIdAndUpdate(sessionId, {
        $push: { 
          evaluations: { 
            ...evaluationResult, 
            questionText: lastQuestionText, 
            answerText: answer, 
            questionIndex 
          } 
        }
      });

      const updatedSession = await Session.findById(sessionId);
      const finalScore = await generateFinalScore(
        updatedSession.evaluations,
        session.role,
        session.difficulty
      );

      await Session.findByIdAndUpdate(sessionId, {
        finalScore,
        status: 'completed',
        completedAt: new Date()
      });

      return NextResponse.json({ 
        interviewComplete: true,
        finalScore 
      });
    }

    // For questions 1-9: run interviewer + evaluator in parallel
    const adaptiveInstruction = getAdaptiveInstruction(session.evaluations, session.difficulty);
    const systemPrompt = getInterviewerPrompt(
      session.role,
      session.difficulty,
      session.interviewType,
      session.selectedTechnologies,
      questionIndex + 1,
      adaptiveInstruction
    );

    const formattedHistory = session.messages.map((m: any) => ({
      role: m.role === "interviewer" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    let evaluationResult: any;
    let stream: any;

    try {
      [evaluationResult, stream] = await Promise.all([
        evaluationPromise.catch(() => ({
          technical: 5, clarity: 5, depth: 5, confidence: 5, overall: 5, flags: ["evaluation_failed"], detailedFeedback: "Evaluation failed"
        })),
        streamInterviewerResponse([
          { role: 'system', content: systemPrompt },
          ...formattedHistory
        ])
      ]);
    } catch (aiError: any) {
      console.error("AI service error in /api/interview/answer during Promise.all:", aiError);
      return NextResponse.json(
        { error: "AI service is offline.", code: "AI_OFFLINE" },
        { status: 503 }
      );
    }

    // Save evaluation right away
    await Session.findByIdAndUpdate(sessionId, {
      $push: { 
        evaluations: { 
          ...evaluationResult, 
          questionText: lastQuestionText, 
          answerText: answer, 
          questionIndex 
        } 
      }
    });

    let accumulatedCompletion = "";
    const customReadableStream = new ReadableStream({
      async start(controller) {
        try {
          const reader = stream.getReader();
          const decoder = new TextDecoder();
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const text = decoder.decode(value, { stream: true });
            accumulatedCompletion += text;
            controller.enqueue(value);
          }
          controller.close();

          await Session.findByIdAndUpdate(sessionId, {
            $push: {
              messages: {
                role: "interviewer",
                content: accumulatedCompletion,
                timestamp: new Date(),
                questionIndex: questionIndex + 1,
              }
            },
            currentQuestionIndex: questionIndex + 1
          });
        } catch (streamErr) {
          console.error("Error reading from Ollama stream:", streamErr);
          controller.error(streamErr);
        }
      }
    });

    return new Response(customReadableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Question-Index": String(questionIndex + 1)
      }
    });

  } catch (error: any) {
    console.error("Critical error in /api/interview/answer:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing the answer", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
