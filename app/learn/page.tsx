import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = pageMetadata({
  title: 'Learning Paths',
  description: 'Astroboat learning paths are currently paused while the editorial system is developed.',
  path: '/learn',
  noindex: true
})

export default function LearnPage() {
  return (
    <PageShell className="max-w-3xl">
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
            className="cosmic-primary rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Back to Home
          </Link>
          <Link
            href="/briefs"
            className="cosmic-secondary rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Read Briefs
          </Link>
        </div>
      </AstroCard>
    </PageShell>
  );
}
