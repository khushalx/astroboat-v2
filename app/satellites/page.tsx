import type { Metadata } from "next";
import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Satellite Finder — Astroboat",
  description: "Satellite Finder is temporarily paused while Astroboat focuses on core astronomy tools."
};

export default function SatellitesPausedPage() {
  return (
    <PageShell>
      <PageHeader
        title="Satellite Finder"
        subtitle="This feature is temporarily paused while Astroboat focuses on core astronomy tools."
      />

      <AstroCard className="p-6">
        <p className="max-w-2xl text-sm leading-7 text-astro-muted">
          Satellite tracking will return later with better location support and reliable pass predictions.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex justify-center rounded-md border border-astro-border px-4 py-3 text-sm font-semibold text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Back to Home
          </Link>
          <Link
            href="/events"
            className="inline-flex justify-center rounded-md border border-astro-gold/45 bg-astro-gold/10 px-4 py-3 text-sm font-semibold text-astro-text transition hover:bg-astro-gold/15 focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Explore Space Events
          </Link>
        </div>
      </AstroCard>
    </PageShell>
  );
}
