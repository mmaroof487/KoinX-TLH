// hooks/usePortfolioStore.ts
import { create } from "zustand";
import type { CryptoAsset } from "@/types";
import { fetchPortfolio } from "@/utils/api";
import { computePortfolioSummary, computeHarvestingResult, DEFAULT_TAX_CONFIG } from "@/lib/calculations";

type Status = "idle" | "loading" | "success" | "error";

interface PortfolioStore {
  assets: CryptoAsset[];
  selectedIds: Set<string>;
  status: Status;
  error: string | null;

  // Actions
  loadPortfolio: () => Promise<void>;
  toggleAsset: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Computed (derived — recalculated on access)
  getSummary: () => ReturnType<typeof computePortfolioSummary>;
  getHarvestingResult: () => ReturnType<typeof computeHarvestingResult>;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  assets: [],
  selectedIds: new Set(),
  status: "idle",
  error: null,

  loadPortfolio: async () => {
    set({ status: "loading", error: null });
    try {
      const assets = await fetchPortfolio();
      set({ assets, status: "success" });
    } catch (e) {
      set({ status: "error", error: e instanceof Error ? e.message : "Unknown error" });
    }
  },

  toggleAsset: (id) => {
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    });
  },

  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),

  getSummary: () => computePortfolioSummary(get().assets, DEFAULT_TAX_CONFIG),
  getHarvestingResult: () => computeHarvestingResult(get().assets, get().selectedIds, DEFAULT_TAX_CONFIG),
}));
