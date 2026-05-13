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
        "relative overflow-hidden rounded-lg border border-astro-border/90 bg-astro-surface/90 shadow-astro",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-astro-blue/25 before:to-transparent",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(135deg,rgba(125,211,252,0.035),transparent_42%)]",
        "transition duration-200",
        interactive && "hover:-translate-y-0.5 hover:border-astro-blue/45 hover:bg-astro-elevated hover:shadow-[0_22px_80px_rgba(0,0,0,0.34)]",
        className
      )}
    >
      {children}
    </Component>
  );
}
