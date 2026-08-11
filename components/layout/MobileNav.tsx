"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/layout/NavIcon";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className="nav-shell sticky top-0 z-40 border-b xl:hidden">
      <div className="relative mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue/35">
          <span className="brand-core h-8 w-8 shrink-0 rounded-lg" aria-hidden="true" />
          <span className="font-display text-xl leading-none text-astro-text">Astroboat</span>
        </Link>

        <div className="flex items-center gap-2">
          <SearchTrigger className="min-h-10 rounded-lg px-3" />
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="glass-control grid h-10 w-10 place-items-center rounded-lg text-astro-muted transition hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
            aria-expanded={open}
            aria-controls="mobile-navigation-panel"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span className={cn("absolute left-0 top-0 h-px w-5 bg-current transition", open && "top-[7px] rotate-45")} />
              <span className={cn("absolute left-0 top-[7px] h-px w-5 bg-current transition", open && "opacity-0")} />
              <span className={cn("absolute bottom-0 left-0 h-px w-5 bg-current transition", open && "bottom-[8px] -rotate-45")} />
            </span>
          </button>
        </div>

        {open ? (
          <nav
            id="mobile-navigation-panel"
            aria-label="Mobile primary navigation"
            className="mobile-menu-panel absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-xl p-2 sm:left-auto sm:right-6 sm:w-[23rem]"
          >
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-astro-blue/35",
                      active ? "bg-astro-blue/10 text-astro-text" : "text-astro-muted hover:bg-white/[0.035] hover:text-astro-text"
                    )}
                  >
                    <NavIcon label={item.label} className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
