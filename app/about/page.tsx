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

      <AstroCard as="article" className="divide-y divide-astro-border/70 p-0">
        <section className="p-5 sm:p-7">
          <h2 className="font-display text-2xl font-normal text-astro-text">What is Astroboat?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-astro-muted">
            Astroboat is an astronomy intelligence and sky tools platform that brings together astronomy briefs,
            global space events, Moon data, near-Earth object tracking, and an astronomy assistant in one clean
            observatory-style experience.
          </p>
        </section>

        <section className="p-5 sm:p-7">
          <h2 className="font-display text-2xl font-normal text-astro-text">Why Astroboat exists</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-astro-muted">
            Space information is often scattered across mission pages, research feeds, archives, and technical
            databases. Astroboat exists to make that information easier to scan, verify, and understand without
            hype or unnecessary complexity.
          </p>
        </section>

        <section className="p-5 sm:p-7">
          <h2 className="font-display text-2xl font-normal text-astro-text">What Astroboat offers</h2>
          <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
            {offers.map((item) => (
              <li key={item} className="border-t border-astro-border/60 py-3 text-sm leading-6 text-astro-text">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 sm:p-7">
          <h2 className="font-display text-2xl font-normal text-astro-text">Founder note</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-astro-muted">
            Astroboat is built by Khushal Dangar, an 18-year-old Computer Science and AI student with a strong
            interest in astronomy, space technology, and building useful digital products.
          </p>
        </section>

        <section className="p-5 sm:p-7">
          <h2 className="font-display text-2xl font-normal text-astro-text">Future vision</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-astro-muted">
            The goal is to grow Astroboat into a dependable daily layer for astronomy readers: more sources,
            clearer explainers, better sky tools, and transparent data handling as the platform matures.
          </p>
        </section>
      </AstroCard>
    </PageShell>
  );
}
