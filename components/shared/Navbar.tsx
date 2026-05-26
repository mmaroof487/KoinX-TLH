// components/shared/Navbar.tsx
import Link from "next/link";
import { BarChart3, Bell, User } from "lucide-react";

export function Navbar() {
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
            <Link href="#" className="hover:text-ink-900 transition-colors">Dashboard</Link>
            <Link href="#" className="hover:text-ink-900 transition-colors">Portfolio</Link>
            <Link href="#" className="text-brand-600 font-semibold">Tax Harvesting</Link>
            <Link href="#" className="hover:text-ink-900 transition-colors">Reports</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-surface-100 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
