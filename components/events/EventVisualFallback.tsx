import { useId } from "react";
import type { SpaceEventCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type EventVisualFallbackProps = {
  category: SpaceEventCategory;
  className?: string;
};

export function EventVisualFallback({ category, className }: EventVisualFallbackProps) {
  const visual = getVisual(category);
  const gradientId = `event-glow-${useId().replace(/:/g, "")}`;

  return (
    <div className={cn("media-frame flex h-[160px] items-center justify-center overflow-hidden rounded-lg border border-astro-border/70 bg-astro-bg/45 md:h-[152px]", className)}>
      <svg
        className="h-full w-full"
        viewBox="0 0 240 150"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={visual.label}
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="45%" r="70%">
            <stop offset="0" stopColor="#172131" />
            <stop offset="1" stopColor="#070A11" />
          </radialGradient>
        </defs>
        <rect width="240" height="150" fill={`url(#${gradientId})`} />
        <circle cx="204" cy="24" r="1" fill="#F3F6FF" opacity="0.5" />
        <circle cx="25" cy="54" r="0.8" fill="#8ECBE4" opacity="0.5" />
        <circle cx="158" cy="18" r="0.7" fill="#D8B46A" opacity="0.5" />
        {visual.nodes}
      </svg>
    </div>
  );
}

function getVisual(category: SpaceEventCategory) {
  if (category === "launch") {
    return {
      label: "Launch trajectory fallback visual",
      nodes: (
        <>
          <path d="M44 122C82 76 120 46 188 28" fill="none" stroke="#8ECBE4" strokeWidth="3" strokeLinecap="round" />
          <path d="M176 30l18-7-7 18" fill="none" stroke="#D8B46A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M66 114l-18 15 24-5" fill="#D8B46A" opacity="0.72" />
          <circle cx="76" cy="102" r="4" fill="#8ECBE4" />
        </>
      )
    };
  }

  if (category === "sky_event") {
    return {
      label: "Sky event fallback visual",
      nodes: (
        <>
          <path d="M40 44L156 94" stroke="#8ECBE4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 40L172 90" stroke="#D8B46A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <circle cx="190" cy="38" r="2.5" fill="#F3F5F8" />
          <circle cx="98" cy="52" r="1.8" fill="#8ECBE4" />
          <circle cx="138" cy="26" r="1.5" fill="#F3F5F8" opacity="0.7" />
        </>
      )
    };
  }

  if (category === "docking") {
    return {
      label: "Docking fallback visual",
      nodes: (
        <>
          <ellipse cx="120" cy="76" rx="72" ry="28" fill="none" stroke="#3B4C63" strokeWidth="2" />
          <circle cx="120" cy="76" r="10" fill="#D8B46A" />
          <rect x="58" y="68" width="34" height="16" rx="3" fill="#8ECBE4" opacity="0.76" />
          <rect x="148" y="68" width="34" height="16" rx="3" fill="#F3F5F8" opacity="0.72" />
          <path d="M94 76H146" stroke="#AAB3C1" strokeWidth="1.5" strokeDasharray="4 4" />
        </>
      )
    };
  }

  if (category === "landing") {
    return {
      label: "Landing fallback visual",
      nodes: (
        <>
          <path d="M122 24v72" stroke="#8ECBE4" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 78l22 22 22-22" fill="none" stroke="#D8B46A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M70 120h100" stroke="#AAB3C1" strokeWidth="2" strokeLinecap="round" />
          <path d="M92 108h56" stroke="#3B4C63" strokeWidth="3" strokeLinecap="round" />
        </>
      )
    };
  }

  if (category === "conference" || category === "space_event") {
    return {
      label: "Signal grid fallback visual",
      nodes: (
        <>
          <path d="M58 104h124" stroke="#3B4C63" strokeWidth="2" />
          <rect x="60" y="48" width="22" height="54" rx="3" fill="#8ECBE4" opacity="0.5" />
          <rect x="98" y="34" width="22" height="68" rx="3" fill="#D8B46A" opacity="0.66" />
          <rect x="136" y="62" width="22" height="40" rx="3" fill="#8ECBE4" opacity="0.64" />
          <path d="M54 36c32 18 86 18 132 0" fill="none" stroke="#AAB3C1" strokeWidth="1.5" strokeDasharray="4 5" />
        </>
      )
    };
  }

  return {
    label: "Event timeline fallback visual",
    nodes: (
      <>
        <path d="M48 78h144" stroke="#3B4C63" strokeWidth="2" strokeLinecap="round" />
        <circle cx="74" cy="78" r="8" fill="#D8B46A" />
        <circle cx="120" cy="78" r="8" fill="#8ECBE4" />
        <circle cx="166" cy="78" r="8" fill="#AAB3C1" />
      </>
    )
  };
}
