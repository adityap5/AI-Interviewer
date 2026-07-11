import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";

export async function POST(req: Request) {
  try {
    const userSession = await getServerSession(authOptions);
    if (!userSession?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    await dbConnect();

    const mockSession = await Session.findOne({
      _id: sessionId,
      userId: userSession.user.id,
    });

    if (!mockSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (mockSession.status === "completed") {
      return NextResponse.json({ error: "Session is already completed" }, { status: 400 });
    }

    mockSession.status = "cancelled";
    mockSession.cancelledAt = new Date();
    mockSession.questionsAnswered = mockSession.evaluations.length;

    await mockSession.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
