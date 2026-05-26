// components/harvesting/InfoBanner.tsx
import { Info, X } from "lucide-react";
import { useState } from "react";

export function InfoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative p-4 rounded-2xl bg-brand-50 border border-brand-100 animate-fade-in">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-lg text-brand-400 hover:text-brand-700 hover:bg-brand-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="flex gap-3 pr-6">
        <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-brand-900 mb-0.5">What is Tax Loss Harvesting?</p>
          <p className="text-xs text-brand-700 leading-relaxed">
            Tax loss harvesting is a strategy to reduce your capital gains tax by selling assets that have declined in value.
            The realized losses offset your gains, lowering your total tax liability.
            Select the assets below that are currently in a loss position to calculate your potential savings.
          </p>
        </div>
      </div>
    </div>
  );
}
