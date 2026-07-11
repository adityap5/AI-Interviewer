"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewsUsed: number;
  interviewsLimit: number;
}

export function PricingModal({
  isOpen,
  onClose,
  interviewsUsed,
  interviewsLimit,
}: PricingModalProps) {
  const router = useRouter();
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark Overlay (Not clickable to dismiss) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 text-center border-b border-border/50 bg-accent/5">
            <div className="mx-auto w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-textPrimary">Free Limit Reached</h2>
            <p className="text-sm text-textSecondary mt-2">
              You have used all your free mock interviews.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Usage Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-textSecondary">Free Interviews Used</span>
                <span className="text-error">{interviewsUsed} / {interviewsLimit}</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden border border-border/50">
                <div 
                  className="h-full bg-error rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (interviewsUsed / interviewsLimit) * 100)}%` }}
                />
              </div>
            </div>

            {/* Teaser Plans */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 border border-border rounded-xl bg-background/50 text-center opacity-75 grayscale">
                <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">Pro</h3>
                <p className="text-lg font-black mt-1">₹299</p>
                <p className="text-[10px] text-textSecondary mt-1">/ month</p>
              </div>
              <div className="p-4 border border-border rounded-xl bg-background/50 text-center opacity-75 grayscale">
                <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">Lifetime</h3>
                <p className="text-lg font-black mt-1">₹999</p>
                <p className="text-[10px] text-textSecondary mt-1">one time</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link href="/pricing" className="block w-full">
                <Button className="w-full flex justify-center items-center gap-2 font-bold shadow-lg shadow-accent/20">
                  View Pricing <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full text-textSecondary hover:text-textPrimary bg-surface/50 border-border/80"
                onClick={() => {
                  onClose();
                  router.push("/dashboard");
                }}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
