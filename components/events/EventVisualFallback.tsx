import type { SpaceEventCategory } from "@/lib/types";

type EventVisualFallbackProps = {
  category: SpaceEventCategory;
};

export function EventVisualFallback({ category }: EventVisualFallbackProps) {
  const visual = getVisual(category);

  return (
    <div className="flex h-[140px] items-center justify-center overflow-hidden rounded-md border border-astro-border bg-astro-bg/45 md:h-[132px]">
      <svg
        className="h-full w-full"
        viewBox="0 0 240 150"
        role="img"
        aria-label={visual.label}
      >
        <rect width="240" height="150" fill="#070B14" />
        <path d="M0 116H240" stroke="#1E293B" strokeWidth="1" />
        <path d="M0 36H240" stroke="#1E293B" strokeWidth="1" opacity="0.45" />
        <path d="M48 0V150M120 0V150M192 0V150" stroke="#1E293B" strokeWidth="1" opacity="0.28" />
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
          <path d="M44 122C82 76 120 46 188 28" fill="none" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
          <path d="M176 30l18-7-7 18" fill="none" stroke="#D6A84F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M66 114l-18 15 24-5" fill="#D6A84F" opacity="0.8" />
          <circle cx="76" cy="102" r="4" fill="#7DD3FC" />
        </>
      )
    };
  }

  if (category === "sky_event") {
    return {
      label: "Sky event fallback visual",
      nodes: (
        <>
          <path d="M40 44L156 94" stroke="#7DD3FC" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 40L172 90" stroke="#D6A84F" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          <circle cx="190" cy="38" r="2.5" fill="#E5E7EB" />
          <circle cx="98" cy="52" r="1.8" fill="#7DD3FC" />
          <circle cx="138" cy="26" r="1.5" fill="#E5E7EB" opacity="0.7" />
        </>
      )
    };
  }

  if (category === "docking") {
    return {
      label: "Docking fallback visual",
      nodes: (
        <>
          <ellipse cx="120" cy="76" rx="72" ry="28" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx="120" cy="76" r="10" fill="#D6A84F" />
          <rect x="58" y="68" width="34" height="16" rx="3" fill="#7DD3FC" opacity="0.86" />
          <rect x="148" y="68" width="34" height="16" rx="3" fill="#E5E7EB" opacity="0.78" />
          <path d="M94 76H146" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
        </>
      )
    };
  }

  if (category === "landing") {
    return {
      label: "Landing fallback visual",
      nodes: (
        <>
          <path d="M122 24v72" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 78l22 22 22-22" fill="none" stroke="#D6A84F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M70 120h100" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <path d="M92 108h56" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        </>
      )
    };
  }

  if (category === "conference" || category === "space_event") {
    return {
      label: "Signal grid fallback visual",
      nodes: (
        <>
          <path d="M58 104h124" stroke="#334155" strokeWidth="2" />
          <rect x="60" y="48" width="22" height="54" rx="3" fill="#7DD3FC" opacity="0.55" />
          <rect x="98" y="34" width="22" height="68" rx="3" fill="#D6A84F" opacity="0.72" />
          <rect x="136" y="62" width="22" height="40" rx="3" fill="#7DD3FC" opacity="0.74" />
          <path d="M54 36c32 18 86 18 132 0" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 5" />
        </>
      )
    };
  }

  return {
    label: "Event timeline fallback visual",
    nodes: (
      <>
        <path d="M48 78h144" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        <circle cx="74" cy="78" r="8" fill="#D6A84F" />
        <circle cx="120" cy="78" r="8" fill="#7DD3FC" />
        <circle cx="166" cy="78" r="8" fill="#94A3B8" />
      </>
    )
  };
}
