"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ThinkingIndicator() {
  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-4 mb-6 justify-start"
    >
      {/* AI Avatar */}
      <div className="w-9 h-9 rounded-xl border bg-surface border-border text-accent flex items-center justify-center shrink-0 shadow-md">
        <Sparkles className="w-4 h-4 animate-pulse" />
      </div>

      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-light">
          Interviewer AI
        </span>

        {/* Thinking Bubbles Panel */}
        <div className="bg-surface text-textPrimary border border-border px-4 py-3 rounded-2xl rounded-tl-none shadow-md flex items-center gap-3">
          <span className="text-xs text-textSecondary font-medium">Interviewer is thinking</span>
          <div className="flex gap-1.5 items-center justify-center">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 bg-accent rounded-full inline-block"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  ...dotTransition,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ThinkingIndicator;
