"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/layout/Brand";
import { NavIcon } from "@/components/layout/NavIcon";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function dismiss(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="nav-shell sticky top-0 z-40 border-b lg:hidden" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <div className="site-container relative flex h-[72px] items-center justify-between gap-3">
        <Link href="/" aria-label="Astroboat home" className="rounded-md"><Brand /></Link>
        <div className="flex items-center gap-2">
          <SearchTrigger compact className="h-11 w-11 justify-center rounded-full" />
          <button ref={buttonRef} type="button" onClick={() => setOpen((current) => !current)} className="glass-control grid h-11 w-11 place-items-center rounded-full text-astro-text" aria-expanded={open} aria-controls="mobile-navigation-panel" aria-label={open ? "Close navigation menu" : "Open navigation menu"}>
            <span className="relative block h-3.5 w-4" aria-hidden="true">
              <span className={cn("absolute left-0 top-0 h-px w-4 bg-current transition", open && "translate-y-[6.5px] rotate-45")} />
              <span className={cn("absolute left-0 top-[6.5px] h-px w-4 bg-current transition", open && "opacity-0")} />
              <span className={cn("absolute bottom-0 left-0 h-px w-4 bg-current transition", open && "-translate-y-[6.5px] -rotate-45")} />
            </span>
          </button>
        </div>
        {open && (
          <nav id="mobile-navigation-panel" aria-label="Mobile primary navigation" className="mobile-menu-panel absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-2xl p-3 sm:left-auto sm:right-6 sm:w-[25rem]">
            <p className="eyebrow px-3 pb-3 pt-2">Explore Astroboat</p>
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={cn("flex min-h-12 items-center gap-2.5 rounded-xl px-3 py-3 text-sm transition", active ? "bg-astro-gold/10 text-astro-gold" : "text-astro-muted hover:bg-white/5 hover:text-astro-text")}>
                    <NavIcon label={item.label} className="h-4 w-4 shrink-0" />{item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
