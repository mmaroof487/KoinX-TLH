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

        {/* Progress Bar for Tax Offset */}
        <AnimatePresence>
          {hasSavings && selectedCount > 0 && summary.totalTaxableGains > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 space-y-2"
            >
              <div className="flex justify-between text-xs font-semibold text-ink-400 uppercase tracking-widest">
                <span>Tax Offset Progress</span>
                <span className="text-brand-400">{Math.min(100, (harvestingResult.totalHarvestableLoss / summary.totalTaxableGains) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (harvestingResult.totalHarvestableLoss / summary.totalTaxableGains) * 100)}%` }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0 }}
                  className="absolute top-0 left-0 h-full bg-brand-500 rounded-full shadow-[0_0_15px_rgba(0,255,204,0.6)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="relative group">
          <div className={cn(
            "absolute -inset-0.5 bg-gradient-to-r from-brand-400 to-purple-500 rounded-xl blur opacity-0 transition duration-500",
            hasSavings && selectedCount > 0 && "group-hover:opacity-75 animate-pulse"
          )}></div>
          <Button
            className={cn(
              "w-full h-12 shadow-xl relative",
              (!hasSavings || selectedCount === 0) 
                ? "bg-white/5 text-white/40 hover:bg-white/5 border border-white/10 hover:shadow-none hover:-translate-y-0"
                : "bg-surface-50 text-brand-400 hover:text-brand-300 border border-brand-500/30 hover:border-brand-500/50 shadow-[inset_0_0_20px_rgba(0,255,204,0.15)] overflow-hidden"
            )}
            size="lg"
            disabled={selectedCount === 0 || !hasSavings}
            onClick={onHarvest}
          >
            {hasSavings && selectedCount > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-brand-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
            <Sparkles className={cn("w-4 h-4 z-10", (!hasSavings || selectedCount === 0) ? "opacity-50" : "text-brand-400")} />
            <span className="z-10 relative">
              {selectedCount === 0
                ? "Select assets to harvest"
                : hasSavings
                ? `Harvest ${selectedCount} Asset${selectedCount > 1 ? "s" : ""}`
                : "No savings available"}
            </span>
          </Button>
        </div>

        <p className="mt-4 text-center text-[11px] font-medium text-ink-500 tracking-wide uppercase">
          Tax harvesting is simulated
        </p>
      </div>
    </div>
  );
}
