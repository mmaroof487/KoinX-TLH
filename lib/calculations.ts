// lib/calculations.ts
import type { CryptoAsset, PortfolioSummary, HarvestingResult, TaxConfig } from "@/types";

export const DEFAULT_TAX_CONFIG: TaxConfig = {
  shortTermTaxRate: 0.30,
  longTermTaxRate: 0.30,
  surchargeRate: 0.04,
};

/**
 * Compute high-level portfolio summary from assets array.
 */
export function computePortfolioSummary(
  assets: CryptoAsset[],
  taxConfig: TaxConfig = DEFAULT_TAX_CONFIG
): PortfolioSummary {
  const totalValue = assets.reduce((s, a) => s + a.currentValue, 0);
  const totalInvested = assets.reduce((s, a) => s + a.investedValue, 0);
  const totalUnrealizedPnL = totalValue - totalInvested;
  const totalUnrealizedPnLPct = totalInvested > 0 ? (totalUnrealizedPnL / totalInvested) * 100 : 0;

  const shortTermGains = assets.reduce((s, a) => s + (a.shortTermGain > 0 ? a.shortTermGain : 0), 0);
  const longTermGains = assets.reduce((s, a) => s + (a.longTermGain > 0 ? a.longTermGain : 0), 0);
  const totalTaxableGains = shortTermGains + longTermGains;

  const effectiveRate = taxConfig.shortTermTaxRate * (1 + taxConfig.surchargeRate);
  const estimatedTax = totalTaxableGains * effectiveRate;

  return {
    totalValue,
    totalInvested,
    totalUnrealizedPnL,
    totalUnrealizedPnLPct,
    shortTermGains,
    longTermGains,
    totalTaxableGains,
    estimatedTax,
  };
}

/**
 * Compute the impact of harvesting losses from selected assets.
 */
export function computeHarvestingResult(
  allAssets: CryptoAsset[],
  selectedIds: Set<string>,
  taxConfig: TaxConfig = DEFAULT_TAX_CONFIG
): HarvestingResult {
  const summary = computePortfolioSummary(allAssets, taxConfig);
  const selectedAssets = allAssets.filter((a) => selectedIds.has(a.id));

  // Total harvestable loss (only losses count)
  const totalHarvestableLoss = selectedAssets.reduce((s, a) => {
    const loss = Math.min(0, a.shortTermGain) + Math.min(0, a.longTermGain);
    return s + Math.abs(loss);
  }, 0);

  const gainsAfterHarvesting = Math.max(0, summary.totalTaxableGains - totalHarvestableLoss);
  const effectiveRate = taxConfig.shortTermTaxRate * (1 + taxConfig.surchargeRate);
  const newTaxLiability = gainsAfterHarvesting * effectiveRate;
  const taxSavings = summary.estimatedTax - newTaxLiability;
  const savingsPct = summary.estimatedTax > 0 ? (taxSavings / summary.estimatedTax) * 100 : 0;

  return {
    selectedAssets,
    totalHarvestableLoss,
    gainsAfterHarvesting,
    newTaxLiability,
    taxSavings,
    savingsPct,
  };
}

/**
 * Identify all assets currently in a loss position.
 */
export function getLossAssets(assets: CryptoAsset[]): CryptoAsset[] {
  return assets.filter((a) => a.status === "loss");
}

/**
 * Identify all assets currently in a gain position.
 */
export function getGainAssets(assets: CryptoAsset[]): CryptoAsset[] {
  return assets.filter((a) => a.status === "gain");
}

