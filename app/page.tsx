// app/page.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { PortfolioSummaryCards } from "@/components/dashboard/PortfolioSummary";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { HarvestingPanel } from "@/components/harvesting/HarvestingPanel";
import { HarvestSuccessModal } from "@/components/harvesting/HarvestSuccessModal";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { InfoBanner } from "@/components/harvesting/InfoBanner";
import { ErrorState } from "@/components/ui/ErrorState";
import { usePortfolioStore } from "@/hooks/usePortfolioStore";
import { getLossAssets, getGainAssets } from "@/lib/calculations";

export default function TaxHarvestingPage() {
  const {
    assets,
    status,
    error,
    selectedIds,
    loadPortfolio,
    toggleAsset,
    selectAll,
    clearSelection,
    getSummary,
    getHarvestingResult,
  } = usePortfolioStore();

  const [successModal, setSuccessModal] = useState(false);
  const [lastHarvestResult, setLastHarvestResult] = useState<{ savings: number; loss: number; count: number } | null>(null);

  useEffect(() => { loadPortfolio(); }, [loadPortfolio]);

  const loading = status === "loading" || status === "idle";
  const summary = useMemo(
    () => (status === "success" ? getSummary() : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, assets, getSummary]
  );
  const harvestingResult = useMemo(
    () => (status === "success" ? getHarvestingResult() : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, assets, selectedIds, getHarvestingResult]
  );
  const lossAssets = useMemo(() => getLossAssets(assets), [assets]);
  const gainAssets = useMemo(() => getGainAssets(assets), [assets]);

  function handleHarvest() {
    if (!harvestingResult) return;
    setLastHarvestResult({
      savings: harvestingResult.taxSavings,
      loss: harvestingResult.totalHarvestableLoss,
      count: harvestingResult.selectedAssets.length,
    });
    setSuccessModal(true);
    clearSelection();
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="font-display font-bold text-2xl text-ink-900 mb-1">
            Tax Loss Harvesting
          </h1>
          <p className="text-sm text-ink-500">
            Identify and harvest unrealized losses to offset your capital gains and reduce tax liability.
          </p>
        </div>

        {/* Info Banner */}
        <InfoBanner />

        {/* Error state */}
        {status === "error" && (
          <ErrorState message={error ?? "Failed to load portfolio"} onRetry={loadPortfolio} />
        )}

        {/* Portfolio summary cards */}
        <PortfolioSummaryCards summary={summary} loading={loading} />

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Holdings tables (2/3 width) */}
          <div className="xl:col-span-2 space-y-6">
            {/* All Holdings */}
            <HoldingsTable
              assets={assets}
              loading={loading}
              selectedIds={selectedIds}
              onToggle={toggleAsset}
              onSelectAll={selectAll}
              onClearAll={clearSelection}
              title="All Holdings"
              highlightLosses={false}
            />

            {/* Loss positions — harvestable */}
            <HoldingsTable
              assets={lossAssets}
              loading={loading}
              selectedIds={selectedIds}
              onToggle={toggleAsset}
              onSelectAll={(ids) => selectAll([...selectedIds, ...ids])}
              onClearAll={clearSelection}
              title="Harvestable Losses"
              highlightLosses={true}
            />
          </div>

          {/* Right: Panel + Chart (1/3 width) */}
          <div className="space-y-6">
            <HarvestingPanel
              summary={summary}
              harvestingResult={harvestingResult}
              selectedCount={selectedIds.size}
              loading={loading}
              onHarvest={handleHarvest}
            />

            <PortfolioChart assets={assets} loading={loading} />
          </div>
        </div>
      </main>

      {/* Success modal */}
      {lastHarvestResult && (
        <HarvestSuccessModal
          open={successModal}
          onClose={() => setSuccessModal(false)}
          taxSavings={lastHarvestResult.savings}
          harvestedLoss={lastHarvestResult.loss}
          assetCount={lastHarvestResult.count}
        />
      )}
    </div>
  );
}
