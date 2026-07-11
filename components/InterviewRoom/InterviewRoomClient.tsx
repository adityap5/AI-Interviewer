"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/store/interviewStore";
import { Message, Evaluation, FinalScore } from "@/types";
import { InterviewHeader } from "./InterviewHeader";
import { ChatBubble } from "./ChatBubble";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { AnswerInput } from "./AnswerInput";
import { ScoreCard } from "@/components/Scorecard/ScoreCard";
import { CancelModal } from "./CancelModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface InterviewRoomClientProps {
  initialSession: {
    id: string;
    role: string;
    difficulty: string;
    interviewType: string;
    status: string;
    currentQuestionIndex: number;
    messages: { role: string; content: string; timestamp: string }[];
    evaluations: any[];
    finalScore: any | null;
  };
}

export function InterviewRoomClient({ initialSession }: InterviewRoomClientProps) {
  const store = useInterviewStore();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [streamingText, setStreamingText] = useState("");
  const [isSynthesizingScore, setIsSynthesizingScore] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch("/api/interview/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: store.sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel session.");
      }

      toast.success("Interview cancelled.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel.");
      setIsCancelling(false);
      setIsCancelModalOpen(false);
    }
  };

  // Initialize store on mount
  useEffect(() => {
    store.reset();
    store.setSessionId(initialSession.id);
    store.setMessages(
      initialSession.messages.map((m) => ({
        role: m.role as "interviewer" | "user",
        content: m.content,
        timestamp: new Date(m.timestamp),
      }))
    );
    store.setEvaluations(initialSession.evaluations);
    store.setCurrentQuestionIndex(initialSession.currentQuestionIndex);
    store.setStatus(initialSession.status as "in-progress" | "completed");
    if (initialSession.finalScore) {
      store.setFinalScore(initialSession.finalScore);
    }
  }, [initialSession]);

  // Autoscroll helper when new text flows in
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [store.messages, streamingText, store.isAITyping]);

  const handleAnswerSubmit = async (answerText: string) => {
    if (store.status === "completed" || store.isAITyping) return;

    const currentIndex = store.currentQuestionIndex;

    // 1. Append the user's response to the client state immediately
    const userMsg: Message = {
      role: "user",
      content: answerText,
      timestamp: new Date(),
    };
    store.addMessage(userMsg);
    store.setAITyping(true);

    try {
      // 2. POST the answer to the API
      const response = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: store.sessionId,
          answer: answerText,
          questionIndex: currentIndex,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Ollama is offline or database error occurred.");
      }

      // Check if interview is complete
      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        // Interview complete - backend returned JSON with finalScore
        const data = await response.json();
        if (data.interviewComplete) {
          store.setFinalScore(data.finalScore);
          store.setStatus("completed");
          store.setAITyping(false);
          return;
        }
      }

      // Otherwise read as stream (questions 1-9)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";

      store.addMessage({ role: "interviewer", content: "", timestamp: new Date() });

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          aiMessage += chunk;
          // Update last message in store progressively
          store.updateLastMessage(aiMessage);
        }
      }

      store.setCurrentQuestionIndex(currentIndex + 1);
      store.setAITyping(false);

    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
      store.setAITyping(false);
    }
  };

  // If scorecard is compiled, show transition to scorecard
  if (store.status === "completed" && store.finalScore && !isSynthesizingScore) {
    return (
      <div className="flex-1 py-12 px-6 bg-background">
        <ScoreCard
          finalScore={store.finalScore}
          role={initialSession.role}
          difficulty={initialSession.difficulty}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background radial shine */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <InterviewHeader
        role={initialSession.role}
        difficulty={initialSession.difficulty}
        questionIndex={store.currentQuestionIndex}
        totalQuestions={10}
        onCancelClick={() => setIsCancelModalOpen(true)}
      />

      {/* Chat scroll workspace */}
      <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10 max-w-4xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {store.messages.map((message, idx) => (
            <ChatBubble
              key={idx}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}

          {/* Render typing bounce dots if no text is stream-flowing yet */}
          {store.isAITyping && store.messages[store.messages.length - 1]?.content === "" && <ThinkingIndicator />}

          {/* Render Scorecard Synthesizer loading screen */}
          {isSynthesizingScore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-2xl text-center space-y-4 max-w-sm mx-auto shadow-2xl mt-8"
            >
              <div className="relative w-12 h-12">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-textPrimary">Synthesizing Scorecard</h3>
                <p className="text-[11px] text-textSecondary mt-1 leading-relaxed">
                  Analyzing semantic patterns, technical keywords, concept depth, and confidence ratios...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* Input panel fixed at bottom */}
      {store.status === "in-progress" && (
        <AnswerInput onSubmit={handleAnswerSubmit} disabled={store.isAITyping || isSynthesizingScore} />
      )}

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        isCancelling={isCancelling}
      />
    </div>
  );
}

export default InterviewRoomClient;
