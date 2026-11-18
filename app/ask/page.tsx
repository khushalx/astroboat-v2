import { pageMetadata } from "@/lib/seo";
import { AstrobotClient } from "@/components/ask/AstrobotClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = pageMetadata({
  title: 'Ask Astroboat Astronomy Questions',
  description: 'Ask the Astroboat assistant astronomy questions and explore related live sky tools.',
  path: '/ask',
  noindex: true
})

export default function AskPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Your cosmic companion"
        title="Ask Astroboat"
        subtitle="A little clarity on the big questions. Explore astronomy with a curious, science-focused assistant."
      />
      <AstrobotClient />
    </PageShell>
  );
}
