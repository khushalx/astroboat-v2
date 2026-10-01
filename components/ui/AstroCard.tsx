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
        "astro-card relative overflow-hidden rounded-xl border",
        interactive && "astro-card-interactive",
        className
      )}
    >
      {children}
    </Component>
  );
}
