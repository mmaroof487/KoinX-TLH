// components/shared/Navbar.tsx
"use client";
import Link from "next/link";
import { BarChart3, Bell, User, Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-ink-900 text-lg tracking-tight">
              Koin<span className="text-brand-600">X</span>
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink-500 font-medium">
            <Link href="/" className="text-brand-600 font-semibold">Tax Harvesting</Link>
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surface-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <Bell className="w-4 h-4" />
            </button>
            <button aria-label="User profile" className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <User className="w-4 h-4 text-brand-600" />
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
          <Dialog.Content className="fixed right-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl animate-fade-in p-6 md:hidden">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-700 text-ink-900 text-lg tracking-tight">Menu</span>
              <Dialog.Close asChild>
                <button aria-label="Close menu" className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            <nav className="flex flex-col gap-4 text-base font-medium text-ink-600">
              <Link href="/" onClick={() => setOpen(false)} className="text-brand-600 font-semibold">Tax Harvesting</Link>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
