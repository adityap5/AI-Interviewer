"use client";

import { motion } from "framer-motion";
import { FinalScore } from "@/types";
import { CategoryScore } from "./CategoryScore";
import { FeedbackItem } from "./FeedbackItem";
import { Sparkles, Trophy, ArrowRight, Home } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

interface ScoreCardProps {
  finalScore: FinalScore;
  role: string;
  difficulty: string;
}

export function ScoreCard({ finalScore, role, difficulty }: ScoreCardProps) {
  // SVG constants for circular overall score display
  const radius = 55;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (finalScore.overall / 10) * circumference;

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto space-y-8 select-none"
    >
      {/* Title & Celebration Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-400/25 text-accent flex items-center justify-center mx-auto shadow-lg shadow-accent/5">
          <Trophy className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary">
          Mock Session Scorecard
        </h1>
        <p className="text-sm text-textSecondary max-w-md mx-auto">
          Fantastic job! You completed the {getRoleTitle(role)} ({difficulty}) interview. Review your full AI evaluation metrics.
        </p>
      </motion.div>

      {/* Primary Metrics Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-border bg-surface/50 grid grid-cols-1 md:grid-cols-12 gap-8 p-8 items-center relative overflow-hidden bg-glow-effect">
          
          {/* Circular Progress Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center relative z-10 border-b md:border-b-0 md:border-r border-border/60 pb-6 md:pb-0 md:pr-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Circle */}
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-neutral-800"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Score Progress Ring */}
                <motion.circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-accent"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                  strokeLinecap="round"
                />
              </svg>

              {/* Text Score Value */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono tracking-tight text-textPrimary">
                  {finalScore.overall.toFixed(1)}
                </span>
                <span className="text-[10px] text-textSecondary uppercase tracking-widest font-semibold mt-0.5">
                  Overall Score
                </span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <span className="text-[10px] text-textSecondary uppercase tracking-wider block font-medium">
                Performance Level
              </span>
              <Badge variant={finalScore.overall >= 7 ? "success" : finalScore.overall >= 5 ? "warning" : "error"} className="mt-1.5 text-[9px]">
                {finalScore.overall >= 7.5 ? "Strong Candidate" : finalScore.overall >= 5.0 ? "Almost Ready" : "Prep Required"}
              </Badge>
            </div>
          </div>

          {/* Individual Category Bars */}
          <div className="md:col-span-8 space-y-5 relative z-10">
            <h2 className="text-sm font-bold tracking-tight text-textPrimary uppercase tracking-wider text-xs border-b border-border/30 pb-2">
              Metrics Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <CategoryScore label="Technical skills" score={finalScore.technical} />
              <CategoryScore label="Clarity & Flow" score={finalScore.clarity} />
              <CategoryScore label="Concept Depth" score={finalScore.depth} />
              <CategoryScore label="Self-Confidence" score={finalScore.confidence} />
            </div>
          </div>

        </Card>
      </motion.div>

      {/* Strengths and Improvements Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Column */}
        <Card className="border-success/20 bg-success/[0.01] p-6 space-y-4">
          <h3 className="text-sm font-bold text-success uppercase tracking-wider border-b border-success/10 pb-2 flex items-center gap-2">
            ✅ Key Strengths
          </h3>
          <div className="space-y-3">
            {finalScore.strengths.map((str, idx) => (
              <FeedbackItem key={idx} type="strength" content={str} />
            ))}
            {finalScore.strengths.length === 0 && (
              <p className="text-xs text-textSecondary italic">No key strengths highlighted. Keep practicing!</p>
            )}
          </div>
        </Card>

        {/* Improvements Column */}
        <Card className="border-warning/20 bg-warning/[0.01] p-6 space-y-4">
          <h3 className="text-sm font-bold text-warning uppercase tracking-wider border-b border-warning/10 pb-2 flex items-center gap-2">
            ⚠️ Areas for Growth
          </h3>
          <div className="space-y-3">
            {finalScore.improvements.map((imp, idx) => (
              <FeedbackItem key={idx} type="improvement" content={imp} />
            ))}
            {finalScore.improvements.length === 0 && (
              <p className="text-xs text-textSecondary italic">Excellent candidate! No major areas for improvement noted.</p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Final Recommendation Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-accent/15 bg-accent/[0.02] p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-start text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 border border-indigo-400/10 mx-auto sm:mx-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-textPrimary">AI Decision & Recommendation</h3>
              <p className="text-xs text-textSecondary mt-0.5 max-w-lg">
                Based on your technical responses and structured delivery, our AI evaluator recommends:
              </p>
            </div>
          </div>
          <Badge variant="primary" className="text-[10px] py-1.5 px-4 rounded-xl border-accent-light/35 font-bold shadow-lg shadow-accent/5">
            {finalScore.recommendation}
          </Badge>
        </Card>
      </motion.div>

      {/* Call to Actions Controls */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Link href="/interview/setup" className="w-full sm:w-auto">
          <Button className="w-full flex items-center gap-2">
            Start New Mock
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default ScoreCard;
