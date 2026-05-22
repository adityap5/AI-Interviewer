"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Code,
  Server,
  Layers,
  Binary,
  GitBranch,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const setupSchema = z.object({
  role: z.enum(["frontend", "backend", "fullstack", "dsa", "system-design"]),
  difficulty: z.enum(["junior", "mid", "senior"]),
  interviewType: z.enum(["technical", "behavioral", "mixed"]),
});

type SetupInputs = z.infer<typeof setupSchema>;

const rolesList = [
  {
    id: "frontend",
    title: "Frontend Engineer",
    description: "Focus on UI architecture, React/Next.js, styling, performance, and accessibility.",
    icon: Code,
  },
  {
    id: "backend",
    title: "Backend Engineer",
    description: "Focus on databases, scaling, caching, API design, security, and messaging systems.",
    icon: Server,
  },
  {
    id: "fullstack",
    title: "Fullstack Engineer",
    description: "Test your skills end-to-end, combining front-end delivery with secure back-end scale.",
    icon: Layers,
  },
  {
    id: "dsa",
    title: "Algorithms & DSA",
    description: "Strict coding mock focusing on problem-solving, complexity analysis, and data structures.",
    icon: Binary,
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Architect massive distributed networks, microservices, load balancing, and storage tiers.",
    icon: GitBranch,
  },
] as const;

