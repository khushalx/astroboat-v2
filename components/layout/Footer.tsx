import Link from "next/link";

export function Footer() {
  const links = [
    { label: "Briefs", href: "/briefs" },
    { label: "Events", href: "/events" },
    { label: "Moon", href: "/moon" },
    { label: "Asteroid Watch", href: "/asteroids" },
    { label: "About", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Data Sources", href: "/data-sources" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <footer className="border-t border-astro-border bg-astro-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-[color:var(--text-dim)] sm:px-6 lg:px-8">
        <p className="font-display text-lg text-astro-text">Astroboat</p>
        <p>Astronomy intelligence and sky tools for curious readers.</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-astro-muted">
          {links.map((link, index) => (
            <span key={link.href} className="inline-flex items-center gap-3">
              {index > 0 ? <span aria-hidden="true">·</span> : null}
              <Link href={link.href} className="transition hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/25">
                {link.label}
              </Link>
            </span>
          ))}
        </div>
        <p>© 2026 Astroboat</p>
      </div>
    </footer>
  );
}
