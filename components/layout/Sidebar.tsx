"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/layout/NavIcon";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="nav-shell fixed inset-y-0 left-0 z-30 hidden w-72 border-r px-5 py-6 shadow-[18px_0_70px_rgba(0,0,0,0.24)] lg:flex lg:flex-col">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-astro-blue/25 to-transparent" />

      <Link href="/" className="group mb-9 flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
        <span className="brand-core h-11 w-11 shrink-0 rounded-xl border border-astro-gold/25">
          <span className="sr-only">Astroboat</span>
        </span>
        <span>
          <span className="font-display block text-[1.35rem] font-normal tracking-wide text-astro-text transition group-hover:text-astro-gold">Astroboat</span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.29em] text-astro-blue/75">
            Orbital intelligence
          </span>
        </span>
      </Link>

      <div className="mb-3 flex items-center gap-3 px-3 font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--text-dim)]">
        <span>Navigation</span>
        <span className="h-px flex-1 bg-gradient-to-r from-astro-border to-transparent" />
        <span>01</span>
      </div>

      <nav aria-label="Primary navigation" className="space-y-1.5">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex min-h-11 items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition duration-200",
                "focus:outline-none focus:ring-2 focus:ring-astro-blue/40",
                active
                  ? "border-astro-blue/15 bg-gradient-to-r from-astro-blue/12 to-astro-violet/5 text-astro-text shadow-[inset_2px_0_0_var(--accent-blue),0_10px_28px_rgba(0,0,0,0.12)]"
                  : "border-transparent text-astro-muted hover:border-astro-border/60 hover:bg-astro-elevated/45 hover:text-astro-text"
              )}
            >
              <span className="flex items-center gap-3">
                <span className={cn(
                  "grid h-7 w-7 place-items-center rounded-lg border transition",
                  active
                    ? "border-astro-blue/25 bg-astro-blue/10 text-astro-blue"
                    : "border-transparent text-astro-muted group-hover:border-astro-border group-hover:bg-astro-bg/40 group-hover:text-astro-blue"
                )}>
                  <NavIcon label={item.label} className="h-3.5 w-3.5" />
                </span>
                {item.label}
              </span>
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-astro-gold shadow-[0_0_10px_rgba(244,196,95,0.72)]" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="astro-card mt-auto rounded-2xl border border-astro-border/70 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-astro-green">
            <span className="status-pulse h-2 w-2 rounded-full bg-astro-green" aria-hidden="true" />
            Systems online
          </p>
          <span className="font-mono text-[9px] text-[color:var(--text-dim)]">AB-01</span>
        </div>
        <div className="mb-3 h-px bg-gradient-to-r from-astro-border via-astro-blue/20 to-transparent" />
        <p className="text-xs leading-5 text-astro-muted">
          Live public feeds, calm context, and sky tools for curious minds.
        </p>
      </div>
    </aside>
  );
}
