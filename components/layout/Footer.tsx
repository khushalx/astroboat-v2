import Link from "next/link";

export function Footer() {
  const links = [
    { label: "Briefs", href: "/briefs" },
    { label: "Events", href: "/events" },
    { label: "Moon", href: "/moon" },
    { label: "Asteroid Watch", href: "/asteroids" },
    { label: "Ask Astroboat", href: "/ask" },
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Data Sources", href: "/data-sources" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <footer className="border-t border-astro-border/60 bg-astro-bg/45">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-9 text-sm text-[color:var(--text-dim)] sm:px-6 lg:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="brand-core h-8 w-8 rounded-lg border border-astro-gold/20" aria-hidden="true" />
            <p className="font-display text-xl text-astro-text">Astroboat</p>
          </div>
          <p className="max-w-md text-sm leading-6 text-astro-muted">Astronomy intelligence and sky tools for curious readers.</p>
          <p className="mt-3 text-xs">© 2026 Astroboat</p>
        </div>
        <div className="grid grid-cols-2 content-start gap-x-6 gap-y-2 text-astro-muted sm:grid-cols-3 lg:justify-self-end">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="py-1 transition hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/25">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
