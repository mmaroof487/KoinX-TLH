// components/ui/Button.tsx
import { cn } from "@/utils/format";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-brand-500 text-surface-50 shadow-sm hover:bg-brand-400 hover:shadow-button-glow hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:bg-surface-200 disabled:text-ink-400 disabled:cursor-not-allowed",
  secondary: "bg-surface-100 text-ink-900 border border-white/5 hover:bg-surface-200 hover:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost: "bg-transparent text-ink-500 hover:text-ink-900 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed",
  danger: "bg-loss-500 text-white hover:bg-loss-600 disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs font-medium rounded-lg",
  md: "px-5 py-2 text-sm font-medium rounded-xl",
  lg: "px-7 py-3 text-sm font-semibold rounded-2xl",
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 font-medium active:scale-[0.98]",
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
