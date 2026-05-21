"use client";

import { useState } from "react";
import { EventVisualFallback } from "@/components/events/EventVisualFallback";
import type { SpaceEventCategory } from "@/lib/types";

type EventImageProps = {
  src?: string;
  alt: string;
  category: SpaceEventCategory;
};

export function EventImage({ src, alt, category }: EventImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <EventVisualFallback category={category} />;
  }

  return (
    <div className="h-[140px] overflow-hidden rounded-md border border-astro-border bg-astro-bg/45 md:h-[132px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
