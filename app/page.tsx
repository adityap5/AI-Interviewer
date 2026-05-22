import Link from "next/link";
import { ArrowRight, Sparkles, Code2, ShieldAlert, Cpu, Award } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-textPrimary relative overflow-x-hidden">
      {/* Dynamic background highlights */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="border-b border-border/80 bg-surface/30 backdrop-blur-md sticky top-0 z-20 py-4 px-6 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white border border-indigo-400/20 shadow-md shadow-accent/10">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-sm text-textPrimary uppercase tracking-wider">
            AI Interviewer
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs">Log In</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="text-xs">Sign Up Free</Button>
          </Link>
        </div>
      </nav>

      {/* Main hero showcase block */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-20 sm:py-32 flex flex-col items-center text-center space-y-8 relative z-10">
        
        {/* Dynamic badge announcement */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent-light text-[10px] font-bold uppercase tracking-wider select-none animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Running completely local via Ollama
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-textPrimary max-w-3xl leading-[1.1] select-none">
          Master your next tech mock run with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-400 to-accent-light">local AI</span>
        </h1>
        <p className="text-sm sm:text-base text-textSecondary max-w-xl leading-relaxed select-none">
          Practice frontend, backend, system design, or DSA mocks. Our adaptive interviewer challenges poor answers, guides weak paths, and generates rich scores instantly.
        </p>

        {/* Action controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-none pt-4">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full flex items-center gap-2 pr-4 shadow-lg shadow-accent/25 active:scale-95">
              Enter Workspace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full active:scale-95">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Core Pillars Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16 sm:pt-24 text-left">
          
          {/* Pillar 1 */}
          <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-textPrimary">Adaptive Difficulty</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              If you excel, AI probes edge-cases and distributed scales. If you stumble, the system adjusts to base concepts.
            </p>
          </Card>

          {/* Pillar 2 */}
          <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
              <Award className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-textPrimary">Semantic Diagnostics</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Parallel evaluator routines dissect concept depth, confidence ratios, keyword accuracy, and flow structures silently.
            </p>
          </Card>

          {/* Pillar 3 */}
          <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-textPrimary">Zero Cloud Leakage</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Driven via a local Ollama connection (mistral model). Your practice history, emails, and answers never leave your hardware.
            </p>
          </Card>

        </section>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-border/45 py-8 text-center text-[10px] text-textSecondary select-none">
        &copy; {new Date().getFullYear()} AI Mock Interviewer. Run locally, practice securely, get hired.
      </footer>
    </div>
  );
}
