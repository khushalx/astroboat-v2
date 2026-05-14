"use client";

import { useState } from "react";
import { BriefVisualFallback } from "@/components/briefs/BriefVisualFallback";
import { cn } from "@/lib/utils";

type BriefImageProps = {
  src?: string;
  alt: string;
  source?: string;
  category?: string;
  tags?: string[];
  title?: string;
  featured?: boolean;
  className?: string;
};

export function BriefImage({
  src,
  alt,
  source = "Astroboat",
  category,
  tags = [],
  title = "",
  featured = false,
  className
}: BriefImageProps) {
  const [failed, setFailed] = useState(false);
  const heightClass = featured ? "h-44 sm:h-64" : "h-32 sm:h-40";

  if (src && !failed) {
    return (
      <div className={cn("overflow-hidden rounded-lg border border-astro-border bg-astro-bg", heightClass, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <BriefVisualFallback
      category={category}
      source={source}
      tags={tags}
      title={title}
      featured={featured}
      className={className}
    />
  );
}
