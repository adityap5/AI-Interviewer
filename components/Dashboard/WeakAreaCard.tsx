"use client";

import { Card } from "@/components/ui/Card";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface WeakAreaCardProps {
  averages: {
    technical: number;
    clarity: number;
    depth: number;
    confidence: number;
  };
  hasSessions: boolean;
}

export function WeakAreaCard({ averages, hasSessions }: WeakAreaCardProps) {
  // Map internal categories to clean readable details
  const categoryDetails = [
    { key: "technical" as const, name: "Technical Skills", score: averages.technical, tip: "Practice whiteboard API mockups and review syntactic frameworks." },
    { key: "clarity" as const, name: "Clarity & Flow", score: averages.clarity, tip: "Use the STAR method to structure architectural responses clearly." },
    { key: "depth" as const, name: "Concept Depth", score: averages.depth, tip: "Focus on distributed system tradeoffs, edge cases, and scaling details." },
    { key: "confidence" as const, name: "Self-Confidence", score: averages.confidence, tip: "Practice mock audio speaking and maintain positive, strong, challange-seeking tones." },
  ];

  // Sort by score ascending to identify weak areas (lowest 2 scores)
  const sortedWeakAreas = [...categoryDetails]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  return (
    <Card className="bg-surface border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between select-none">
      <div>
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
          Diagnostic Center
        </span>
        <h3 className="text-sm font-bold text-textPrimary mt-0.5 flex items-center gap-1.5">
          Priority Growth Areas <AlertCircle className="w-4 h-4 text-accent" />
        </h3>
      </div>

      <div className="mt-4 flex-1 space-y-4">
        {hasSessions ? (
          <>
            <p className="text-xs text-textSecondary leading-relaxed">
              Based on your completed session metrics, focus your preparation efforts on these two critical categories:
            </p>

            <div className="space-y-3.5">
              {sortedWeakAreas.map((area) => (
                <div key={area.key} className="p-3 border border-border/80 rounded-xl bg-background flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-warning/10 text-warning shrink-0 mt-0.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-textPrimary">{area.name}</span>
                      <span className="font-mono font-bold text-warning">{area.score.toFixed(1)}/10 avg</span>
                    </div>
                    <p className="text-[10px] text-textSecondary leading-relaxed">
                      {area.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/15 rounded-xl mt-2">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            <p className="text-[10px] text-textSecondary leading-relaxed">
              Completing mock practice runs generates diagnostics on your communication skills, technical architecture depth, and speed.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default WeakAreaCard;