export default function InterviewSetupPage() {
  const router = useRouter();
  const { data: authSession } = useSession();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, watch, setValue, handleSubmit } = useForm<SetupInputs>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      role: "frontend",
      difficulty: "mid",
      interviewType: "technical",
    },
  });

  const selectedRole = watch("role");
  const selectedDifficulty = watch("difficulty");
  const selectedType = watch("interviewType");

  const onSubmit = async (data: SetupInputs) => {
    if (!authSession?.user?.id) {
      toast.error("You must be authenticated to start an interview");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: data.role,
          difficulty: data.difficulty,
          interviewType: data.interviewType,
          userId: authSession.user.id,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.error || "Failed to initialize interview.");
      } else {
        toast.success("Interview session initialized!");
        router.push(`/interview/${resData.sessionId}`);
      }
    } catch (err) {
      toast.error("Ollama connection failed or database issue occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRoleObj = rolesList.find((r) => r.id === selectedRole);

  const slideVariants = {
    hidden: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.15, ease: "easeIn" },
    }),
  };

  // Keep track of animation direction
  const [animDir, setAnimDir] = useState(1);

  const nextStep = () => {
    setAnimDir(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setAnimDir(-1);
    setStep((prev) => prev - 1);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-glow-effect max-w-5xl mx-auto w-full">
      <div className="w-full max-w-3xl relative z-10">
        {/* Progress header */}
        <div className="flex justify-between items-center mb-8 border-b border-border/45 pb-6">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">
              Step {step} of 3
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-textPrimary mt-1">
              Configure Mock Session
            </h1>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  s === step
                    ? "w-8 bg-accent"
                    : s < step
                    ? "w-4 bg-success/80"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait" custom={animDir}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={animDir}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-bold text-textPrimary">Select your Role</h2>
                    <p className="text-sm text-textSecondary mt-1">
                      Choose the discipline that matches your upcoming job interview focus.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rolesList.map((roleItem) => {
                      const Icon = roleItem.icon;
                      const isSelected = selectedRole === roleItem.id;
                      return (
                        <Card
                          key={roleItem.id}
                          hoverable
                          onClick={() => setValue("role", roleItem.id)}
                          className={`cursor-pointer transition-all border duration-200 relative ${
                            isSelected
                              ? "border-accent bg-accent/5 ring-1 ring-accent/30 shadow-lg shadow-accent/5"
                              : "border-border hover:border-border/80"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-accent text-white border-indigo-400/25"
                                  : "bg-background text-textSecondary border-border"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-sm font-semibold text-textPrimary">
                                {roleItem.title}
                              </h3>
                              <p className="text-xs text-textSecondary leading-relaxed">
                                {roleItem.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={animDir}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  {/* Difficulty Section */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-textPrimary">Select Difficulty</h2>
                      <p className="text-sm text-textSecondary mt-1">
                        AI will adapt question levels, expectations, and evaluation strictness based on this.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {(["junior", "mid", "senior"] as const).map((diff) => (
                        <Card
                          key={diff}
                          hoverable
                          onClick={() => setValue("difficulty", diff)}
                          className={`cursor-pointer text-center border py-6 transition-all duration-200 ${
                            selectedDifficulty === diff
                              ? "border-accent bg-accent/5 ring-1 ring-accent/30 shadow-lg shadow-accent/5"
                              : "border-border"
                          }`}
                        >
                          <h3 className="text-sm font-bold uppercase tracking-wider text-textPrimary">
                            {diff}
                          </h3>
                          <span className="text-[10px] text-textSecondary mt-1 block">
                            {diff === "junior"
                              ? "Baseline concepts"
                              : diff === "mid"
                              ? "Standard scale & APIs"
                              : "Deep architecture & tradeoffs"}
                          </span>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Interview Type Section */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-textPrimary">Interview Type</h2>
                      <p className="text-sm text-textSecondary mt-1">
                        Choose whether to focus purely on coding/designs, human behavior, or a hybrid mix.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {(["technical", "behavioral", "mixed"] as const).map((typeItem) => (
                        <Card
                          key={typeItem}
                          hoverable
                          onClick={() => setValue("interviewType", typeItem)}
                          className={`cursor-pointer text-center border py-6 transition-all duration-200 ${
                            selectedType === typeItem
                              ? "border-accent bg-accent/5 ring-1 ring-accent/30 shadow-lg shadow-accent/5"
                              : "border-border"
                          }`}
                        >
                          <h3 className="text-sm font-bold uppercase tracking-wider text-textPrimary">
                            {typeItem}
                          </h3>
                          <span className="text-[10px] text-textSecondary mt-1 block">
                            {typeItem === "technical"
                              ? "System design & code details"
                              : typeItem === "behavioral"
                              ? "STAR method questions"
                              : "50/50 blend"}
                          </span>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={animDir}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-bold text-textPrimary">Verify Configurations</h2>
                    <p className="text-sm text-textSecondary mt-1">
                      Almost ready! Confirm mock parameters below.
                    </p>
                  </div>

                  <Card className="border border-border/80 bg-surface/50 p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-border/30 pb-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium text-textPrimary">Target Role</span>
                      </div>
                      <span className="text-sm font-bold text-accent-light bg-accent/10 px-3 py-1 rounded-lg border border-accent/20">
                        {currentRoleObj?.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border/30 pb-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium text-textPrimary">Selected Level</span>
                      </div>
                      <Badge variant={selectedDifficulty === "junior" ? "gray" : selectedDifficulty === "mid" ? "warning" : "error"}>
                        {selectedDifficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between border-b border-border/30 pb-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium text-textPrimary">Session Focus</span>
                      </div>
                      <Badge variant="primary">{selectedType}</Badge>
                    </div>

                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium text-textPrimary">Total Questions</span>
                      </div>
                      <span className="text-sm font-bold text-textPrimary">6 Questions</span>
                    </div>
                  </Card>

                  <div className="p-4 bg-accent/5 border border-accent/15 rounded-xl flex gap-3 text-xs text-textSecondary leading-relaxed">
                    <Sparkles className="w-6 h-6 text-accent shrink-0" />
                    <p>
                      <strong>Adaptive difficulty is active.</strong> If you answer questions comprehensively, the interviewer will challenge you with harder edge-case architectures. If you struggle, the AI will pull back to baseline fundamentals.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex justify-between border-t border-border/45 pt-6">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  "Initializing AI..."
                ) : (
                  <>
                    Start Mock Interview
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
