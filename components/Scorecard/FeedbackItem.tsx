"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";

interface FeedbackItemProps {
  type: "strength" | "improvement";
  content: string;
}

export function FeedbackItem({ type, content }: FeedbackItemProps) {
  const isStrength = type === "strength";

  return (
    <div
      className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
        isStrength
          ? "bg-success/5 border-success/15 text-textPrimary"
          : "bg-warning/5 border-warning/15 text-textPrimary"
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isStrength ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-warning" />
        )}
      </div>
      <div>
        <p className="font-medium text-textPrimary">{content}</p>
      </div>
    </div>
  );
}

export default FeedbackItem;
