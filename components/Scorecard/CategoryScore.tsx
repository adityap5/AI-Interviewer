"use client";

import { motion } from "framer-motion";

interface CategoryScoreProps {
  label: string;
  score: number;
}

export function CategoryScore({ label, score }: CategoryScoreProps) {
  // Determine color coding dynamically
  // Green if > 7, Yellow if 5-7, Red if < 5
  const getColor = (s: number) => {
    if (s > 7) return "bg-success text-success";
    if (s >= 5) return "bg-warning text-warning";
    return "bg-error text-error";
  };

  const getTextColor = (s: number) => {
    if (s > 7) return "text-success";
    if (s >= 5) return "text-warning";
    return "text-error";
  };

  return (
    <div className="space-y-2 select-none">
      {/* Label and Score values */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-textSecondary uppercase tracking-wider text-xs">
          {label}
        </span>
        <span className={`font-mono font-bold ${getTextColor(score)}`}>{score.toFixed(1)}/10</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${getColor(score).split(" ")[0]}`}
        />
      </div>
    </div>
  );
}

export default CategoryScore;
