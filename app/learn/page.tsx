import Link from "next/link";
import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Learning Paths Coming Later — Astroboat",
  description: "Astroboat learning paths are paused while the core astronomy tools are stabilized."
};

export default function LearnPage() {
  return (
    <PageShell>
      <PageHeader
        title="Learning Paths"
        subtitle="This section is temporarily paused while Astroboat focuses on core astronomy tools."
      />

      <AstroCard className="p-6">
        <p className="max-w-2xl text-sm leading-7 text-astro-muted">
          Learning paths will return later with a more focused structure for sky watching, Moon basics, asteroids,
          missions, and careful science reading.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-md border border-astro-gold/45 bg-astro-gold/10 px-4 py-3 text-sm font-semibold text-astro-text transition hover:bg-astro-gold/15 focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Back to Home
          </Link>
          <Link
            href="/briefs"
            className="rounded-md border border-astro-border px-4 py-3 text-sm font-semibold text-astro-muted transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Read Briefs
          </Link>
        </div>
      </AstroCard>
    </PageShell>
  );
}
