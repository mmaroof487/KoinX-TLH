// components/harvesting/HarvestingPanel.tsx
"use client";
import { useMemo } from "react";
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
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
      "flex items-center justify-between py-3 border-b border-surface-100 last:border-0",
      highlight && "bg-brand-50 -mx-5 px-5 rounded-xl"
    )}>
      <span className="text-sm text-ink-500">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-700">{before}</span>
        <ArrowRight className="w-3.5 h-3.5 text-ink-300 flex-shrink-0" />
        <span className={cn(
          "text-sm font-semibold",
          positive === true && "text-gain-600",
          positive === false && "text-loss-600",
          positive === undefined && "text-ink-900"
        )}>
          {after}
        </span>
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
    <div className="card overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-surface-100 bg-gradient-to-r from-brand-50 to-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h2 className="font-display font-semibold text-ink-900">Tax Impact Summary</h2>
        </div>
        <p className="text-xs text-ink-500">
          {selectedCount === 0
            ? "Select assets in loss to see your potential tax savings"
            : `${selectedCount} asset${selectedCount > 1 ? "s" : ""} selected for harvesting`}
        </p>
      </div>

      <div className="px-5 py-4">
        {/* Before/After comparison */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Before Harvesting</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">After Harvesting</span>
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
        {hasSavings && selectedCount > 0 ? (
          <div className="mb-4 p-4 rounded-xl bg-gain-50 border border-gain-100">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-gain-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gain-700">
                  You can save {fmt.usd(harvestingResult.taxSavings)}!
                </p>
                <p className="text-xs text-gain-600 mt-0.5">
                  That's a {harvestingResult.savingsPct.toFixed(1)}% reduction in your tax liability.
                </p>
              </div>
            </div>
          </div>
        ) : selectedCount > 0 && !hasSavings ? (
          <div className="mb-4 p-4 rounded-xl bg-surface-100 border border-surface-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-ink-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink-500">
                Selected assets don't reduce your current tax liability. Try selecting different assets.
              </p>
            </div>
          </div>
        ) : null}

        {/* CTA */}
        <Button
          className="w-full"
          size="lg"
          disabled={selectedCount === 0 || !hasSavings}
          onClick={onHarvest}
        >
          <Sparkles className="w-4 h-4" />
          {selectedCount === 0
            ? "Select assets to harvest"
            : hasSavings
            ? `Harvest ${selectedCount} Asset${selectedCount > 1 ? "s" : ""}`
            : "No savings available"}
        </Button>

        <p className="mt-2 text-center text-xs text-ink-400">
          Tax harvesting is simulated. Consult a tax advisor before acting.
        </p>
      </div>
    </div>
  );
}
