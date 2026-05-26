// components/harvesting/HarvestSuccessModal.tsx
"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fmt } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { NumberTicker } from "@/components/ui/NumberTicker";

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
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50" 
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: "-40%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md mx-4 card shadow-modal p-8 border border-white/10"
              >
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#00ffcc_100%)] opacity-20 blur-3xl animate-[spin_4s_linear_infinite] pointer-events-none" />
                
                <Dialog.Close className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-white/10 transition-colors z-10">
                  <X className="w-4 h-4" />
                </Dialog.Close>

                <div className="text-center relative z-10">
                  <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-brand-500/20 border border-brand-500/50 flex items-center justify-center relative shadow-[0_0_30px_rgba(0,255,204,0.3)]">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 12, stiffness: 200 }}
                    >
                      <Check className="w-10 h-10 text-brand-400 drop-shadow-[0_0_10px_rgba(0,255,204,0.8)]" />
                    </motion.div>
                    
                    {/* Burst particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                        animate={{ 
                          opacity: 0, 
                          scale: [0, 1.5, 0],
                          x: Math.cos(i * 60 * (Math.PI / 180)) * 60,
                          y: Math.sin(i * 60 * (Math.PI / 180)) * 60
                        }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="absolute w-2 h-2 bg-brand-400 rounded-full"
                      />
                    ))}
                  </div>

                  <Dialog.Title className="font-display font-bold text-2xl text-white mb-2">
                    Harvest Successful!
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-ink-400 mb-8">
                    You've successfully harvested losses from {assetCount} asset{assetCount > 1 ? "s" : ""}.
                  </Dialog.Description>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                      <p className="text-xs text-ink-400 mb-1 relative z-10 uppercase tracking-widest font-bold">Loss Harvested</p>
                      <div className="text-xl font-semibold font-display text-white relative z-10">
                        <NumberTicker value={harvestedLoss} format={fmt.usd} delay={0.3} />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,255,204,0.1)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent pointer-events-none" />
                      <p className="text-xs text-brand-400 mb-1 relative z-10 uppercase tracking-widest font-bold">Tax Saved</p>
                      <div className="text-xl font-semibold font-display text-brand-400 relative z-10 drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]">
                        <NumberTicker value={taxSavings} format={fmt.usd} delay={0.4} />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-ink-500 mb-6 font-medium">
                    This is a simulation. In a real scenario, you would need to sell and repurchase these assets to realize the losses.
                  </p>

                  <Button variant="primary" size="lg" className="w-full bg-brand-500 hover:bg-brand-400 text-surface-50 shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:shadow-[0_0_30px_rgba(0,255,204,0.5)] transition-all duration-300" onClick={onClose}>
                    Got it, thanks!
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
