import { cn } from "@/lib/utils";

type EmptyStateProps = { title: string; description: string; className?: string };
export function EmptyState({ title, description, className }: EmptyStateProps) {
  return <div className={cn("empty-state", className)} role="status"><h3>{title}</h3><p>{description}</p></div>;
}
