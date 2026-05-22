"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely (no production console.logs, but standard system-level logger placeholder if needed)
    console.error("Global boundary error occurred:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-textPrimary px-4 relative bg-glow-effect">
      <div className="relative z-10 flex flex-col items-center max-w-md text-center">
        {/* Error icon */}
        <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error text-2xl mb-6 animate-pulse">
          ⚠️
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
          Something went wrong
        </h1>
        <p className="mt-3 text-textSecondary text-sm leading-relaxed">
          An unexpected error occurred in the application. This could be due to a lost connection or an internal routing fault.
        </p>

        {error.digest && (
          <code className="mt-4 px-2 py-1 bg-surface border border-border text-xs rounded text-textSecondary font-mono">
            Error ID: {error.digest}
          </code>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-accent/20 border border-indigo-400/20 duration-150"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-2.5 bg-surface hover:bg-border text-textPrimary text-sm font-medium rounded-lg border border-border transition-colors duration-150"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
