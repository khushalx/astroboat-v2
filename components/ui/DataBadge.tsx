import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  scheduled: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  upcoming: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  past: "border-astro-border bg-astro-bg/40 text-astro-muted",
  launch: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  "space event": "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  "sky event": "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  safe: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  watch: "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  notable: "border-astro-red/35 bg-astro-red/10 text-astro-red",
  confirmed: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  "to be confirmed": "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  "to be determined": "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  live: "border-astro-red/35 bg-astro-red/10 text-astro-red",
  completed: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  failed: "border-astro-red/35 bg-astro-red/10 text-astro-red",
  unknown: "border-astro-border bg-astro-elevated text-astro-muted",
  visible: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  excellent: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  good: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  fair: "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  sample: "border-astro-border bg-astro-elevated text-astro-muted",
  "not hazardous": "border-astro-green/30 bg-astro-green/10 text-astro-green",
  research: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  alert: "border-astro-red/35 bg-astro-red/10 text-astro-red",
  monitor: "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  delayed: "border-astro-red/35 bg-astro-red/10 text-astro-red",
  low: "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  daylight: "border-astro-border bg-astro-elevated text-astro-muted",
  beginner: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  starter: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  intermediate: "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  "all levels": "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  online: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  prototype: "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  ready: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  "mock data": "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  "coming next": "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  nasa: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  esa: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  apod: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  arxiv: "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  missions: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  "planetary science": "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  reviewed: "border-astro-green/30 bg-astro-green/10 text-astro-green",
  primary: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue",
  preprint: "border-astro-gold/35 bg-astro-gold/10 text-astro-gold",
  editorial: "border-astro-blue/30 bg-astro-blue/10 text-astro-blue"
};

type DataBadgeProps = {
  label: string;
  className?: string;
};

export function DataBadge({ label, className }: DataBadgeProps) {
  const key = label.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
        "tracking-normal",
        badgeStyles[key] ?? "border-astro-border bg-astro-elevated text-astro-muted",
        className
      )}
    >
      {label}
    </span>
  );
}
