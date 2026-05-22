import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import { InterviewRoomClient } from "@/components/InterviewRoom/InterviewRoomClient";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default async function InterviewRoomPage({ params }: PageProps) {
  try {
    await dbConnect();

    // Fetch the session document by ID
    const sessionDoc = (await Session.findById(params.sessionId).lean()) as any;

    if (!sessionDoc) {
      notFound();
    }

    // Safely serialize the Mongoose document to be plain JSON for client component hydrated states
    const serializedSession = {
      id: sessionDoc._id.toString(),
      role: sessionDoc.role,
      difficulty: sessionDoc.difficulty,
      interviewType: sessionDoc.interviewType,
      status: sessionDoc.status,
      currentQuestionIndex: sessionDoc.currentQuestionIndex,
      messages: Array.isArray(sessionDoc.messages)
        ? sessionDoc.messages.map((m: any) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : new Date().toISOString(),
          }))
        : [],
      evaluations: Array.isArray(sessionDoc.evaluations)
        ? sessionDoc.evaluations.map((e: any) => ({
            questionIndex: e.questionIndex,
            technical: e.technical,
            clarity: e.clarity,
            depth: e.depth,
            confidence: e.confidence,
            flags: e.flags || [],
            questionText: e.questionText,
            answerText: e.answerText,
          }))
        : [],
      finalScore: sessionDoc.finalScore
        ? {
            overall: sessionDoc.finalScore.overall,
            technical: sessionDoc.finalScore.technical,
            clarity: sessionDoc.finalScore.clarity,
            depth: sessionDoc.finalScore.depth,
            confidence: sessionDoc.finalScore.confidence,
            strengths: sessionDoc.finalScore.strengths || [],
            improvements: sessionDoc.finalScore.improvements || [],
            recommendation: sessionDoc.finalScore.recommendation,
          }
        : null,
    };

    return <InterviewRoomClient initialSession={serializedSession} />;
  } catch (error) {
    console.error("Failed to load interview room session in Server Component:", error);
    notFound();
  }
}
export const dynamic = "force-dynamic";
