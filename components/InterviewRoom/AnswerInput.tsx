"use client";

import React, { useState, useEffect } from "react";
import { CornerDownLeft, Loader2, MessageSquare, Send } from "lucide-react";
import Button from "@/components/ui/Button";

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function AnswerInput({ onSubmit, disabled }: AnswerInputProps) {
  const [value, setValue] = useState("");

  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const charCount = value.length;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (value.trim() === "" || disabled) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className="border-t border-border bg-surface/50 p-4 sm:p-6 backdrop-blur-md">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* TextArea Box */}
        <div className="relative border border-border focus-within:border-accent rounded-2xl bg-background shadow-xl overflow-hidden transition-colors">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled}
            placeholder={
              disabled
                ? "Interviewer is speaking. Please listen carefully..."
                : "Type your answer here... (Tip: use Ctrl+Enter to submit)"
            }
            className="w-full min-h-[100px] max-h-[220px] px-5 py-4 bg-transparent text-textPrimary placeholder:text-textSecondary/40 focus:outline-none resize-y disabled:opacity-50 text-sm leading-relaxed"
          />

          {/* Action Row */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/50 bg-surface/30 select-none">
            {/* Word & Char Counters */}
            <div className="flex gap-4 items-center">
              <span className="text-[10px] text-textSecondary font-semibold">
                Words:{" "}
                <strong className={wordCount > 30 ? "text-success" : "text-textSecondary"}>
                  {wordCount}
                </strong>
              </span>
              <span className="text-[10px] text-textSecondary font-semibold">
                Chars: <strong>{charCount}</strong>
              </span>
            </div>

            {/* Submission triggers */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1 text-[9px] text-textSecondary font-semibold uppercase tracking-wider">
                Ctrl + Enter <CornerDownLeft className="w-3 h-3" />
              </span>
              <Button
                onClick={handleSubmit}
                disabled={value.trim() === "" || disabled}
                size="sm"
                className="flex items-center gap-1.5 active:scale-95"
              >
                {disabled ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    Submit Answer
                    <Send className="w-3 h-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Warning Indicator */}
        <div className="text-[10px] text-textSecondary text-center italic">
          Tip: High quality responses contain structured context and specific architecture examples (aim for &gt; 30 words).
        </div>
      </div>
    </div>
  );
}

export default AnswerInput;
