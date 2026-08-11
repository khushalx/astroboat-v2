import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-astro-border bg-white/[0.018] p-8 text-center",
        className
      )}
    >
      <span className="mx-auto mb-4 block h-2 w-2 rounded-full bg-astro-blue/80" aria-hidden="true" />
      <h3 className="font-display text-xl font-normal text-astro-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-astro-muted">{description}</p>
    </div>
  );
}
