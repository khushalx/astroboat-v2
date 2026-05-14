import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavIconProps = {
  label: string;
  className?: string;
};

export function NavIcon({ label, className }: NavIconProps) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {iconPaths[label] ?? iconPaths.Home}
    </svg>
  );
}

const strokeProps = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

const iconPaths: Record<string, ReactNode> = {
  Home: (
    <>
      <path d="M4 11.5 12 5l8 6.5" {...strokeProps} />
      <path d="M6.5 10.5V19h11v-8.5" {...strokeProps} />
      <path d="M9.5 19v-5h5v5" {...strokeProps} />
    </>
  ),
  Briefs: (
    <>
      <path d="M5 6.5h14" {...strokeProps} />
      <path d="M5 12h10" {...strokeProps} />
      <path d="M5 17.5h7" {...strokeProps} />
      <circle cx="18" cy="16.5" r="1.7" fill="currentColor" />
    </>
  ),
  Events: (
    <>
      <path d="M7 4.5v3M17 4.5v3M5 8h14M6.5 6h11A1.5 1.5 0 0 1 19 7.5v10A1.5 1.5 0 0 1 17.5 19h-11A1.5 1.5 0 0 1 5 17.5v-10A1.5 1.5 0 0 1 6.5 6Z" {...strokeProps} />
      <path d="M8 12h2M14 12h2M8 15.5h2" {...strokeProps} />
    </>
  ),
  Moon: (
    <path
      d="M15.5 3.8A8.5 8.5 0 1 0 20 14.6 6.9 6.9 0 0 1 15.5 3.8Z"
      fill="currentColor"
      opacity="0.92"
    />
  ),
  "Asteroid Watch": (
    <>
      <path d="M4 15.5c4.8-6.5 11.2-7.2 16-2.2" {...strokeProps} />
      <circle cx="8.3" cy="15.2" r="2" fill="currentColor" />
      <circle cx="16.8" cy="10.2" r="1.5" fill="currentColor" opacity="0.65" />
      <path d="M11 18.5h7" {...strokeProps} />
    </>
  )
};
