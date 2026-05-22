import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Contact — Astroboat",
  description: "Contact Astroboat for feedback, bug reports, collaboration, or astronomy platform suggestions."
};

export default function ContactPage() {
  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        eyebrow="Contact"
        title="Contact Astroboat"
        subtitle="For feedback, bug reports, collaboration, or suggestions, contact Astroboat directly."
      />

      <AstroCard className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-astro-text">Email</h2>
        <p className="mt-3 text-sm leading-7 text-astro-muted">
          Send a clear note with the page, issue, or idea you want to discuss.
        </p>
        <a
          href="mailto:khushaldangar29@gmail.com"
          className="mt-5 inline-flex rounded-lg border border-astro-blue/35 bg-astro-blue/10 px-4 py-2 text-sm font-medium text-astro-blue transition hover:border-astro-blue/60 hover:bg-astro-blue/15 hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/25"
        >
          khushaldangar29@gmail.com
        </a>
      </AstroCard>
    </PageShell>
  );
}
