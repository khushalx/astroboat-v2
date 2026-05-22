import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Terms of Use — Astroboat",
  description: "Read Astroboat's terms for educational use, data accuracy, AI assistant limitations, and acceptable usage."
};

export default function TermsPage() {
  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        eyebrow="Terms"
        title="Terms of Use"
        subtitle="Astroboat is built for astronomy learning, sky awareness, and source-linked context."
      />

      <AstroCard className="space-y-5 p-5 text-sm leading-7 text-astro-muted sm:p-6">
        <section>
          <h2 className="text-lg font-semibold text-astro-text">Educational Use</h2>
          <p className="mt-2">
            Astroboat is provided for educational and informational purposes. It is not a professional scientific,
            legal, safety, navigation, or operational decision-making system.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-astro-text">Astronomy Data</h2>
          <p className="mt-2">
            Astronomy data may be delayed, unavailable, approximate, or affected by third-party service changes.
            Use original sources for confirmation, especially when timing, visibility, or scientific precision matters.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-astro-text">AI Assistant</h2>
          <p className="mt-2">
            Astroboat Assistant responses may be incomplete or inaccurate. Verify important answers with original
            sources, official agencies, research papers, or expert guidance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-astro-text">Acceptable Use</h2>
          <p className="mt-2">
            Abusive use of the site or chatbot is not allowed. This includes attempts to overload services, misuse
            APIs, submit harmful content, or interfere with the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-astro-text">No Guarantees</h2>
          <p className="mt-2">
            Astroboat is provided as-is, without guarantees of uninterrupted access, data completeness, or error-free
            operation.
          </p>
        </section>
      </AstroCard>
    </PageShell>
  );
}
