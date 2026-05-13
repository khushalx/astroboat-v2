import { cn } from "@/lib/utils";

type SourceBadgeProps = {
  source: string;
  className?: string;
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border border-astro-border bg-astro-elevated px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-astro-blue",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-astro-blue/70" aria-hidden="true" />
      {source}
    </span>
  );
}
