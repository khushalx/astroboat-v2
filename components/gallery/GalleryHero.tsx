"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";

type GalleryHeroProps = { image: GalleryImage; onSelect: (image: GalleryImage) => void };
export function GalleryHero({ image, onSelect }: GalleryHeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const urls = [...new Set([image.imageUrl, image.thumbnailUrl, image.hdImageUrl].filter((url): url is string => Boolean(url)))];
  return (
    <section className="gallery-feature" aria-label="Featured observation">
      <button type="button" className="gallery-feature-image" onClick={() => onSelect(image)} aria-label={`View ${image.title} in high resolution`}>
        {!loaded && !failed && <span className="absolute inset-0 animate-pulse bg-white/[.03]" aria-hidden="true" />}
        {failed ? <span className="absolute inset-0 grid place-items-center px-6 text-sm text-astro-muted">Preview unavailable. Open the observation for its original source.</span> : <Image src={urls[srcIndex]} alt={image.title} fill priority sizes="(max-width: 639px) 100vw, 60vw" unoptimized referrerPolicy="no-referrer" className={loaded ? "opacity-100" : "opacity-0"} onLoad={() => setLoaded(true)} onError={() => {
          setLoaded(false);
          if (srcIndex + 1 < urls.length) setSrcIndex(srcIndex + 1); else setFailed(true);
        }} />}
      </button>
      <div className="gallery-feature-copy">
        <span className="eyebrow text-astro-gold">In focus · {image.category}</span>
        <h2>{image.title}</h2>
        <p className="line-clamp-4">{image.description}</p>
        <p className="gallery-feature-credit">{image.credit}<br /><time dateTime={image.date}>{image.date}</time>{image.observatory ? ` · ${image.observatory}` : ""}</p>
        <button type="button" className="cosmic-secondary mt-5 inline-flex items-center gap-4 px-4 py-2 text-xs" onClick={() => onSelect(image)}>Explore the observation <span aria-hidden="true">↗</span></button>
      </div>
    </section>
  );
}
