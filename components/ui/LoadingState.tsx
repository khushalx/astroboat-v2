import { cn } from "@/lib/utils";

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = "Loading Astroboat data", className }: LoadingStateProps) {
  return (
    <div
      className={cn("flex min-h-48 items-center justify-center gap-3 text-sm text-astro-muted", className)}
      role="status"
      aria-live="polite"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-astro-blue" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
