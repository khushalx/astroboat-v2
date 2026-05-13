import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroboat.in";

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: absoluteUrl("/briefs"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: absoluteUrl("/events"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: absoluteUrl("/moon"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: absoluteUrl("/asteroids"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.8
    }
  ];
}
