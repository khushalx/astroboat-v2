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
        "rounded-lg border border-dashed border-astro-border bg-astro-surface/60 p-6 text-center",
        className
      )}
    >
      <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-astro-blue/30 bg-astro-blue/10" />
      <h3 className="text-base font-semibold text-astro-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-astro-muted">{description}</p>
    </div>
  );
}
