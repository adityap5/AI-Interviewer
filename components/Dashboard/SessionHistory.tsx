"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, PlayCircle, Sparkles, ChevronRight, Award } from "lucide-react";
import Link from "next/link";

interface SessionItem {
  id: string;
  role: string;
  difficulty: string;
  overallScore: number | null;
  status: string;
  date: string;
}

interface SessionHistoryProps {
  sessions: SessionItem[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const getRoleTitle = (r: string) => {
    const mapping: Record<string, string> = {
      frontend: "Frontend Engineer",
      backend: "Backend Engineer",
      fullstack: "Fullstack Engineer",
      dsa: "Algorithms & DSA",
      "system-design": "System Design",
    };
    return mapping[r] || r;
  };

  const getScoreColor = (s: number) => {
    if (s > 7) return "text-success bg-success/5 border-success/15";
    if (s >= 5) return "text-warning bg-warning/5 border-warning/15";
    return "text-error bg-error/5 border-error/15";
  };

  return (
    <div className="space-y-4 select-none">
      <div>
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
          History Center
        </span>
        <h3 className="text-sm font-bold text-textPrimary mt-0.5">
          Past Interview Mocks
        </h3>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <Card
            key={session.id}
            hoverable
            className="border-border bg-surface/50 p-4 transition-all duration-150 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Left Column: Metadata */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-background border border-border text-accent flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-textPrimary">
                    {getRoleTitle(session.role)}
                  </h4>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-[10px] text-textSecondary flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.date}
                    </span>
                    <span className="text-[9px] text-textSecondary uppercase tracking-wider font-semibold bg-neutral-900 border border-border px-1.5 py-0.5 rounded">
                      {session.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Score Badging & Button links */}
              <div className="flex items-center gap-4 justify-between sm:justify-end border-t border-border/20 sm:border-t-0 pt-3 sm:pt-0">
                {/* Score badge */}
                {session.status === "cancelled" ? (
                  <div className="px-3 py-1.5 rounded-xl border font-mono font-bold text-xs flex items-center gap-1.5 text-textSecondary bg-surface border-border">
                    Cancelled
                  </div>
                ) : (
                  <div className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-xs flex items-center gap-1.5 ${getScoreColor(session.overallScore as number)}`}>
                    <Award className="w-3.5 h-3.5" />
                    Score: {(session.overallScore as number).toFixed(1)}
                  </div>
                )}

                {/* View Details Link */}
                <Link href={`/dashboard/session/${session.id}`}>
                  <Button variant="ghost" size="sm" className="text-xs group pr-2 flex items-center gap-1">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5 text-textSecondary group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-150" />
                  </Button>
                </Link>
              </div>

            </div>
          </Card>
        ))}

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-surface/30 border border-dashed border-border rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-textSecondary border border-border">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-textPrimary">No interviews completed</h4>
              <p className="text-xs text-textSecondary max-w-sm mt-1 leading-relaxed">
                Unlock your analytics dashboard by setting up and completing a local AI mock interview session.
              </p>
            </div>
            <Link href="/interview/setup">
              <Button size="sm">Start First Interview</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionHistory;
