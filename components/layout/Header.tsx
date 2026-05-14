import { SearchTrigger } from "@/components/search/GlobalSearch";

export function Header() {
  return (
    <header className="sticky top-0 z-20 hidden border-b border-astro-border bg-astro-bg/88 shadow-astro backdrop-blur lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-astro-muted">
            <span className="h-px w-7 bg-astro-blue/45" aria-hidden="true" />
            Observatory console
          </p>
          <p className="mt-1 text-sm text-astro-muted">Briefs, events, Moon data, and asteroid context.</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchTrigger showShortcut />
          <span className="inline-flex items-center gap-2 rounded-full border border-astro-gold/35 bg-astro-gold/10 px-3 py-2 text-sm text-astro-gold">
            <span className="h-2 w-2 rounded-full bg-astro-gold" />
            Today
          </span>
        </div>
      </div>
    </header>
  );
}
