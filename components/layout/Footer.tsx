import Link from "next/link";
import { Brand } from "@/components/layout/Brand";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

const links = [
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Editorial policy", href: "/editorial-policy" },
  { label: "Data sources", href: "/data-sources" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "RSS", href: "/feed.xml" }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div>
            <Link href="/" aria-label="Astroboat home"><Brand /></Link>
            <p className="mt-4 text-sm text-astro-muted">For the endlessly curious.</p>
          </div>
          <Link href="/ask" className="footer-invitation">There’s a whole universe to ask about.<ArrowIcon diagonal /></Link>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Astroboat</p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => <Link key={link.href} href={link.href} className="transition hover:text-astro-text">{link.label}</Link>)}
          </nav>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-astro-gold" />Made for discovery</span>
        </div>
      </div>
    </footer>
  );
}
