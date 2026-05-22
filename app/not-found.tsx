export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-textPrimary px-4 relative bg-glow-effect">
      <div className="relative z-10 flex flex-col items-center max-w-md text-center">
        {/* 404 Display */}
        <h1 className="text-8xl font-extrabold tracking-widest text-indigo-500/20 font-mono select-none">
          404
        </h1>
        <div className="absolute -translate-y-8 bg-background border border-border px-3 py-1 text-xs font-mono text-accent rounded uppercase tracking-wider">
          Page Not Found
        </div>

        <h2 className="mt-8 text-xl font-bold tracking-tight text-textPrimary">
          Lost in hyperspace?
        </h2>
        <p className="mt-3 text-textSecondary text-sm leading-relaxed">
          The page you are looking for does not exist or has been shifted. Let's get you back on track to your interview preparation.
        </p>

        <a
          href="/dashboard"
          className="mt-8 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg shadow-lg shadow-accent/20 border border-indigo-400/20 transition-colors duration-150"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
