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
    <PageShell>
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
            className="rounded-md border border-astro-gold/45 bg-astro-gold/10 px-4 py-3 text-sm font-semibold text-astro-text transition hover:bg-astro-gold/15 focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Back to Home
          </Link>
          <Link
            href="/events"
            className="rounded-md border border-astro-border px-4 py-3 text-sm font-semibold text-astro-muted transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Explore Events
          </Link>
        </div>
      </AstroCard>
    </PageShell>
  );
}
