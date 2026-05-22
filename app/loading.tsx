export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-textPrimary px-4 relative bg-glow-effect">
      <div className="relative z-10 flex flex-col items-center">
        {/* Loading Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
          <div className="absolute inset-2 rounded-full border-4 border-b-accent border-t-transparent border-r-transparent border-l-transparent animate-spin [animation-duration:1.5s]"></div>
        </div>

        {/* Loading text */}
        <h2 className="mt-8 text-xl font-bold tracking-tight text-textPrimary animate-pulse">
          Loading platform...
        </h2>
        <p className="mt-2 text-sm text-textSecondary text-center max-w-[280px]">
          Initializing mock session environment and compiling parameters.
        </p>
      </div>
    </div>
  );
}
