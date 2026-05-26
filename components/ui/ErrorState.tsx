// components/ui/ErrorState.tsx
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong", onRetry }: Props) {
  return (
    <div className="card p-12 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-loss-50 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-loss-500" />
      </div>
      <h3 className="font-semibold text-ink-900 mb-1">Failed to load</h3>
      <p className="text-sm text-ink-500 mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
