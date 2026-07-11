import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import { getInterviewerPrompt } from "@/lib/prompts";
import { streamInterviewerResponse } from "@/lib/ollama";
import { validateEnv } from "@/lib/validateEnv";

validateEnv();
export async function POST(req: Request) {
  try {
    const { role, difficulty, interviewType, selectedTechnologies, userId } = await req.json();

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

    // Check usage limits
    const user: any = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const interviewsUsed = user.interviewsUsed || 0;
    const interviewsLimit = user.interviewsLimit || 2;

    if (interviewsUsed >= interviewsLimit) {
      return NextResponse.json(
        { error: "Free limit reached.", code: "FREE_LIMIT_REACHED" },
        { status: 403 }
      );
    }

    // Generate initial prompt
    const systemPrompt = getInterviewerPrompt(role, difficulty, interviewType, selectedTechnologies || [], 0);

    // Call AI to generate first question
    let openingQuestion = "";
    try {
      const stream = await streamInterviewerResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please introduce yourself briefly and ask the first question to begin the interview.' }
      ]);
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        openingQuestion += new TextDecoder().decode(value);
      }
    } catch (aiError: any) {
      console.error("AI service error during start:", aiError);
      return NextResponse.json(
        { error: aiError.message || "AI service unavailable.", code: "AI_OFFLINE" },
        { status: 503 }
      );
    }

    // Increment usage
    await User.findByIdAndUpdate(userId, { $inc: { interviewsUsed: 1 } });

    // Save to Database
    const session = await Session.create({
      userId,
      role,
      difficulty,
      interviewType,
      status: "in-progress",
      selectedTechnologies: selectedTechnologies || [],
      messages: [
        {
          role: "interviewer",
          content: openingQuestion,
          timestamp: new Date(),
          questionIndex: 0,
        },
      ],
      currentQuestionIndex: 0,
      totalQuestions: 10,
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
