import { cn } from "@/lib/utils";

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = "Loading Astroboat data", className }: LoadingStateProps) {
  return (
    <div
      className={cn("rounded-lg border border-astro-border bg-astro-surface/70 p-5 text-sm text-astro-muted", className)}
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  );
}
