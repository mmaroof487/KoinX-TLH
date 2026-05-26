import { mockPortfolio, mockLoadDelay } from "@/mock-data/portfolio";
import type { CryptoAsset } from "@/types";

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

export async function fetchPortfolio(): Promise<CryptoAsset[]> {
  await sleep(mockLoadDelay);
  return mockPortfolio;
}
