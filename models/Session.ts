import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ["interviewer", "user"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  questionIndex: {
    type: Number,
  },
});

const EvaluationSchema = new Schema({
  questionIndex: {
    type: Number,
    required: true,
  },
  technical: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  clarity: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  depth: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  overall: {
    type: Number,
  },
  detailedFeedback: {
    type: String,
  },
  flags: {
    type: [String],
    default: [],
  },
  questionText: {
    type: String,
    required: true,
  },
  answerText: {
    type: String,
    required: true,
  },
});

const FinalScoreSchema = new Schema({
  overall: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  technical: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  clarity: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  depth: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  strengths: {
    type: [String],
    default: [],
  },
  improvements: {
    type: [String],
    default: [],
  },
  recommendation: {
    type: String,
    required: true,
  },
});

const SessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["frontend", "backend", "fullstack", "dsa", "system-design"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["junior", "mid", "senior"],
      required: true,
    },
    interviewType: {
      type: String,
      enum: ["technical", "behavioral", "mixed"],
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "cancelled"],
      default: "in-progress",
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    evaluations: {
      type: [EvaluationSchema],
      default: [],
    },
    finalScore: {
      type: FinalScoreSchema,
      default: null,
    },
    totalQuestions: {
      type: Number,
      default: 10,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    difficultyMultiplier: {
      type: Number,
      default: 1.0,
    },
    selectedTechnologies: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
    },
    questionsAnswered: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Session = models.Session || model("Session", SessionSchema);

export default Session;
