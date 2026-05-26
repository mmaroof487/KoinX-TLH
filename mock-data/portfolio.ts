// mock-data/portfolio.ts
import type { CryptoAsset } from "@/types";

const raw: Omit<CryptoAsset, "status" | "unrealizedPnL" | "unrealizedPnLPct" | "investedValue" | "currentValue">[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    logoUrl: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    quantity: 0.45,
    buyPrice: 58000,
    currentPrice: 67240,
    holdingPeriod: "long-term",
    shortTermGain: 0,
    longTermGain: 4158,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    logoUrl: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    quantity: 3.2,
    buyPrice: 3200,
    currentPrice: 3540,
    holdingPeriod: "long-term",
    shortTermGain: 0,
    longTermGain: 1088,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    logoUrl: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    quantity: 25,
    buyPrice: 185,
    currentPrice: 148,
    holdingPeriod: "short-term",
    shortTermGain: -925,
    longTermGain: 0,
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    logoUrl: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    quantity: 5000,
    buyPrice: 0.72,
    currentPrice: 0.44,
    holdingPeriod: "short-term",
    shortTermGain: -1400,
    longTermGain: 0,
  },
  {
    id: "matic-network",
    symbol: "MATIC",
    name: "Polygon",
    logoUrl: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    quantity: 3000,
    buyPrice: 1.05,
    currentPrice: 0.71,
    holdingPeriod: "short-term",
    shortTermGain: -1020,
    longTermGain: 0,
  },
  {
    id: "chainlink",
    symbol: "LINK",
    name: "Chainlink",
    logoUrl: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    quantity: 150,
    buyPrice: 14.5,
    currentPrice: 17.8,
    holdingPeriod: "short-term",
    shortTermGain: 495,
    longTermGain: 0,
  },
  {
    id: "avalanche-2",
    symbol: "AVAX",
    name: "Avalanche",
    logoUrl: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    quantity: 40,
    buyPrice: 42,
    currentPrice: 28.5,
    holdingPeriod: "short-term",
    shortTermGain: -540,
    longTermGain: 0,
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    logoUrl: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    quantity: 200,
    buyPrice: 8.9,
    currentPrice: 6.4,
    holdingPeriod: "long-term",
    shortTermGain: 0,
    longTermGain: -500,
  },
  {
    id: "uniswap",
    symbol: "UNI",
    name: "Uniswap",
    logoUrl: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    quantity: 120,
    buyPrice: 11.2,
    currentPrice: 9.8,
    holdingPeriod: "short-term",
    shortTermGain: -168,
    longTermGain: 0,
  },
  {
    id: "near",
    symbol: "NEAR",
    name: "NEAR Protocol",
    logoUrl: "https://assets.coingecko.com/coins/images/10365/large/near.jpg",
    quantity: 500,
    buyPrice: 5.5,
    currentPrice: 7.2,
    holdingPeriod: "long-term",
    shortTermGain: 0,
    longTermGain: 850,
  },
];

function buildAsset(r: typeof raw[number]): CryptoAsset {
  const investedValue = r.buyPrice * r.quantity;
  const currentValue = r.currentPrice * r.quantity;
  const unrealizedPnL = currentValue - investedValue;
  const unrealizedPnLPct = (unrealizedPnL / investedValue) * 100;
  const status = unrealizedPnL > 50 ? "gain" : unrealizedPnL < -50 ? "loss" : "neutral";
  return { ...r, investedValue, currentValue, unrealizedPnL, unrealizedPnLPct, status };
}

export const mockPortfolio: CryptoAsset[] = raw.map(buildAsset);

export const mockLoadDelay = 800; // ms to simulate API latency
