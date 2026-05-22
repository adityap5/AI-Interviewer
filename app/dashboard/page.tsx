import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import { ScoreChart } from "@/components/Dashboard/ScoreChart";
import { SessionHistory } from "@/components/Dashboard/SessionHistory";
import { WeakAreaCard } from "@/components/Dashboard/WeakAreaCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { LogOut, PlayCircle, Sparkles, UserCheck } from "lucide-react";
import SignOutButton from "@/components/Dashboard/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If no session exists, redirect to login path
  if (!session?.user) {
    redirect("/login");
  }

  await dbConnect();

  // 1. Fetch completed sessions for the user sorted descending
  const dbSessions = await Session.find({
    userId: session.user.id,
    status: "completed",
    finalScore: { $ne: null },
  })
    .sort({ createdAt: -1 })
    .lean();

  // 2. Format database sessions for history listings
  const sessionsList = dbSessions.map((s: any) => ({
    id: s._id.toString(),
    role: s.role,
    difficulty: s.difficulty,
    overallScore: s.finalScore.overall,
    date: new Date(s.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  // 3. Compute metric averages for diagnostics
  let technicalSum = 0;
  let claritySum = 0;
  let depthSum = 0;
  let confidenceSum = 0;
  const sessionCount = dbSessions.length;

  dbSessions.forEach((s: any) => {
    technicalSum += s.finalScore.technical || 5;
    claritySum += s.finalScore.clarity || 5;
    depthSum += s.finalScore.depth || 5;
    confidenceSum += s.finalScore.confidence || 5;
  });

  const averages = {
    technical: sessionCount > 0 ? technicalSum / sessionCount : 0,
    clarity: sessionCount > 0 ? claritySum / sessionCount : 0,
    depth: sessionCount > 0 ? depthSum / sessionCount : 0,
    confidence: sessionCount > 0 ? confidenceSum / sessionCount : 0,
  };

  // 4. Synthesize chronological score chart data (last 10 sessions)
  const chartData = [...dbSessions]
    .reverse()
    .slice(-10)
    .map((s: any) => ({
      date: new Date(s.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: s.finalScore.overall,
    }));

  return (
    <div className="flex-1 flex flex-col bg-background text-textPrimary relative overflow-x-hidden min-h-screen">
      {/* Background radial soft light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.02)_0%,transparent_50%)] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-border/80 bg-surface/40 backdrop-blur-md sticky top-0 z-20 py-4 px-6 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white border border-indigo-400/20 shadow-md shadow-accent/10">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-sm text-textPrimary uppercase tracking-wider">
            AI Interviewer
          </span>
        </div>

        {/* User Account Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-textSecondary font-semibold">
            <UserCheck className="w-4 h-4 text-accent" />
            <span>Logged in as: {session.user.name}</span>
          </div>
          <SignOutButton />
        </div>
      </header>

      {/* Main content grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* TOP PANEL: Hero Welcome banner */}
        <div className="lg:col-span-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border/50 pb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-textPrimary">
              Welcome back, {session.user.name}!
            </h2>
            <p className="text-xs text-textSecondary mt-1 max-w-xl leading-relaxed">
              Identify architectural vulnerabilities in your technical pitch and behavioral responses. Practice with adaptive, challanging, mistral-driven prompts.
            </p>
          </div>
          <Link href="/interview/setup" className="w-full md:w-auto shrink-0">
            <Button className="w-full flex items-center gap-2 shadow-lg shadow-accent/20">
              Start New Mock
              <PlayCircle className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* LEFT COLUMN: History Center (60%) */}
        <div className="lg:col-span-7 space-y-6">
          <SessionHistory sessions={sessionsList} />
        </div>

        {/* RIGHT COLUMN: Diagnostic Trends (40%) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recharts chart */}
          <ScoreChart data={chartData} />

          {/* Diagnostics average categories */}
          <WeakAreaCard averages={averages} hasSessions={sessionCount > 0} />
        </div>

      </main>
    </div>
  );
}
export const dynamic = "force-dynamic";
