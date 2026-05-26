// components/dashboard/PortfolioSummary.tsx
"use client";
import { TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { fmt, pnlColor } from "@/utils/format";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { Tooltip } from "@/components/ui/Tooltip";
import { NumberTicker } from "@/components/ui/NumberTicker";
import type { PortfolioSummary as Summary } from "@/types";

interface Props {
  summary: Summary | null;
  loading: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  format: (v: number) => string;
  prefix?: string;
  sub?: string;
  subColor?: string;
  delay?: number;
}

function StatCard({ icon, label, value, format, prefix = "", sub, subColor, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="card p-5 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-transparent to-brand-500/0 group-hover:from-brand-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
      <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" style={{ zIndex: -1, padding: "1px", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
      
      <div className="flex items-start justify-between mb-3 relative z-10">
        <span className="text-[11px] font-bold text-ink-500 uppercase tracking-widest">{label}</span>
        <div className="p-1.5 rounded-lg bg-white/5 text-ink-400 group-hover:text-brand-400 transition-colors">{icon}</div>
      </div>
      <div className="flex items-baseline text-3xl font-display font-bold text-ink-900 tracking-tight relative z-10">
        {prefix}
        <NumberTicker value={value} format={format} delay={delay * 0.1} />
      </div>
      {sub && (
        <p className={`mt-1 text-xs font-medium relative z-10 ${subColor ?? "text-ink-400"}`}>{sub}</p>
      )}
    </motion.div>
  );
}

export function PortfolioSummaryCards({ summary, loading }: Props) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const pnlSign = summary.totalUnrealizedPnL >= 0 ? "+" : "";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        delay={0}
        icon={<Wallet className="w-4 h-4" />}
        label="Portfolio Value"
        value={summary.totalValue}
        format={fmt.usdCompact}
        sub={`Invested: ${fmt.usdCompact(summary.totalInvested)}`}
        subColor="text-ink-400"
      />
      <StatCard
        delay={1}
        icon={summary.totalUnrealizedPnL >= 0
          ? <TrendingUp className="w-4 h-4" />
          : <TrendingDown className="w-4 h-4" />}
        label="Unrealized P&L"
        prefix={pnlSign}
        value={summary.totalUnrealizedPnL}
        format={fmt.usd}
        sub={fmt.pctRaw(summary.totalUnrealizedPnLPct)}
        subColor={pnlColor(summary.totalUnrealizedPnL)}
      />
      <StatCard
        delay={2}
        icon={<TrendingUp className="w-4 h-4" />}
        label="Taxable Gains"
        value={summary.totalTaxableGains}
        format={fmt.usd}
        sub={`ST: ${fmt.usd(summary.shortTermGains)} | LT: ${fmt.usd(summary.longTermGains)}`}
        subColor="text-ink-400"
      />
      <StatCard
        delay={3}
        icon={<Receipt className="w-4 h-4" />}
        label="Est. Tax Liability"
        value={summary.estimatedTax}
        format={fmt.usd}
        sub="@ 30% + 4% cess"
        subColor="text-loss-500"
      />
    </div>
  );
}
