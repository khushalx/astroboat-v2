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
  const [failedSrc, setFailedSrc] = useState<string>();
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const heightClass = featured ? "h-44 sm:h-64" : "h-32 sm:h-40";

  if (src && failedSrc !== src) {
    return (
      <div className={cn("media-frame relative overflow-hidden rounded-xl border border-astro-border/70 bg-astro-bg", heightClass, className)}>
        {loadedSrc !== src && <div className="absolute inset-0 animate-pulse bg-astro-elevated" aria-hidden="true" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={1200}
          height={675}
          loading={featured ? "eager" : "lazy"}
          fetchPriority={featured ? "high" : "auto"}
          referrerPolicy="no-referrer"
          className="relative h-full w-full object-cover transition duration-500 hover:scale-[1.025]"
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
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
