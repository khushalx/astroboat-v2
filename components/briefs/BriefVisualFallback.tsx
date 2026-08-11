import { useId } from "react";
import { cn } from "@/lib/utils";

type BriefVisualFallbackProps = {
  category?: string;
  source?: string;
  tags?: string[];
  title?: string;
  featured?: boolean;
  className?: string;
};

type VisualKind = "astrophysics" | "solar" | "planetary" | "mission" | "research" | "apod" | "signal";

export function BriefVisualFallback({
  category = "",
  source = "Astroboat",
  tags = [],
  title = "",
  featured = false,
  className
}: BriefVisualFallbackProps) {
  const kind = getVisualKind({ category, source, tags, title });
  const heightClass = featured ? "h-44 sm:h-64" : "h-32 sm:h-40";
  const gradientId = `brief-wash-${useId().replace(/:/g, "")}`;

  return (
    <div
      className={cn("media-frame relative overflow-hidden rounded-xl border border-astro-border/70 bg-astro-bg", heightClass, className)}
      role="img"
      aria-label={`${source} ${category || "brief"} visual`}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id={gradientId} cx="38%" cy="45%" r="78%">
            <stop offset="0" stopColor="#172131" />
            <stop offset="1" stopColor="#090d15" />
          </radialGradient>
        </defs>
        <rect width="420" height="180" fill={`url(#${gradientId})`} />
        {renderVisual(kind)}
      </svg>
      <div className="absolute bottom-3 left-4 right-4 z-10 hidden items-center justify-between gap-3 sm:flex">
        <div className="text-[11px] font-medium text-astro-muted">
          {fallbackLabel(kind)}
        </div>
        <span className="max-w-28 truncate text-[11px] text-[color:var(--text-dim)]">
          {source}
        </span>
      </div>
    </div>
  );
}

function getVisualKind({
  category,
  source,
  tags,
  title
}: {
  category: string;
  source: string;
  tags: string[];
  title: string;
}): VisualKind {
  const text = `${category} ${source} ${tags.join(" ")} ${title}`.toLowerCase();

  if (/apod|image of the day/.test(text)) return "apod";
  if (/solar|sun|space weather|coronal|heliosphere/.test(text)) return "solar";
  if (/launch|mission|spacecraft|artemis|crew|rocket/.test(text)) return "mission";
  if (/arxiv|research|paper|survey|spectroscopy/.test(text)) return "research";
  if (/planet|moon|mars|jupiter|saturn|venus|asteroid|comet|near-earth|neo/.test(text)) return "planetary";
  if (/exoplanet|astrobiology|galaxy|cosmology|black hole|star|webb|hubble|nebula/.test(text)) return "astrophysics";

  return "signal";
}

function fallbackLabel(kind: VisualKind) {
  const labels: Record<VisualKind, string> = {
    astrophysics: "Astrophysics",
    solar: "Solar science",
    planetary: "Planetary science",
    mission: "Space mission",
    research: "Research",
    apod: "Sky image",
    signal: "Astronomy brief"
  };

  return labels[kind];
}

function renderVisual(kind: VisualKind) {
  switch (kind) {
    case "astrophysics":
      return (
        <>
          <circle cx="128" cy="86" r="10" fill="#d8b46a" />
          <ellipse cx="128" cy="86" rx="86" ry="30" fill="none" stroke="#8ecbe4" strokeWidth="2" opacity="0.5" />
          <ellipse cx="128" cy="86" rx="132" ry="48" fill="none" stroke="#d8b46a" strokeWidth="1.4" opacity="0.28" />
          <circle cx="254" cy="55" r="3" fill="#f3f5f8" opacity="0.85" />
          <circle cx="304" cy="108" r="2" fill="#8ecbe4" opacity="0.75" />
        </>
      );
    case "solar":
      return (
        <>
          <circle cx="128" cy="88" r="35" fill="#d8b46a" opacity="0.86" />
          <path d="M190 56c34 10 44 34 82 33M190 88c42 3 58 24 104 17M188 120c32-9 53 1 86-14" fill="none" stroke="#8ecbe4" strokeWidth="2" opacity="0.45" />
          <path d="M128 34v-18M128 160v-18M74 88H56M200 88h-18" stroke="#6b5730" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        </>
      );
    case "planetary":
      return (
        <>
          <circle cx="154" cy="88" r="42" fill="#8ecbe4" opacity="0.58" />
          <path d="M76 102c66-30 143-34 226-13" fill="none" stroke="#d8b46a" strokeWidth="3" opacity="0.62" />
          <circle cx="254" cy="58" r="11" fill="#d8b46a" opacity="0.74" />
          <circle cx="114" cy="72" r="5" fill="#f3f5f8" opacity="0.22" />
        </>
      );
    case "mission":
      return (
        <>
          <path d="M64 130C116 76 184 52 302 50" fill="none" stroke="#d8b46a" strokeWidth="3" strokeLinecap="round" />
          <path d="M292 39l28 11-27 14 7-14-8-11Z" fill="#8ecbe4" opacity="0.82" />
          <circle cx="84" cy="116" r="6" fill="#d8b46a" />
          <path d="M76 140h96M206 74h82" stroke="#263244" strokeWidth="2" opacity="0.9" />
        </>
      );
    case "research":
      return (
        <>
          <rect x="92" y="42" width="84" height="100" rx="8" fill="#111824" stroke="#3b4c63" strokeWidth="2" />
          <path d="M112 70h44M112 91h36M112 112h50" stroke="#aab3c1" strokeWidth="3" strokeLinecap="round" opacity="0.58" />
          <path d="M214 52h74M214 88h98M214 124h56" stroke="#8ecbe4" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          <circle cx="196" cy="88" r="4" fill="#d8b46a" />
        </>
      );
    case "apod":
      return (
        <>
          <circle cx="116" cy="64" r="2.2" fill="#f3f5f8" />
          <circle cx="168" cy="118" r="1.8" fill="#d8b46a" />
          <circle cx="242" cy="52" r="2.4" fill="#8ecbe4" />
          <circle cx="302" cy="112" r="1.6" fill="#f3f5f8" opacity="0.8" />
          <path d="M74 126c62-72 166-86 280-54" fill="none" stroke="#8ecbe4" strokeWidth="1.8" opacity="0.38" />
        </>
      );
    default:
      return (
        <>
          <path d="M70 90h220" stroke="#3b4c63" strokeWidth="2" />
          <circle cx="126" cy="90" r="9" fill="#8ecbe4" />
          <circle cx="126" cy="90" r="24" fill="none" stroke="#8ecbe4" strokeWidth="2" opacity="0.2" />
          <path d="M166 72h90M166 94h128M166 116h64" stroke="#d8b46a" strokeWidth="2" strokeLinecap="round" opacity="0.42" />
        </>
      );
  }
}
