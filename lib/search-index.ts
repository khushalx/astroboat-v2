import { publishedGuides } from "@/lib/guides";

export type SearchItemKind = "Tool" | "Feed" | "Calendar" | "Tracker" | "Home" | "Assistant" | "Gallery" | "Guide";

export type SearchIndexItem = {
  title: string;
  description: string;
  url: string;
  kind: SearchItemKind;
  keywords: string[];
};

export const searchIndex: SearchIndexItem[] = [
  {
    title: "Discover Astroboat",
    description: "Explore astronomy, space imagery, and your sky at a glance",
    url: "/",
    kind: "Home",
    keywords: ["home", "discover", "overview", "observatory", "dashboard", "today", "astroboat"]
  },
  {
    title: "Astronomy Gallery",
    description: "High-resolution imagery of galaxies, nebulae, planets, and deep-space missions from NASA, JWST, and Hubble",
    url: "/gallery",
    kind: "Gallery",
    keywords: ["gallery", "images", "photos", "jwst", "hubble", "apod", "galaxies", "nebulae", "planets", "deep space", "spacecraft", "astrophotography"]
  },
  {
    title: "Astronomy Briefs",
    description: "Short summaries from NASA, ESA, arXiv, and APOD",
    url: "/briefs",
    kind: "Feed",
    keywords: ["news", "summaries", "nasa", "esa", "arxiv", "apod", "research", "astronomy updates"]
  },
  {
    title: "Astronomy Guides",
    description: "Source-linked explainers for the ideas behind Astroboat's live tools",
    url: "/guides",
    kind: "Guide",
    keywords: ["guides", "learn", "explainers", "astronomy basics", "asteroids", "near-earth objects"]
  },
  {
    title: "Space Events Calendar",
    description: "Global launches, mission events, crewed spaceflight updates, and selected sky events",
    url: "/events",
    kind: "Calendar",
    keywords: ["launches", "rocket", "mission", "event", "calendar", "spaceflight"]
  },
  {
    title: "Moon Phase Dashboard",
    description: "Current Moon phase, illumination, moonrise, moonset, and lunar cycle",
    url: "/moon",
    kind: "Tool",
    keywords: ["moon", "lunar", "phase", "full moon", "new moon", "moonrise", "moonset"]
  },
  {
    title: "Asteroid Watch",
    description: "Near-Earth object close approaches, distance, speed, and calm risk context",
    url: "/asteroids",
    kind: "Tracker",
    keywords: ["asteroid", "neo", "near earth object", "jpl", "close approach", "planetary defense"]
  },
  {
    title: "Ask Astroboat",
    description: "Ask simple astronomy chatbot questions about Moon phases, events, asteroids, and space science",
    url: "/ask",
    kind: "Assistant",
    keywords: ["ask", "chatbot", "assistant", "questions", "astronomy basics", "space science"]
  },
  ...publishedGuides.map((guide): SearchIndexItem => ({
    title: guide.title,
    description: guide.description,
    url: `/guides/${guide.slug}`,
    kind: "Guide",
    keywords: [guide.category, ...guide.tags]
  }))
];

export const quickSearchItems = searchIndex.filter((item) =>
  ["Astronomy Gallery", "Moon Phase Dashboard", "Space Events Calendar", "Astronomy Briefs", "Asteroid Watch", "Ask Astroboat"].includes(item.title)
);
