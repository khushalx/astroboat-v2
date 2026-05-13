"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-astro-border bg-astro-bg/95 px-5 py-6 shadow-[18px_0_70px_rgba(0,0,0,0.22)] backdrop-blur lg:flex lg:flex-col">
      <Link href="/" className="group mb-8 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
        <span className="relative grid h-10 w-10 place-items-center rounded-lg border border-astro-border bg-astro-elevated">
          <span className="absolute h-6 w-6 rounded-full border border-astro-blue/20" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-astro-gold shadow-[0_0_16px_rgba(214,168,79,0.36)]" />
        </span>
        <span>
          <span className="block text-lg font-semibold tracking-wide text-astro-text">Astroboat</span>
          <span className="block font-mono text-[11px] uppercase tracking-[0.22em] text-astro-muted">
            Sky Intelligence
          </span>
        </span>
      </Link>

      <nav aria-label="Primary navigation" className="space-y-1">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-md border px-3 py-2.5 text-sm font-medium transition",
                "focus:outline-none focus:ring-2 focus:ring-astro-blue/40",
                active
                  ? "border-astro-gold/40 bg-astro-gold/10 text-astro-text shadow-[inset_3px_0_0_rgba(214,168,79,0.65)]"
                  : "border-transparent text-astro-muted hover:border-astro-border hover:bg-astro-surface/80 hover:text-astro-text"
              )}
            >
              <span>{item.label}</span>
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-astro-gold" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mission-surface mt-auto rounded-lg border border-astro-border bg-astro-surface/85 p-4">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-astro-gold">
          <span className="h-2 w-2 rounded-full bg-astro-green" aria-hidden="true" />
          Sky tools online
        </p>
        <p className="mt-2 text-sm leading-6 text-astro-muted">
          Briefs, events, Moon data, and asteroid context are organized for calm daily reading.
        </p>
      </div>
    </aside>
  );
}
