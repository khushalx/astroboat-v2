import { cn } from "@/lib/utils";

type SourceBadgeProps = {
  source: string;
  className?: string;
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-medium text-astro-muted",
        className
      )}
    >
      {source}
    </span>
  );
}
