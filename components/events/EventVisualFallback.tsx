import type { SpaceEventCategory } from "@/lib/types";
import { cn, humanizeToken } from "@/lib/utils";

export function EventVisualFallback({ category, className }: { category: SpaceEventCategory; className?: string }) {
  return <div className={cn("media-frame flex h-[160px] items-center justify-center rounded border border-astro-border/70 bg-astro-elevated/40 p-3 text-center md:h-[152px]", className)} role="img" aria-label="Event image unavailable">
    <span className="text-xs leading-5 text-astro-muted">{humanizeToken(category)}</span>
  </div>;
}
