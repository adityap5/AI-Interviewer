"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";

interface ChatBubbleProps {
  role: "interviewer" | "user";
  content: string;
  timestamp?: Date;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isInterviewer = role === "interviewer";
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex w-full items-start gap-4 mb-6 ${
        isInterviewer ? "justify-start" : "justify-end flex-row-reverse"
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${
          isInterviewer
            ? "bg-surface border-border text-accent"
            : "bg-accent border-indigo-400/20 text-white"
        }`}
      >
        {isInterviewer ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble Panel */}
      <div className="flex flex-col max-w-[80%] md:max-w-[70%] space-y-1">
        {/* Sender Name */}
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isInterviewer ? "text-accent-light" : "text-textSecondary text-right"
          }`}
        >
          {isInterviewer ? "Interviewer AI" : "You"}
        </span>

        {/* Text Container */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed border relative shadow-md ${
            isInterviewer
              ? "bg-surface text-textPrimary border-border rounded-tl-none"
              : "bg-accent border-indigo-400/20 text-white rounded-tr-none"
          }`}
        >
          <p className="whitespace-pre-line">{content}</p>

          {/* Time display */}
          <span
            className={`text-[9px] block mt-2 text-right ${
              isInterviewer ? "text-textSecondary" : "text-indigo-200"
            }`}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatBubble;
