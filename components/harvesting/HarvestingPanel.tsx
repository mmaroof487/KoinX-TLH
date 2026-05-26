// components/harvesting/HarvestingPanel.tsx
"use client";
import { useMemo } from "react";
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fmt, cn } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import type { PortfolioSummary, HarvestingResult } from "@/types";

interface Props {
  summary: PortfolioSummary | null;
  harvestingResult: HarvestingResult | null;
  selectedCount: number;
  loading: boolean;
  onHarvest: () => void;
}

interface CompareRowProps {
  label: string;
  before: string;
  after: string;
  positive?: boolean; // whether "after" is better
  highlight?: boolean;
}

function CompareRow({ label, before, after, positive, highlight }: CompareRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-3.5 border-b border-white/5 last:border-0",
      highlight && "bg-brand-500/10 -mx-5 px-5"
    )}>
      <span className="text-sm text-ink-500 font-medium tracking-wide">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-700">{before}</span>
        <ArrowRight className="w-3.5 h-3.5 text-ink-500 flex-shrink-0" />
        <motion.span
          key={after}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-sm font-semibold tracking-tight",
            positive === true && "text-gain-400",
            positive === false && "text-loss-400",
            positive === undefined && "text-ink-900"
          )}>
          {after}
        </motion.span>
      </div>
    </div>
  );
}

export function HarvestingPanel({ summary, harvestingResult, selectedCount, loading, onHarvest }: Props) {
  const hasSavings = (harvestingResult?.taxSavings ?? 0) > 0;

  if (loading || !summary || !harvestingResult) {
    return (
      <div className="card p-5 space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-[1.25rem] overflow-hidden shadow-[0_0_40px_rgba(0,255,204,0.1)] bg-gradient-to-br from-surface-100 to-surface-300 border border-brand-500/20 animate-slide-up text-ink-900 ring-1 ring-white/5 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent pointer-events-none" />
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/5 bg-white/5 relative">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-5 h-5 text-brand-400" />
          <h2 className="font-display font-semibold text-ink-900 text-lg tracking-tight">Tax Impact Summary</h2>
        </div>
        <p className="text-xs text-ink-500 font-medium tracking-wide">
          {selectedCount === 0
            ? "Select assets in loss to see your potential tax savings"
            : `${selectedCount} asset${selectedCount > 1 ? "s" : ""} selected for harvesting`}
        </p>
      </div>

      <div className="px-5 py-4">
        {/* Before/After comparison */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-ink-500">Before Harvesting</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-400">After Harvesting</span>
          </div>

          <CompareRow
            label="Taxable Gains"
            before={fmt.usd(summary.totalTaxableGains)}
            after={fmt.usd(harvestingResult.gainsAfterHarvesting)}
            positive={harvestingResult.gainsAfterHarvesting < summary.totalTaxableGains}
          />
          <CompareRow
            label="Harvestable Loss"
            before="—"
            after={selectedCount > 0 ? fmt.usd(harvestingResult.totalHarvestableLoss) : "—"}
          />
          <CompareRow
            label="Tax Liability"
            before={fmt.usd(summary.estimatedTax)}
            after={fmt.usd(harvestingResult.newTaxLiability)}
            positive={harvestingResult.newTaxLiability < summary.estimatedTax}
            highlight
          />
        </div>

        {/* Savings highlight */}
        <AnimatePresence mode="popLayout">
          {hasSavings && selectedCount > 0 ? (
            <motion.div
              key="savings"
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="mb-6 p-4 rounded-xl bg-gain-500/10 border border-gain-500/20 relative overflow-hidden group"
            >
            <div className="absolute inset-0 bg-gradient-to-r from-gain-500/0 via-gain-500/10 to-gain-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="flex items-start gap-3 relative">
              <CheckCircle2 className="w-5 h-5 text-gain-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gain-300 tracking-tight">
                  You can save {fmt.usd(harvestingResult.taxSavings)}!
                </p>
                <p className="text-xs text-gain-200/60 mt-1 font-medium">
                  That's a {harvestingResult.savingsPct.toFixed(1)}% reduction in your tax liability.
                </p>
              </div>
            </div>
            </motion.div>
          ) : selectedCount > 0 && !hasSavings ? (
            <motion.div
              key="no-savings"
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10"
            >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-ink-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink-400 font-medium leading-relaxed">
                Selected assets don't reduce your current tax liability. Try selecting different assets.
              </p>
            </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* CTA */}
        <Button
          className={cn(
            "w-full h-12 shadow-xl",
            (!hasSavings || selectedCount === 0) && "bg-white/10 text-white/50 hover:bg-white/10 border-transparent hover:shadow-none hover:-translate-y-0"
          )}
          size="lg"
          disabled={selectedCount === 0 || !hasSavings}
          onClick={onHarvest}
        >
          <Sparkles className={cn("w-4 h-4", (!hasSavings || selectedCount === 0) ? "opacity-50" : "text-surface-50")} />
          {selectedCount === 0
            ? "Select assets to harvest"
            : hasSavings
            ? `Harvest ${selectedCount} Asset${selectedCount > 1 ? "s" : ""}`
            : "No savings available"}
        </Button>

        <p className="mt-4 text-center text-[11px] font-medium text-ink-500 tracking-wide uppercase">
          Tax harvesting is simulated
        </p>
      </div>
    </div>
  );
}
