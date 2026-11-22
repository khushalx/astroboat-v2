"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/layout/Brand";
import { SearchTrigger } from "@/components/search/GlobalSearch";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

const primaryLinks = navItems.filter((item) => item.href !== "/ask");

export function Header() {
  const pathname = usePathname();

  return (
    <header className="desktop-header sticky top-0 z-40 hidden border-b lg:block">
      <div className="site-container flex h-[80px] items-center justify-between gap-5">
        <Link href="/" aria-label="Astroboat home" className="shrink-0 rounded-md"><Brand /></Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-1 whitespace-nowrap xl:gap-3">
          {primaryLinks.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("header-link", active && "is-active")}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">
          <SearchTrigger compact showShortcut />
          <Link href="/ask" className="cosmic-primary inline-flex min-h-11 items-center gap-3 rounded-md px-4 text-sm font-semibold">Ask Astroboat <ArrowIcon diagonal /></Link>
        </div>
      </div>
    </header>
  );
}
