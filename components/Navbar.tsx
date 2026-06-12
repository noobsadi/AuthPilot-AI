"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  LayoutDashboard,
  FileText,
  PlusCircle,
  MessageSquare,
  BarChart3,
  Sparkles,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requests", label: "Requests", icon: FileText },
  { href: "/new-request", label: "New Request", icon: PlusCircle },
  { href: "/payer-communication", label: "Payer Comms", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-soft">
              <Stethoscope className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-teal-400 ring-2 ring-white animate-pulse-dot" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold text-slate-900 tracking-tight">
                AuthPilot <span className="bg-brand-gradient bg-clip-text text-transparent">AI</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-medium">
                Prior Auth Copilot
              </div>
            </div>
          </Link>

          {!isLanding && (
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100/70 border border-slate-200/80">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-pill ${
                      active
                        ? "bg-white text-brand-700 shadow-card"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-brand-600" : ""}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              Demo mode
            </span>
            {isLanding ? (
              <Link href="/dashboard" className="btn-primary">
                <Sparkles className="h-4 w-4" /> Open dashboard
              </Link>
            ) : (
              <Link href="/new-request" className="btn-primary">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">New</span>
              </Link>
            )}
          </div>
        </div>

        {!isLanding && (
          <nav className="md:hidden flex items-center gap-1 overflow-x-auto pb-3 -mt-1 scrollbar-thin">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-pill whitespace-nowrap text-xs ${
                    active
                      ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
