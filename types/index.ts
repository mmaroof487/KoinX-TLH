// types/index.ts


export type HoldingPeriod = "short-term" | "long-term";
export type ProfitLossStatus = "gain" | "loss" | "neutral";

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  logoUrl: string;
  quantity: number;
  buyPrice: number;          // avg cost basis per unit (USD)
  currentPrice: number;      // current market price per unit (USD)
  investedValue: number;     // buyPrice * quantity
  currentValue: number;      // currentPrice * quantity
  unrealizedPnL: number;     // currentValue - investedValue
  unrealizedPnLPct: number;  // unrealizedPnL / investedValue * 100
  holdingPeriod: HoldingPeriod;
  status: ProfitLossStatus;
  // Tax specifics
  shortTermGain: number;
  longTermGain: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPnLPct: number;
  shortTermGains: number;
  longTermGains: number;
  totalTaxableGains: number;
  estimatedTax: number; // at 30% flat rate (India crypto tax)
}

export interface HarvestingResult {
  selectedAssets: CryptoAsset[];
  totalHarvestableLoss: number;
  gainsAfterHarvesting: number;
  newTaxLiability: number;
  taxSavings: number;
  savingsPct: number;
}

export interface TaxConfig {
  shortTermTaxRate: number; // 0.30
  longTermTaxRate: number;  // 0.30 (India treats both same for crypto)
  surchargeRate: number;    // 0.04 cess
}
