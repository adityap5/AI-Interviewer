import { create } from "zustand";
import { Message, Evaluation, FinalScore, SessionStatus } from "@/types";

interface InterviewState {
  sessionId: string | null;
  messages: Message[];
  evaluations: Evaluation[];
  currentQuestionIndex: number;
  status: SessionStatus;
  isAITyping: boolean;
  finalScore: FinalScore | null;

  // Actions
  setSessionId: (id: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  addEvaluation: (evaluation: Evaluation) => void;
  setEvaluations: (evaluations: Evaluation[]) => void;
  setAITyping: (typing: boolean) => void;
  setStatus: (status: SessionStatus) => void;
  setFinalScore: (score: FinalScore | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  sessionId: null,
  messages: [],
  evaluations: [],
  currentQuestionIndex: 0,
  status: "in-progress",
  isAITyping: false,
  finalScore: null,

  setSessionId: (id) => set({ sessionId: id }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  addEvaluation: (evaluation) =>
    set((state) => ({ evaluations: [...state.evaluations, evaluation] })),
  setEvaluations: (evaluations) => set({ evaluations }),
  setAITyping: (typing) => set({ isAITyping: typing }),
  setStatus: (status) => set({ status }),
  setFinalScore: (score) => set({ finalScore: score }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  reset: () =>
    set({
      sessionId: null,
      messages: [],
      evaluations: [],
      currentQuestionIndex: 0,
      status: "in-progress",
      isAITyping: false,
      finalScore: null,
    }),
}));
