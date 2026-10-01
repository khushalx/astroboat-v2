import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("space-y-8 pb-10 sm:space-y-10 sm:pb-14", className)}>{children}</div>;
}
