import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AstroCardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "article" | "section" | "div";
};

export function AstroCard({
  children,
  className,
  interactive = false,
  as = "div"
}: AstroCardProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-lg border border-astro-border bg-astro-surface shadow-astro",
        "transition duration-200",
        interactive && "hover:border-[color:var(--border-accent)] hover:bg-astro-elevated",
        className
      )}
    >
      {children}
    </Component>
  );
}
