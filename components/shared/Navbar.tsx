// components/shared/Navbar.tsx
"use client";
import Link from "next/link";
import { BarChart2, Bell, User, Menu, X, Sun, Moon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface-50/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-surface-50 shadow-[0_0_15px_rgba(0,255,204,0.3)]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-ink-900 group-hover:text-brand-400 transition-colors">
              KoinX
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink-500 font-medium relative">
            <Link href="/" className="relative px-3 py-1.5 text-brand-400 font-semibold drop-shadow-[0_0_8px_rgba(0,255,204,0.4)]">
              Tax Harvesting
              <motion.div 
                layoutId="activeUnderline"
                className="absolute -bottom-1 left-3 right-3 h-0.5 bg-brand-400 shadow-[0_0_10px_rgba(0,255,204,0.8)]"
              />
            </Link>
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surface-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <button aria-label="Notifications" className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surface-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <Bell className="w-4 h-4" />
            </button>
            <button aria-label="User profile" className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <User className="w-4 h-4 text-brand-400" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-fade-in md:hidden" />
          <Dialog.Content className="fixed right-0 top-0 bottom-0 w-64 bg-surface-50 z-50 shadow-xl border-l border-white/5 animate-fade-in p-6 md:hidden">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-bold text-ink-900 text-lg tracking-tight">Menu</span>
              <Dialog.Close asChild>
                <button aria-label="Close menu" className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            {/* Mobile Nav Links */}
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-brand-500 hover:bg-brand-500/5 transition-colors"
              >
                Tax Harvesting
              </Link>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
