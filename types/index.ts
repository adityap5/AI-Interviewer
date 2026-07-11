export type InterviewRole = "frontend" | "backend" | "fullstack" | "dsa" | "system-design";

export type InterviewDifficulty = "junior" | "mid" | "senior";

export type InterviewType = "technical" | "behavioral" | "mixed";

export type SessionStatus = "in-progress" | "completed" | "cancelled";

export interface TechnologyOptions {
  frontend: string[];
  backend: string[];
}

export const TECHNOLOGY_OPTIONS: TechnologyOptions = {
  frontend: [
    'React', 'Next.js', 'Vue', 'Angular', 'TypeScript',
    'JavaScript', 'CSS/TailwindCSS', 'Redux', 'Testing (Jest/RTL)',
    'Performance Optimization', 'Web APIs', 'GraphQL'
  ],
  backend: [
    'Node.js', 'Express', 'Python/Django', 'Python/FastAPI',
    'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs', 'GraphQL',
    'Docker', 'AWS', 'System Design', 'Authentication/Security',
    'Message Queues'
  ]
};

export interface Message {
  role: "interviewer" | "user";
  content: string;
  timestamp: Date;
}

export interface Evaluation {
  questionIndex: number;
  technical: number; // 0-10
  clarity: number;   // 0-10
  depth: number;     // 0-10
  confidence: number; // 0-10
  overall: number;
  flags: string[];   // ["vague", "no example", "off-topic"]
  detailedFeedback: string;
  questionText: string;
  answerText: string;
}

export interface FinalScore {
  overall: number;
  technical: number;
  clarity: number;
  depth: number;
  confidence: number;
  strengths: string[];
  improvements: string[];
  recommendation: string; // "Ready for Junior" etc.
}

export interface Session {
  id?: string;
  _id?: string;
  userId: string;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  status: SessionStatus;
  messages: Message[];
  evaluations: Evaluation[];
  finalScore: FinalScore | null;
  totalQuestions: number;
  currentQuestionIndex: number;
  createdAt: Date;
  completedAt: Date | null;
}

export interface InterviewSetupForm {
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  selectedTechnologies: string[];
}
