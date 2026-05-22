import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", hoverable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-surface border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-200 ${
          hoverable ? "hover:border-accent/40 hover:-translate-y-[2px]" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 flex flex-col space-y-1.5 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-bold tracking-tight text-textPrimary ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = "" }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-xs text-textSecondary ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-6 flex items-center border-t border-border/50 pt-4 ${className}`}>{children}</div>
);

export default Card;
