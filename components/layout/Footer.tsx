import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-astro-border bg-astro-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-[color:var(--text-dim)] sm:px-6 lg:px-8">
        <p className="font-display text-lg text-astro-text">Astroboat</p>
        <p>Astronomy intelligence and sky tools for curious readers.</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-astro-muted">
          <Link href="/briefs" className="hover:text-astro-text">Briefs</Link>
          <span aria-hidden="true">·</span>
          <Link href="/events" className="hover:text-astro-text">Events</Link>
          <span aria-hidden="true">·</span>
          <Link href="/moon" className="hover:text-astro-text">Moon</Link>
          <span aria-hidden="true">·</span>
          <Link href="/asteroids" className="hover:text-astro-text">Asteroid Watch</Link>
          <span aria-hidden="true">·</span>
          <span>Data Sources</span>
        </div>
        <p>© 2025 Astroboat</p>
      </div>
    </footer>
  );
}
