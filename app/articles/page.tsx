import Link from "next/link";
import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Articles Coming Later — Astroboat",
  description: "Astroboat long-form articles are paused while the core astronomy tools are stabilized."
};

export default function ArticlesPage() {
  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        title="Articles"
        subtitle="This section is temporarily paused while Astroboat focuses on core astronomy tools."
      />

      <AstroCard className="p-6">
        <p className="max-w-2xl text-sm leading-7 text-astro-muted">
          Long-form explainers will return later with a cleaner editorial system. For now, Astroboat is focused on
          briefs, space events, Moon data, and near-Earth object context.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="cosmic-primary rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Back to Home
          </Link>
          <Link
            href="/events"
            className="cosmic-secondary rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Explore Events
          </Link>
        </div>
      </AstroCard>
    </PageShell>
  );
}
