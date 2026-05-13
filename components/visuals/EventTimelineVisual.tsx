import { cn } from "@/lib/utils";

type TimelineItem = {
  label: string;
  date: string;
  status?: string;
};

type EventTimelineVisualProps = {
  items: TimelineItem[];
  className?: string;
};

export function EventTimelineVisual({ items, className }: EventTimelineVisualProps) {
  return (
    <div
      className={cn(
        "mission-surface overflow-hidden rounded-lg border border-astro-border bg-astro-elevated/65 p-4",
        className
      )}
      aria-label="Upcoming event timeline"
    >
      <div className="relative flex min-w-[560px] items-start justify-between gap-4">
        <div className="absolute left-8 right-8 top-3 h-px bg-gradient-to-r from-astro-gold/45 via-astro-blue/35 to-astro-border" />
        {items.map((item, index) => (
          <div key={`${item.label}-${item.date}-${index}`} className="relative z-10 flex w-full flex-col items-center text-center">
            <span
              className={cn(
                "h-6 w-6 rounded-full border-2 bg-astro-surface shadow-[0_0_0_4px_rgba(16,24,39,0.8)]",
                index === 0 ? "border-astro-gold bg-astro-gold/10" : "border-astro-blue/70 bg-astro-blue/5"
              )}
            />
            <span className="mt-3 font-mono text-[11px] text-astro-muted">{item.date}</span>
            <span className="mt-1 max-w-28 text-xs font-medium leading-4 text-astro-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
