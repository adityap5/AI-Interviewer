"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PricingModal } from "@/components/PricingModal";

interface UsageData {
  interviewsUsed: number;
  interviewsLimit: number;
  interviewsRemaining: number;
  isLimitReached: boolean;
}

export function DashboardUsageClient() {
  const router = useRouter();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/user/usage");
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } catch (err) {
        console.error("Failed to fetch usage:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsage();
  }, []);

  const handleStartMock = () => {
    if (usage?.isLimitReached) {
      setIsModalOpen(true);
    } else {
      router.push("/interview/setup");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border/50 pb-8 lg:col-span-12">
        <div className="w-full">
          {/* We assume the Welcome text is rendered outside, above this component or alongside it. 
              Actually, let's put the button and the usage bar here. */}
          {isLoading ? (
            <div className="w-full space-y-3 bg-surface/30 p-4 rounded-xl border border-border/40 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-border rounded w-1/3"></div>
                <div className="h-4 bg-border rounded w-12"></div>
              </div>
              <div className="h-2 bg-border rounded-full w-full"></div>
            </div>
          ) : usage ? (
            <div className="w-full space-y-2 bg-surface/30 p-4 rounded-xl border border-border/40">
              <div className="flex justify-between items-end text-sm">
                <div>
                  <span className="font-semibold text-textPrimary">Free interviews used</span>
                  <span className="block text-xs mt-1">
                    {usage.isLimitReached ? (
                      <span className="text-error font-bold">Limit reached · Paid plans coming soon</span>
                    ) : (
                      <span className="text-textSecondary">{usage.interviewsRemaining} interviews remaining</span>
                    )}
                    {" · "}
                    <Link href="/pricing" className="text-accent hover:underline">
                      See plans &rarr;
                    </Link>
                  </span>
                </div>
                <span className={`font-bold ${usage.isLimitReached ? 'text-error' : 'text-textPrimary'}`}>
                  {usage.interviewsUsed} / {usage.interviewsLimit}
                </span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden border border-border/50">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${usage.isLimitReached ? 'bg-error' : 'bg-accent'}`}
                  style={{ width: `${Math.min(100, (usage.interviewsUsed / usage.interviewsLimit) * 100)}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <Button 
            onClick={handleStartMock} 
            disabled={isLoading}
            className="w-full flex items-center gap-2 shadow-lg shadow-accent/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Start New Mock
                <PlayCircle className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {usage && (
        <PricingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          interviewsUsed={usage.interviewsUsed}
          interviewsLimit={usage.interviewsLimit}
        />
      )}
    </>
  );
}
