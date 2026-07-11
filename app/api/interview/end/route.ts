import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import { generateFinalScore } from "@/lib/ollama";
import { validateEnv } from "@/lib/validateEnv";

validateEnv();
export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing required field: sessionId is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Fetch Session from MongoDB
    const session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if the final scorecard has already been generated
    if (session.finalScore) {
      return NextResponse.json({ finalScore: session.finalScore });
    }

    // 2. Extract Evaluations data
    const evaluations = session.evaluations || [];
    if (evaluations.length === 0) {
      return NextResponse.json(
        { error: "No evaluations found for this session. Complete at least one question first." },
        { status: 400 }
      );
    }

    // 3. Call AI to generate the final scorecard JSON
    let scorecard;
    try {
      scorecard = await generateFinalScore(evaluations, session.role, session.difficulty);
    } catch (aiError: any) {
      console.error("Failed to generate scorecard via AI, using default fallbacks.", aiError);
      scorecard = {
        overall: 5,
        technical: 5,
        clarity: 5,
        depth: 5,
        confidence: 5,
        strengths: ["Completed all mock interview questions"],
        improvements: ["Work on detailed technical depth and clarity in future attempts"],
        recommendation: "Needs more prep",
      };
    }

    // 4. Save Final Scorecard and details to Session
    session.finalScore = scorecard;
    session.status = "completed";
    session.completedAt = new Date();

    await session.save();

    return NextResponse.json({ finalScore: scorecard });
  } catch (error: any) {
    console.error("Critical error in /api/interview/end:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while synthesizing the scorecard", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
