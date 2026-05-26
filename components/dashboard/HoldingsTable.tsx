// components/dashboard/HoldingsTable.tsx
"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowUpDown, ArrowUp, ArrowDown, Info } from "lucide-react";
import { fmt, pnlColor, cn } from "@/utils/format";
import { Tooltip } from "@/components/ui/Tooltip";
import { PnLBadge } from "@/components/ui/PnLBadge";
import { SkeletonRow } from "@/components/ui/Skeleton";
import type { CryptoAsset } from "@/types";

type SortKey = "name" | "currentValue" | "unrealizedPnL" | "unrealizedPnLPct";
type SortDir = "asc" | "desc";

interface Props {
  assets: CryptoAsset[];
  loading: boolean;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearAll: () => void;
  title: string;
  highlightLosses?: boolean;
}

function AssetLogo({ asset }: { asset: CryptoAsset }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-surface-100 flex-shrink-0">
        <Image
          src={asset.logoUrl}
          alt={asset.symbol}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-ink-900 text-sm truncate">{asset.symbol}</p>
        <p className="text-xs text-ink-400 truncate">{asset.name}</p>
      </div>
    </div>
  );
}

export function HoldingsTable({
  assets,
  loading,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
  title,
  highlightLosses = false,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("currentValue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...assets].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [assets, sortKey, sortDir]);

  const lossIds = assets.filter((a) => a.status === "loss").map((a) => a.id);
  const allLossSelected = lossIds.length > 0 && lossIds.every((id) => selectedIds.has(id));

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 text-ink-300" />;
    return sortDir === "asc"
      ? <ArrowUp className="w-3 h-3 text-brand-600" />
      : <ArrowDown className="w-3 h-3 text-brand-600" />;
  }

  function ColHeader({ label, sortK, tooltip }: { label: string; sortK?: SortKey; tooltip?: string }) {
    return (
      <th className="px-4 py-3 text-left whitespace-nowrap">
        <div
          role={sortK ? "button" : undefined}
          tabIndex={sortK ? 0 : undefined}
          aria-sort={sortK === sortKey ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-400",
            sortK && "cursor-pointer hover:text-ink-700 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          )}
          onClick={() => sortK && handleSort(sortK)}
          onKeyDown={(e) => {
            if (sortK && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleSort(sortK);
            }
          }}
        >
          {label}
          {sortK && <SortIcon k={sortK} />}
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info className="w-3 h-3 text-ink-300 cursor-help" />
            </Tooltip>
          )}
        </div>
      </th>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-semibold text-ink-900">{title}</h2>
          <span className="text-xs text-ink-400 bg-surface-100 px-2 py-0.5 rounded-full">
            {loading ? "—" : `${assets.length} assets`}
          </span>
        </div>
        {highlightLosses && lossIds.length > 0 && (
          <button
            onClick={() => allLossSelected ? onClearAll() : onSelectAll(lossIds)}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            {allLossSelected ? "Deselect all losses" : "Select all losses"}
          </button>
        )}
      </div>

      <div className="table-scroll rounded-b-2xl">
        <table className="w-full min-w-[680px]">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr>
              {highlightLosses && <th className="w-10 px-4" />}
              <ColHeader label="Asset" sortK="name" />
              <ColHeader label="Holdings" sortK="currentValue" tooltip="Quantity × current price" />
              <ColHeader label="Avg Buy Price" />
              <ColHeader label="Current Price" />
              <ColHeader label="Unrealized P&L" sortK="unrealizedPnL" />
              <ColHeader label="P&L %" sortK="unrealizedPnLPct" />
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : sorted.length === 0
              ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-ink-400">
                    No assets found.
                  </td>
                </tr>
              )
              : sorted.map((asset) => {
                const isSelected = selectedIds.has(asset.id);
                const isLoss = asset.status === "loss";

                return (
                  <tr
                    key={asset.id}
                    role={highlightLosses && isLoss ? "button" : "row"}
                    tabIndex={highlightLosses && isLoss ? 0 : undefined}
                    className={cn(
                      "border-b border-surface-50 transition-colors last:border-0",
                      highlightLosses && isLoss && "hover:bg-loss-50/40 cursor-pointer focus-visible:outline-none focus-visible:bg-loss-50/40",
                      highlightLosses && isLoss && isSelected && "bg-loss-50/60",
                      highlightLosses && !isLoss && "opacity-50"
                    )}
                    onClick={() => highlightLosses && isLoss && onToggle(asset.id)}
                    onKeyDown={(e) => {
                      if (highlightLosses && isLoss && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onToggle(asset.id);
                      }
                    }}
                  >
                    {highlightLosses && (
                      <td className="px-4 py-3 w-10">
                        {isLoss && (
                          <input
                            type="checkbox"
                            aria-label={`Select ${asset.name} for tax loss harvesting`}
                            checked={isSelected}
                            onChange={() => onToggle(asset.id)}
                            onClick={(e) => e.stopPropagation()}
                            tabIndex={-1} // Handled by row
                            className="w-4 h-4 rounded accent-brand-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          />
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <AssetLogo asset={asset} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-ink-900">
                        {fmt.usd(asset.currentValue)}
                      </p>
                      <p className="text-xs text-ink-400">
                        {fmt.number(asset.quantity, 4)} {asset.symbol}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-700 font-mono">
                      {fmt.usd(asset.buyPrice)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-700 font-mono">
                      {fmt.usd(asset.currentPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-sm font-semibold font-mono", pnlColor(asset.unrealizedPnL))}>
                        {asset.unrealizedPnL >= 0 ? "+" : ""}{fmt.usd(asset.unrealizedPnL)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PnLBadge value={asset.unrealizedPnL} pct={asset.unrealizedPnLPct} />
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
