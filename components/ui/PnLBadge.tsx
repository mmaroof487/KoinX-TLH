// components/ui/PnLBadge.tsx
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { fmt, cn } from "@/utils/format";

interface PnLBadgeProps {
  value: number;
  pct?: number;
  showIcon?: boolean;
  className?: string;
}

export function PnLBadge({ value, pct, showIcon = true, className }: PnLBadgeProps) {
  const isGain = value > 0;
  const isLoss = value < 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        isGain && "bg-gain-50 text-gain-700",
        isLoss && "bg-loss-50 text-loss-700",
        !isGain && !isLoss && "bg-surface-100 text-ink-500",
        className
      )}
    >
      {showIcon && (
        isGain ? <TrendingUp className="w-3 h-3" /> :
        isLoss ? <TrendingDown className="w-3 h-3" /> :
        <Minus className="w-3 h-3" />
      )}
      {pct !== undefined ? fmt.pctRaw(pct) : fmt.usd(Math.abs(value))}
    </span>
  );
}
