import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import { getInterviewerPrompt } from "@/lib/prompts";
import { generateOpeningQuestion } from "@/lib/ollama";

export async function POST(req: Request) {
  try {
    const { role, difficulty, interviewType, userId } = await req.json();

    // Body Validation
    if (!role || !difficulty || !interviewType || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: role, difficulty, interviewType, and userId are all required" },
        { status: 400 }
      );
    }

    const validRoles = ["frontend", "backend", "fullstack", "dsa", "system-design"];
    const validDifficulties = ["junior", "mid", "senior"];
    const validTypes = ["technical", "behavioral", "mixed"];

    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role value provided" }, { status: 400 });
    }
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json({ error: "Invalid difficulty value provided" }, { status: 400 });
    }
    if (!validTypes.includes(interviewType)) {
      return NextResponse.json({ error: "Invalid interview type value provided" }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Generate initial prompt
    const systemPrompt = getInterviewerPrompt(role, difficulty, interviewType);

    // Call Ollama to generate first question
    let openingQuestion = "";
    try {
      openingQuestion = await generateOpeningQuestion(systemPrompt);
    } catch (aiError: any) {
      console.error("AI service error during start:", aiError);
      return NextResponse.json(
        { error: aiError.message || "AI service unavailable. Make sure Ollama is running: ollama serve", code: "AI_OFFLINE" },
        { status: 503 }
      );
    }

    // Save to Database
    const session = await Session.create({
      userId,
      role,
      difficulty,
      interviewType,
      status: "in-progress",
      messages: [
        {
          role: "interviewer",
          content: openingQuestion,
          timestamp: new Date(),
        },
      ],
      currentQuestionIndex: 0,
      totalQuestions: 6,
      evaluations: [],
      finalScore: null,
    });

    return NextResponse.json({
      sessionId: session._id.toString(),
      firstQuestion: openingQuestion,
    });
  } catch (error: any) {
    console.error("Critical error in /api/interview/start:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while starting the mock interview", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
