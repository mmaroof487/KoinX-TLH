// components/dashboard/PortfolioSummary.tsx
"use client";
import { TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react";
import { fmt, pnlColor } from "@/utils/format";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { Tooltip } from "@/components/ui/Tooltip";
import type { PortfolioSummary as Summary } from "@/types";

interface Props {
  summary: Summary | null;
  loading: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  tooltip?: string;
}

function StatCard({ icon, label, value, sub, subColor, tooltip }: StatCardProps) {
  return (
    <div className="card p-5 card-hover">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-bold text-ink-500/80 uppercase tracking-widest">{label}</span>
        <div className="p-1.5 rounded-lg bg-surface-100 text-ink-400">{icon}</div>
      </div>
      <p className="text-3xl font-display font-bold text-ink-900 tracking-tight">{value}</p>
      {sub && (
        <p className={`mt-1 text-xs font-medium ${subColor ?? "text-ink-400"}`}>{sub}</p>
      )}
    </div>
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      <StatCard
        icon={<Wallet className="w-4 h-4" />}
        label="Portfolio Value"
        value={fmt.usdCompact(summary.totalValue)}
        sub={`Invested: ${fmt.usdCompact(summary.totalInvested)}`}
        subColor="text-ink-400"
      />
      <StatCard
        icon={summary.totalUnrealizedPnL >= 0
          ? <TrendingUp className="w-4 h-4" />
          : <TrendingDown className="w-4 h-4" />}
        label="Unrealized P&L"
        value={`${pnlSign}${fmt.usd(summary.totalUnrealizedPnL)}`}
        sub={fmt.pctRaw(summary.totalUnrealizedPnLPct)}
        subColor={pnlColor(summary.totalUnrealizedPnL)}
      />
      <StatCard
        icon={<TrendingUp className="w-4 h-4" />}
        label="Taxable Gains"
        value={fmt.usd(summary.totalTaxableGains)}
        sub={`ST: ${fmt.usd(summary.shortTermGains)} | LT: ${fmt.usd(summary.longTermGains)}`}
        subColor="text-ink-400"
      />
      <StatCard
        icon={<Receipt className="w-4 h-4" />}
        label="Est. Tax Liability"
        value={fmt.usd(summary.estimatedTax)}
        sub="@ 30% + 4% cess"
        subColor="text-loss-600"
      />
    </div>
  );
}
