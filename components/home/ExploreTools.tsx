import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ToolCard } from "@/lib/types";

type ExploreToolsProps = {
  tools: ToolCard[];
};

export function ExploreTools({ tools }: ExploreToolsProps) {
  return (
    <section className="py-8">
      <SectionHeader
        title="Moon Phase & Asteroid Watch"
        subtitle="Focused sky tools for lunar conditions and calm near-Earth object context."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <AstroCard key={tool.title} as="article" className="p-5" interactive>
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-astro-border bg-astro-elevated">
                <span className="h-4 w-4 rounded-full border border-astro-blue" />
              </span>
              <DataBadge label={tool.status} />
            </div>
            <h3 className="text-lg font-semibold text-astro-text">{tool.title}</h3>
            <p className="mt-3 min-h-16 text-sm leading-6 text-astro-muted">{tool.description}</p>
            <Link
              href={tool.href}
              className="mt-5 inline-flex rounded-md border border-astro-border px-3 py-2 text-sm font-medium text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
            >
              Open tool
            </Link>
          </AstroCard>
        ))}
      </div>
    </section>
  );
}
