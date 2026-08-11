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
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <EventVisualFallback category={category} className={className} />;
  }

  return (
    <div className={cn("media-frame h-[160px] overflow-hidden rounded-lg border border-astro-border/70 bg-astro-bg/45 md:h-[152px]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
