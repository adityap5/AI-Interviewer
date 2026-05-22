import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required query parameter: userId is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch completed sessions for the user, sorted by createdAt descending
    const sessions = await Session.find({
      userId,
      status: "completed",
      finalScore: { $ne: null }, // Ensure a final scorecard exists
    })
      .select("role difficulty finalScore.overall createdAt completedAt")
      .sort({ createdAt: -1 });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error("Critical error in /api/sessions:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while retrieving historical sessions", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
