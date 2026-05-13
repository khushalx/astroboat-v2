import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { SourceBadge } from "@/components/ui/SourceBadge";

const tracked = ["Astronomy briefs", "Global space events", "Moon phase data", "Near-Earth objects", "Manual explainers", "Beginner learning paths"];
const sources = ["NASA", "ESA", "JPL", "USNO", "Space Devs", "arXiv"];

export const metadata: Metadata = {
  title: "About Astroboat — Astronomy Intelligence",
  description: "Learn the mission, tracked domains, and source transparency principles behind Astroboat."
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        title="About Astroboat"
        subtitle="Astroboat is a serious astronomy intelligence and sky tools platform built to make space information calm, readable, and useful."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <AstroCard className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-astro-gold">Mission</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-astro-text">
            Help curious people understand what is happening above them without hype.
          </h2>
          <p className="mt-5 text-sm leading-7 text-astro-muted">
            Astroboat brings together sky events, Moon context, asteroid monitoring, astronomy briefs, and explainers in one place. The tone is scientific and approachable, with special care for beginners who want trustworthy context before technical depth.
          </p>
        </AstroCard>

        <AstroCard className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-astro-gold">Why it exists</p>
          <p className="mt-3 text-sm leading-7 text-astro-muted">
            Space information is often fragmented across mission pages, research archives, alert feeds, social posts, and technical databases. Astroboat is designed as a calmer layer that explains what matters, what is routine, and what a beginner can actually observe.
          </p>
        </AstroCard>
      </div>

      <AstroCard className="p-6">
        <h2 className="text-xl font-semibold text-astro-text">What Astroboat tracks</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tracked.map((item) => (
            <div key={item} className="rounded-lg border border-astro-border bg-astro-elevated p-4">
              <span className="mb-3 block h-1.5 w-8 rounded-full bg-astro-gold" />
              <p className="text-sm font-medium text-astro-text">{item}</p>
            </div>
          ))}
        </div>
      </AstroCard>

      <AstroCard className="p-6">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-astro-gold">Data transparency</p>
            <h2 className="mt-3 text-2xl font-semibold text-astro-text">Sources should stay visible.</h2>
            <p className="mt-4 text-sm leading-7 text-astro-muted">
              Astroboat keeps official public datasets clearly labeled with each source, freshness window, uncertainty, and explanation layer as features mature.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {sources.map((source) => (
              <div key={source} className="rounded-lg border border-astro-border bg-astro-elevated p-4">
                <SourceBadge source={source} />
                <p className="mt-3 text-sm leading-6 text-astro-muted">Planned source badge and freshness metadata placeholder.</p>
              </div>
            ))}
          </div>
        </div>
      </AstroCard>

      <AstroCard className="p-6">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-astro-gold">Founder note</p>
        <p className="mt-3 text-sm leading-7 text-astro-muted">
          Placeholder for the founder story, product philosophy, and the reason Astroboat is built around calm curiosity instead of noisy space headlines.
        </p>
      </AstroCard>
    </PageShell>
  );
}
