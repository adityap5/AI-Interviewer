"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Timer, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface InterviewHeaderProps {
  role: string;
  difficulty: string;
  questionIndex: number;
  totalQuestions?: number;
  onCancelClick?: () => void;
}

export function InterviewHeader({
  role,
  difficulty,
  questionIndex,
  totalQuestions = 10,
  onCancelClick,
}: InterviewHeaderProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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

  return (
    <header className="border-b border-border/80 bg-surface/50 backdrop-blur-md sticky top-0 z-20 py-4 px-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Return & Meta Details */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Link
          href="/dashboard"
          className="p-2 bg-background border border-border rounded-xl text-textSecondary hover:text-textPrimary hover:border-border/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-base font-bold tracking-tight text-textPrimary flex items-center gap-2">
            {getRoleTitle(role)}
            <Badge variant="primary" className="text-[9px] px-2 py-0">
              {difficulty}
            </Badge>
          </h1>
          <p className="text-[10px] text-textSecondary uppercase tracking-widest mt-0.5 font-semibold">
            Practice Environment
          </p>
        </div>
      </div>

      {/* Progress & Stopwatch */}
      <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto border-t border-border/25 sm:border-0 pt-4 sm:pt-0">
        {onCancelClick && (
          <button
            onClick={onCancelClick}
            className="text-xs font-semibold text-error hover:text-error/80 transition-colors mr-2 border border-error/30 px-3 py-1.5 rounded-lg bg-error/5"
          >
            Cancel Interview
          </button>
        )}
        
        {/* Question Counter */}
        <div className="text-right">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
            Progress Tracker
          </span>
          <span className="text-sm font-bold text-textPrimary">
            Question {Math.min(totalQuestions, questionIndex + 1)} of {totalQuestions}
          </span>
        </div>

        {/* Stopwatch */}
        <div className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl">
          <Timer className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-xs font-mono font-bold text-textPrimary">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
    </header>
  );
}

export default InterviewHeader;
