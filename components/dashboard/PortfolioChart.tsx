// components/dashboard/PortfolioChart.tsx
"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fmt } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CryptoAsset } from "@/types";

const COLORS = [
  "#00ffcc", // brand-500
  "#33ffd6", // brand-400
  "#00ccaa", // brand-600
  "#009980", // brand-700
  "#99ffeb", // brand-200
  "#a3a3a3", // ink-500
  "#525252", // ink-300
];

interface Props {
  assets: CryptoAsset[];
  loading: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { pct: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="backdrop-blur-xl bg-surface-50/90 text-ink-900 text-xs px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,204,0.1)] border border-white/10">
      <p className="font-bold tracking-widest uppercase text-[10px] text-ink-300 mb-1">{d.name}</p>
      <p className="text-sm font-semibold">{fmt.usd(d.value)}</p>
      <p className="text-ink-400 font-medium mt-0.5">{d.payload.pct.toFixed(1)}% of portfolio</p>
    </div>
  );
}

export function PortfolioChart({ assets, loading }: Props) {
  const data = useMemo(() => {
    const total = assets.reduce((s, a) => s + a.currentValue, 0);
    return [...assets]
      .sort((a, b) => b.currentValue - a.currentValue)
      .slice(0, 8)
      .map((a) => ({
        name: a.symbol,
        value: a.currentValue,
        pct: total > 0 ? (a.currentValue / total) * 100 : 0,
      }));
  }, [assets]);

  if (loading) {
    return (
      <div className="card p-5">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-48 w-full rounded-full mx-auto" style={{ borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-ink-900 mb-4">Portfolio Composition</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart margin={{ top: 0, bottom: 20, left: 0, right: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-ink-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
