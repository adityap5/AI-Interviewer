import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "gray";
}

export const Badge = ({ children, className = "", variant = "gray", ...props }: BadgeProps) => {
  const baseStyle =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border select-none transition-colors duration-150";

  const variants = {
    primary: "bg-accent/10 border-accent/25 text-accent-light",
    secondary: "bg-indigo-500/10 border-indigo-400/20 text-indigo-400",
    success: "bg-success/10 border-success/20 text-success",
    warning: "bg-warning/10 border-warning/20 text-warning",
    error: "bg-error/10 border-error/20 text-error",
    gray: "bg-surface border-border text-textSecondary",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
