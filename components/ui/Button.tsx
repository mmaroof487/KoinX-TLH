// components/ui/Button.tsx
import { cn } from "@/utils/format";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-surface-200 disabled:text-ink-400 disabled:cursor-not-allowed",
  secondary: "bg-white text-ink-700 border border-surface-200 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost: "bg-transparent text-ink-600 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed",
  danger: "bg-loss-500 text-white hover:bg-loss-600 disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs font-medium rounded-lg",
  md: "px-4 py-2 text-sm font-medium rounded-xl",
  lg: "px-6 py-2.5 text-sm font-semibold rounded-xl",
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors duration-150 font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
