import { cn } from "@/lib/utils";

type BriefVisualFallbackProps = {
  category?: string;
  source?: string;
  tags?: string[];
  title?: string;
  featured?: boolean;
  className?: string;
};

export function BriefVisualFallback({ category, source = "Astroboat", featured = false, className }: BriefVisualFallbackProps) {
  return (
    <div className={cn("media-frame flex flex-col items-center justify-center gap-3 overflow-hidden rounded border border-astro-border/70 bg-astro-elevated/40 p-4 text-center", featured ? "h-44 sm:h-64" : "h-32 sm:h-40", className)} role="img" aria-label={`${source}: image preview unavailable`}>
      <span className="font-mono text-xl text-astro-gold" aria-hidden="true">{source.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase()}</span>
      <span className="text-xs leading-5 text-astro-muted">{category || "Astronomy brief"}</span>
    </div>
  );
}
