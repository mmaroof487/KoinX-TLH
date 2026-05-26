// components/ui/Skeleton.tsx
import { cn } from "@/utils/format";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-skeleton-pulse rounded-lg bg-surface-200",
        className
      )}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-surface-100">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={`h-4 w-${i === 1 ? "32" : "20"}`} />
        </td>
      ))}
    </tr>
  );
}
