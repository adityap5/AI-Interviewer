"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully logged in!");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-glow-effect">
      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo/Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white mb-3 shadow-lg shadow-accent/35 border border-indigo-400/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Welcome back
          </h1>
          <p className="text-sm text-textSecondary mt-1">
            Access your AI Mock Interview platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled={isLoading}
                placeholder="you@example.com"
                {...register("email")}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 duration-150 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-error font-medium mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full px-4 py-3 pr-10 bg-background border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 duration-150 text-sm"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-accent/25 duration-150 disabled:opacity-70 disabled:hover:bg-accent border border-indigo-400/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Prompt to register */}
          <div className="mt-8 text-center border-t border-border/55 pt-6 text-sm text-textSecondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-accent font-semibold hover:text-accent-light hover:underline transition-colors duration-150"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
