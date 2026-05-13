"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-astro-border bg-astro-bg/95 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-astro-border bg-astro-elevated">
            <span className="absolute h-5 w-5 rounded-full border border-astro-blue/20" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-astro-gold" />
          </span>
          <span>
            <span className="block text-base font-semibold text-astro-text">Astroboat</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-astro-muted">
              Sky tools
            </span>
          </span>
        </Link>
        <SearchTrigger className="bg-astro-surface/80" />
      </div>
      <nav aria-label="Mobile primary navigation" className="overflow-x-auto px-3 pb-3">
        <div className="flex min-w-max gap-2">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-astro-blue/40",
                  active
                    ? "border-astro-gold/40 bg-astro-gold/10 text-astro-text"
                    : "border-astro-border bg-astro-surface/50 text-astro-muted hover:text-astro-text"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
