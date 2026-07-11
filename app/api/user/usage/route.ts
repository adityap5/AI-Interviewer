import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user: any = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const interviewsUsed = user.interviewsUsed || 0;
    const interviewsLimit = user.interviewsLimit || 2;
    const isLimitReached = interviewsUsed >= interviewsLimit;
    const interviewsRemaining = Math.max(0, interviewsLimit - interviewsUsed);

    return NextResponse.json({
      interviewsUsed,
      interviewsLimit,
      interviewsRemaining,
      isLimitReached,
    });
  } catch (error) {
    console.error("Error fetching user usage:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
