// components/harvesting/HarvestSuccessModal.tsx
"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, X } from "lucide-react";
import { fmt } from "@/utils/format";
import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  taxSavings: number;
  harvestedLoss: number;
  assetCount: number;
}

export function HarvestSuccessModal({ open, onClose, taxSavings, harvestedLoss, assetCount }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 card shadow-modal p-8 animate-slide-up">
          <Dialog.Close className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surface-100">
            <X className="w-4 h-4" />
          </Dialog.Close>

          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gain-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-gain-600" />
            </div>

            <Dialog.Title className="font-display font-bold text-xl text-ink-900 mb-2">
              Harvest Successful!
            </Dialog.Title>
            <Dialog.Description className="text-sm text-ink-500 mb-6">
              You've successfully harvested losses from {assetCount} asset{assetCount > 1 ? "s" : ""}.
            </Dialog.Description>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-surface-50 border border-surface-200">
                <p className="text-xs text-ink-400 mb-1">Loss Harvested</p>
                <p className="text-lg font-semibold font-display text-ink-900">{fmt.usd(harvestedLoss)}</p>
              </div>
              <div className="p-4 rounded-xl bg-gain-50 border border-gain-100">
                <p className="text-xs text-gain-600 mb-1">Tax Saved</p>
                <p className="text-lg font-semibold font-display text-gain-700">{fmt.usd(taxSavings)}</p>
              </div>
            </div>

            <p className="text-xs text-ink-400 mb-6">
              This is a simulation. In a real scenario, you would need to sell and repurchase these assets to realize the losses for tax purposes.
            </p>

            <Button variant="primary" size="lg" className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
