"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for trying out the AI interviewer.",
    features: [
      "2 total interviews",
      "All roles included",
      "Technology selection",
      "AI scorecard",
      "No history",
      "No analytics",
    ],
    buttonText: "Current Plan",
    buttonDisabled: true,
  },
  {
    name: "Pro",
    price: "₹299",
    period: "per month",
    description: "Consistent practice to land your dream job.",
    features: [
      "30 interviews/month",
      "All roles included",
      "Technology selection",
      "AI scorecard",
      "Full history",
      "Analytics",
      "Priority AI",
    ],
    buttonText: "Coming Soon",
    buttonDisabled: true,
    isPopular: true,
  },
  {
    name: "Lifetime",
    price: "₹999",
    period: "one time",
    description: "Pay once and practice forever.",
    features: [
      "Everything in Pro",
      "Unlimited interviews",
      "Early access to features",
    ],
    buttonText: "Coming Soon",
    buttonDisabled: true,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert("We'll notify you when paid plans launch");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary relative overflow-x-hidden pt-10 pb-24">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.05)_0%,transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white border border-indigo-400/20 shadow-md shadow-accent/10">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-sm text-textPrimary uppercase tracking-wider">
            AI Interviewer
          </span>
        </div>
        {session ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-textSecondary hover:text-textPrimary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-textSecondary hover:text-textPrimary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-textSecondary text-sm sm:text-base leading-relaxed"
          >
            Start for free and upgrade when you need more practice. No hidden fees.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className={`relative flex flex-col p-8 rounded-3xl border bg-surface/50 backdrop-blur-md ${
                plan.isPopular
                  ? "border-accent ring-1 ring-accent/30 shadow-xl shadow-accent/10"
                  : "border-border/60 shadow-lg"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-lg font-bold text-textPrimary">{plan.name}</h3>
                <p className="text-xs text-textSecondary mt-2 h-8">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-sm font-medium text-textSecondary">/{plan.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-accent" />
                    </div>
                    <span className="text-sm text-textSecondary">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={plan.buttonDisabled}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  plan.name === "Free"
                    ? "bg-surface border border-border/80 text-textSecondary opacity-70 cursor-not-allowed"
                    : "bg-surface border border-border text-textSecondary opacity-60 cursor-not-allowed"
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Waitlist Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-24 max-w-xl mx-auto text-center space-y-6 bg-surface/30 border border-border/50 rounded-2xl p-8 shadow-xl"
        >
          <div>
            <h4 className="text-xl font-bold text-textPrimary">Join the Pro Waitlist</h4>
            <p className="text-sm text-textSecondary mt-2">
              Paid plans are currently in development. Leave your email and we'll notify you when we launch.
            </p>
          </div>
          <form onSubmit={handleNotifyMe} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-bold shadow-lg shadow-accent/20 transition-all active:scale-95"
            >
              Notify Me
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
