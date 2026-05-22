"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInputs) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.error || "Failed to register.");
      } else {
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-glow-effect">
      <div className="w-full max-w-[420px] relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white mb-3 shadow-lg shadow-accent/35 border border-indigo-400/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Get started free
          </h1>
          <p className="text-sm text-textSecondary mt-1">
            Build your skills with AI-powered practice
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                disabled={isLoading}
                placeholder="John Doe"
                {...register("name")}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 duration-150 text-sm"
              />
              {errors.name && (
                <p className="text-xs text-error font-medium mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled={isLoading}
                placeholder="john@example.com"
                {...register("email")}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 duration-150 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-error font-medium mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full px-4 py-2.5 pr-10 bg-background border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 duration-150 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors duration-150"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error font-medium mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 duration-150 text-sm"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-error font-medium mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-accent/25 duration-150 disabled:opacity-70 disabled:hover:bg-accent border border-indigo-400/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Switch to login */}
          <div className="mt-8 text-center border-t border-border/55 pt-6 text-sm text-textSecondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent font-semibold hover:text-accent-light hover:underline transition-colors duration-150"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
