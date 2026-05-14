"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/layout/NavIcon";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-astro-border bg-astro-surface px-5 py-6 shadow-astro lg:flex lg:flex-col">
      <Link href="/" className="group mb-8 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
        <span className="relative grid h-10 w-10 place-items-center rounded-lg border border-astro-border bg-astro-elevated">
          <span className="absolute h-6 w-6 rounded-full border border-astro-blue/20" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-astro-gold" />
        </span>
        <span>
          <span className="font-display block text-xl font-normal tracking-wide text-astro-gold">Astroboat</span>
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
                  ? "border-transparent bg-transparent text-astro-text shadow-[inset_2px_0_0_var(--accent-gold)]"
                  : "border-transparent text-astro-muted hover:text-astro-text"
              )}
            >
              <span className="flex items-center gap-3">
                <NavIcon label={item.label} className={active ? "text-astro-gold" : "text-astro-muted"} />
                {item.label}
              </span>
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-astro-gold" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-astro-border bg-astro-bg/40 p-4">
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
