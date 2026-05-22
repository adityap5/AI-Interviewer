import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "primary", size = "md", isLoading, disabled, ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none";

    const variants = {
      primary: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 border border-indigo-400/20",
      secondary: "bg-surface hover:bg-border border border-border text-textPrimary",
      outline: "bg-transparent border border-border hover:bg-border text-textPrimary",
      ghost: "bg-transparent hover:bg-surface text-textSecondary hover:text-textPrimary",
      danger: "bg-error/15 border border-error/30 text-error hover:bg-error/25 shadow-lg shadow-error/10",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
