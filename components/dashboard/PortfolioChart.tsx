// components/dashboard/PortfolioChart.tsx
"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fmt } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CryptoAsset } from "@/types";

const COLORS = [
  "#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed",
  "#0891b2", "#db2777", "#65a30d", "#ea580c", "#6366f1",
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
    <div className="bg-ink-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <p className="font-semibold">{d.name}</p>
      <p>{fmt.usd(d.value)}</p>
      <p className="text-ink-300">{d.payload.pct.toFixed(1)}%</p>
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
