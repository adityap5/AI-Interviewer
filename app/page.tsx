import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Cpu,
  Award,
  Settings,
  MessageSquare,
  Activity,
  LineChart,
  ShieldCheck,
  Zap,
  Play,
  UserCheck,
  Layers,
  Terminal,
  Database
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-textPrimary relative overflow-x-hidden">
      {/* Premium Ambient Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[60%] right-[-10%] w-[400px] h-[400px] bg-purple-500/3 blur-[120px] rounded-full pointer-events-none" />

      {/* Premium Top Navbar */}
      <nav className="border-b border-border/80 bg-surface/30 backdrop-blur-md sticky top-0 z-20 py-4 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white border border-indigo-400/20 shadow-md shadow-accent/15">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs text-textPrimary uppercase tracking-widest leading-none">
              AI Interviewer
            </span>
            <span className="text-[9px] text-accent font-bold uppercase tracking-wider mt-0.5">
              Mock Interviewer
            </span>
          </div>
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-sm font-semibold text-textSecondary hover:text-textPrimary transition-colors">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs font-semibold">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="text-xs font-bold shadow-lg shadow-accent/10">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 sm:py-24 flex flex-col items-center space-y-24 relative z-10">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Hardware Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/8 border border-accent/15 rounded-full text-indigo-300 text-[10px] font-bold uppercase tracking-widest select-none shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-accent animate-pulse" />
            Runs Completely Local via Ollama, Groq &amp; Gemma2:2b
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-textPrimary leading-[1.05] select-none">
            Master your next tech mock run with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-400 to-purple-400 drop-shadow-sm">
              Local AI
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-textSecondary max-w-2xl leading-relaxed select-none">
            An enterprise-grade, privacy-first technical interview coach. Practice frontend, backend, mixed, or system design scenarios entirely on your local CPU. Adaptive challenger follow-ups adjust to your answers, generating rich metrics in real-time.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md pt-4">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full flex items-center justify-center gap-2 pr-5 font-bold shadow-xl shadow-accent/20 active:scale-98 transition-all duration-200">
                Enter Workspace
                <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button variant="outline" className="w-full active:scale-98 font-bold border-border/80 bg-surface/10 hover:bg-surface/30 transition-all duration-200">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>

        {/* INTERACTIVE WORKSPACE MOCKUP SHOWCASE */}
        <section className="w-full max-w-5xl rounded-2xl border border-border/70 bg-surface/30 backdrop-blur-md p-4 sm:p-6 shadow-2xl relative">
          <div className="absolute -top-3 left-6 px-3 py-0.5 bg-indigo-500/10 border border-indigo-400/20 rounded text-[9px] font-mono text-accent-light font-bold tracking-wider uppercase">
            Live Workspace Preview
          </div>
          
          {/* Outer Grid simulating local screen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Chat Simulated Component */}
            <div className="lg:col-span-8 border border-border/40 bg-background/50 rounded-xl p-5 space-y-4 shadow-inner relative flex flex-col justify-between min-h-[300px]">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] font-mono text-textSecondary flex items-center gap-1.5 bg-surface/60 px-2 py-0.5 rounded border border-border/20">
                  <Terminal className="w-3 h-3 text-indigo-400" />
                  session_stream: active_gemma2
                </span>
              </div>
              
              {/* Question Bubble */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold shadow-sm">
                    AI
                  </div>
                  <div className="flex-1 bg-surface/40 border border-border/30 rounded-xl p-3.5 text-xs text-textPrimary leading-relaxed">
                    <span className="text-[10px] font-bold text-accent block mb-1">INTERVIEWER</span>
                    Explain how the Node.js event loop handles asynchronous operations. What are the key phases of the loop?
                  </div>
                </div>

                {/* Candidate Answer Bubble */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 bg-accent/10 border border-accent/15 rounded-xl p-3.5 text-xs text-textPrimary leading-relaxed max-w-[85%]">
                    <span className="text-[10px] font-bold text-indigo-300 block mb-1 text-right">YOU</span>
                    Node.js is single-threaded and uses an event loop. It delegates async work to Libuv threadpool...
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 text-xs font-bold">
                    U
                  </div>
                </div>

                {/* AI Streaming Response Simulated Bubble */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold shadow-sm">
                    AI
                  </div>
                  <div className="flex-1 bg-surface/40 border border-border/30 rounded-xl p-3.5 text-xs text-textPrimary leading-relaxed relative">
                    <span className="text-[10px] font-bold text-accent block mb-1">INTERVIEWER (STREAMING)</span>
                    While your answer covers the basics of Libuv, let&#39;s dive deeper. Can you explain the specific distinction between the <span className="bg-indigo-500/10 text-indigo-300 px-1 py-0.5 rounded font-mono text-[10px]">poll phase</span> and the <span className="bg-indigo-500/10 text-indigo-300 px-1 py-0.5 rounded font-mono text-[10px]">timers phase</span>? How are microtasks like Promises processed relative to these phases?
                    <span className="inline-block w-1.5 h-3.5 bg-accent ml-1 animate-pulse align-middle" />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-textSecondary border-t border-border/40 pt-2 flex items-center justify-between">
                <span>Adaptive Multiplier: <strong className="text-accent-light">1.2x (Challenging)</strong></span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  Raw text streaming active
                </span>
              </div>
            </div>

            {/* Simulated Evaluator / telemetry card */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="border border-border/40 bg-background/50 rounded-xl p-4 space-y-4 shadow-inner flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Activity className="w-3.5 h-3.5 text-accent" />
                    Parallel LLM Diagnostic
                  </h4>
                  <p className="text-[10px] text-textSecondary leading-normal mb-4">
                    In parallel, the system dissects your conceptual depth, technical accuracy, and structures silent scorecard metrics.
                  </p>
                  
                  {/* Metric sliders */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-textPrimary mb-1">
                        <span>Technical Accuracy</span>
                        <span className="text-accent">9 / 10</span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "90%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-textPrimary mb-1">
                        <span>Clarity &amp; Flow</span>
                        <span className="text-purple-400">8 / 10</span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: "80%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-textPrimary mb-1">
                        <span>Concept Depth</span>
                        <span className="text-indigo-400">7 / 10</span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: "70%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-textPrimary mb-1">
                        <span>Confidence Ratio</span>
                        <span className="text-indigo-300">8 / 10</span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-300 rounded-full" style={{ width: "80%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scorecard Flags block */}
                <div className="bg-surface/50 border border-border/30 rounded-lg p-2.5 text-[9px] space-y-1">
                  <span className="font-bold text-indigo-300 uppercase block mb-1">Detected flags:</span>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded-full font-semibold">
                      ✓ libuv_threadpool_explained
                    </span>
                    <span className="bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">
                      ⚠ microtask_delay
                    </span>
                  </div>
                </div>
              </div>

              {/* Ollama local speed diagnostic card */}
              <div className="border border-border/40 bg-accent/5 rounded-xl p-3.5 flex items-center justify-between border-dashed">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-accent/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-textPrimary">CPU Latency Optimized</h5>
                    <p className="text-[9px] text-textSecondary">Gemma 2B average execution: 1.4s</p>
                  </div>
                </div>
                <span className="text-[8px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/25 px-1.5 py-0.5 rounded uppercase">
                  Fast
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - VISUAL TIMELINE */}
        <section className="w-full space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-textPrimary tracking-tight">
              How the AI Mock Workspace Works
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-xl mx-auto leading-relaxed">
              Our advanced local pipelines seamlessly handle session initialization, text streaming, parallel evaluation, and adaptive difficulty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative space-y-4">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/40 z-0 hidden md:block" />
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center font-black text-xs text-accent relative z-10 shadow-md">
                1
              </div>
              <h3 className="text-sm font-bold text-textPrimary flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-400" />
                Customize Setup
              </h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Choose your focus (Frontend, Backend, System Design, or DSA), experience difficulty, and mock category before starting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-4">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/40 z-0 hidden md:block" />
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center font-black text-xs text-accent relative z-10 shadow-md">
                2
              </div>
              <h3 className="text-sm font-bold text-textPrimary flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Stream-Flow Q&amp;A
              </h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                The local AI kicks off the interview. Type your responses and watch follow-up questions stream in instantly word-by-word.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-4">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/40 z-0 hidden md:block" />
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center font-black text-xs text-accent relative z-10 shadow-md">
                3
              </div>
              <h3 className="text-sm font-bold text-textPrimary flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Promise.all Analysis
              </h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                We trigger `evaluateAnswer` and next streams concurrently. Evaluates semantic depth and technical precision in parallel.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative space-y-4">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center font-black text-xs text-accent relative z-10 shadow-md">
                4
              </div>
              <h3 className="text-sm font-bold text-textPrimary flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-indigo-400" />
                Scorecard Synthesis
              </h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                After 6 rounds, the system compiles aggregate trends, weakness diagnostics, and concrete feedback suggestions.
              </p>
            </div>
          </div>
        </section>

        {/* APP FEATURES GRID */}
        <section className="w-full space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-textPrimary tracking-tight">
              Packed with Production-Quality Features
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-xl mx-auto leading-relaxed">
              Designed from scratch to look stunning, perform brilliantly, and guarantee total data ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4">
            
            {/* Feature 1 */}
            <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-textPrimary">100% Secure &amp; Air-Gapped</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                All mock history, credentials, and scores remain locally stored in your MongoDB. Your private data never touches external clouds.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-textPrimary">Concurrent Thread Parallelism</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Initiates AI evaluation and stream generations concurrently using Promise structures. Halves operational latency under local hardware constraints.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-textPrimary">Mongoose Persistence Engine</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Structured schemas record emails, message threads, individual scorecard reviews, and difficulty configurations cleanly in MongoDB.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-textPrimary">Gemma 2B CPU Optimization</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Runs with minimal system memory footprint. Serves follow-up queries locally in less than 2 seconds, completely eliminating slow cloud delays.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-textPrimary">Stable Auth v4 Integration</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Fully protected NextAuth.js system shielding dashboards and rooms. Session payloads keep user identifiers secure at both edge layers.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card hoverable className="border-border/60 bg-surface/20 p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-accent flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-textPrimary">Diagnostic Scoring Trends</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Beautiful responsive Recharts visualizations map technical metrics, concept gaps, and scoring diagnostics across multiple mock sessions.
              </p>
            </Card>

          </div>
        </section>

        {/* CTA BOTTOM BANNER */}
        <section className="w-full max-w-4xl bg-gradient-to-r from-accent/15 via-indigo-500/10 to-purple-500/10 border border-border/80 rounded-2xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_80%)] pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-textPrimary tracking-tight">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto leading-relaxed">
            Register your local profile, spin up the setup wizard, and practice mocks at zero cost, securely on your own device.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center max-w-xs sm:max-w-none mx-auto">
            <Link href="/register">
              <Button className="w-full sm:w-auto flex items-center justify-center gap-2 pr-5 font-bold shadow-lg shadow-accent/20">
                <Play className="w-4 h-4 fill-current" />
                Start Practicing Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto font-bold bg-surface/20 border-border/75">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-border/45 py-8 text-center text-[10px] text-textSecondary select-none">
        &copy; {new Date().getFullYear()} AI Mock Interviewer. Run locally, practice securely, get hired.
      </footer>
    </div>
  );
}
