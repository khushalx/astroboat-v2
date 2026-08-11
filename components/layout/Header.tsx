"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="desktop-header sticky top-0 z-40 hidden border-b xl:block">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-8 px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue/35">
          <span className="brand-core h-8 w-8 rounded-lg" aria-hidden="true" />
          <span className="font-display text-xl text-astro-text">Astroboat</span>
        </Link>

        <nav aria-label="Primary navigation" className="flex min-w-0 flex-1 items-center gap-1">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative whitespace-nowrap rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-astro-blue/35",
                  active ? "bg-white/[0.045] text-astro-text" : "text-astro-muted hover:bg-white/[0.025] hover:text-astro-text"
                )}
              >
                {item.label}
                {active ? <span className="absolute inset-x-3 -bottom-[13px] h-px bg-astro-blue" aria-hidden="true" /> : null}
              </Link>
            );
          })}
        </nav>

        <SearchTrigger showShortcut className="shrink-0" />
      </div>
    </header>
  );
}
