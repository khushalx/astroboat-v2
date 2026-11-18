"use client";

import { useState } from "react";
import { EventVisualFallback } from "@/components/events/EventVisualFallback";
import type { SpaceEventCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type EventImageProps = {
  src?: string;
  alt: string;
  category: SpaceEventCategory;
  className?: string;
};

export function EventImage({ src, alt, category, className }: EventImageProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const [loadedSrc, setLoadedSrc] = useState<string>();

  if (!src || failedSrc === src) {
    return <EventVisualFallback category={category} className={className} />;
  }

  return (
    <div className={cn("media-frame relative h-[160px] overflow-hidden rounded-lg border border-astro-border/70 bg-astro-bg/45 md:h-[152px]", className)}>
      {loadedSrc !== src && <div className="absolute inset-0 animate-pulse bg-astro-elevated" aria-hidden="true" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={320}
        height={180}
        className="relative h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
      />
    </div>
  );
}
