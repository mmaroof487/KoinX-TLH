// utils/format.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const USD_COMPACT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const PCT = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const fmt = {
  usd: (v: number) => USD.format(v),
  usdCompact: (v: number) => USD_COMPACT.format(v),
  pct: (v: number) => PCT.format(v / 100),
  pctRaw: (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`,
  number: (v: number, dp = 6) => v.toLocaleString("en-US", { maximumFractionDigits: dp }),
};

export function pnlColor(val: number): string {
  if (val > 0) return "text-gain-600";
  if (val < 0) return "text-loss-600";
  return "text-ink-500";
}

export function pnlBg(val: number): string {
  if (val > 0) return "bg-gain-50 text-gain-700";
  if (val < 0) return "bg-loss-50 text-loss-700";
  return "bg-surface-100 text-ink-500";
}
