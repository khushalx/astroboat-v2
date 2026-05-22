import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

const offers = [
  "Astronomy briefs from trusted public sources",
  "Global space events and launch context",
  "Moon phase, illumination, and viewing guidance",
  "Near-Earth object tracking with calm risk context",
  "Ask Astroboat for astronomy explanations"
];

export const metadata: Metadata = {
  title: "About Astroboat — Astronomy Intelligence & Sky Tools",
  description:
    "Learn about Astroboat, an astronomy intelligence and sky tools platform for briefs, space events, Moon data, asteroid tracking, and astronomy assistance."
};

export default function AboutPage() {
  return (
    <PageShell className="max-w-4xl">
      <PageHeader
        eyebrow="About"
        title="About Astroboat"
        subtitle="Astroboat helps curious readers understand space through calm astronomy briefs, sky tools, and source-linked context."
      />

      <AstroCard className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-astro-text">What is Astroboat?</h2>
        <p className="mt-3 text-sm leading-7 text-astro-muted">
          Astroboat is an astronomy intelligence and sky tools platform that brings together astronomy briefs,
          global space events, Moon data, near-Earth object tracking, and an astronomy assistant in one clean
          observatory-style experience.
        </p>
      </AstroCard>

      <AstroCard className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-astro-text">Why Astroboat Exists</h2>
        <p className="mt-3 text-sm leading-7 text-astro-muted">
          Space information is often scattered across mission pages, research feeds, archives, and technical
          databases. Astroboat exists to make that information easier to scan, verify, and understand without
          hype or unnecessary complexity.
        </p>
      </AstroCard>

      <AstroCard className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-astro-text">What Astroboat Offers</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {offers.map((item) => (
            <div key={item} className="rounded-lg border border-astro-border bg-astro-elevated p-4">
              <span className="mb-3 block h-1.5 w-8 rounded-full bg-astro-gold" aria-hidden="true" />
              <p className="text-sm text-astro-text">{item}</p>
            </div>
          ))}
        </div>
      </AstroCard>

      <AstroCard className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-astro-text">Founder Note</h2>
        <p className="mt-3 text-sm leading-7 text-astro-muted">
          Astroboat is built by Khushal Dangar, an 18-year-old Computer Science and AI student with a strong
          interest in astronomy, space technology, and building useful digital products.
        </p>
      </AstroCard>

      <AstroCard className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-astro-text">Future Vision</h2>
        <p className="mt-3 text-sm leading-7 text-astro-muted">
          The goal is to grow Astroboat into a dependable daily layer for astronomy readers: more sources,
          clearer explainers, better sky tools, and transparent data handling as the platform matures.
        </p>
      </AstroCard>
    </PageShell>
  );
}
