"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/layout/Brand";
import { NavIcon } from "@/components/layout/NavIcon";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { skyToolItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { label: "Discover", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Briefs", href: "/briefs" },
  { label: "Events", href: "/events" }
];

export function Header() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setToolsOpen(false), [pathname]);

  useEffect(() => {
    if (!toolsOpen) return;
    function dismiss(event: PointerEvent) {
      if (!toolsRef.current?.contains(event.target as Node)) setToolsOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setToolsOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [toolsOpen]);

  return (
    <header className="desktop-header sticky top-0 z-40 hidden border-b lg:block">
      <div className="site-container flex h-[84px] items-center justify-between gap-5">
        <Link href="/" aria-label="Astroboat home" className="rounded-md"><Brand /></Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-1 xl:gap-3">
          {primaryLinks.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("header-link", active && "is-active")}>
                {item.label}
              </Link>
            );
          })}
          <div className="relative" ref={toolsRef} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setToolsOpen(false);
          }}>
            <button ref={triggerRef} type="button" onClick={() => setToolsOpen(!toolsOpen)} aria-expanded={toolsOpen} aria-controls="sky-tools-menu" className={cn("header-link flex items-center gap-2", skyToolItems.some((item) => pathname.startsWith(item.href)) && "is-active")}>
              Sky tools
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={cn("transition-transform", toolsOpen && "rotate-180")}><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </button>
            {toolsOpen && (
              <div id="sky-tools-menu" className="sky-tools-menu">
                <p className="eyebrow mb-3 px-3">Your personal observatory</p>
                {skyToolItems.map((item) => (
                  <Link href={item.href} key={item.href} onClick={() => setToolsOpen(false)} aria-current={pathname.startsWith(item.href) ? "page" : undefined} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-astro-muted transition hover:bg-white/5 hover:text-astro-text">
                    <NavIcon label={item.label} className="h-5 w-5 text-astro-gold" />
                    <span>{item.label}</span><ArrowIcon className="ml-auto opacity-50" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-3">
          <SearchTrigger compact showShortcut />
          <Link href="/ask" className="cosmic-primary inline-flex min-h-10 items-center gap-3 rounded-full px-4 text-sm font-semibold">Ask Astroboat <ArrowIcon diagonal /></Link>
        </div>
      </div>
    </header>
  );
}
