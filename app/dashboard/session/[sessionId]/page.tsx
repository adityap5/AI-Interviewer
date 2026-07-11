import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import { SessionDetail } from "@/components/Dashboard/SessionDetail";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SessionDetailPage({ params }: { params: { sessionId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await dbConnect();

  const mockSession = await Session.findOne({
    _id: params.sessionId,
    userId: session.user.id,
  }).lean();

  if (!mockSession) {
    notFound();
  }

  // Serialize for client component
  const serializedSession = JSON.parse(JSON.stringify(mockSession));

  return (
    <div className="flex-1 flex flex-col bg-background text-textPrimary relative overflow-x-hidden min-h-screen">
      <div className="max-w-4xl mx-auto w-full px-6 py-10">
        <Link href="/dashboard" className="text-accent hover:underline flex items-center gap-2 mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <SessionDetail session={serializedSession} />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
