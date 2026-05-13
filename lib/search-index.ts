export type SearchItemKind = "Tool" | "Feed" | "Calendar" | "Tracker" | "Home";

export type SearchIndexItem = {
  title: string;
  description: string;
  url: string;
  kind: SearchItemKind;
  keywords: string[];
};

export const searchIndex: SearchIndexItem[] = [
  {
    title: "Home",
    description: "Astroboat overview and today's observatory board",
    url: "/",
    kind: "Home",
    keywords: ["overview", "observatory", "dashboard", "today", "astroboat"]
  },
  {
    title: "Astronomy Briefs",
    description: "Short summaries from NASA, ESA, arXiv, and APOD",
    url: "/briefs",
    kind: "Feed",
    keywords: ["news", "summaries", "nasa", "esa", "arxiv", "apod", "research", "astronomy updates"]
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
  }
];

export const quickSearchItems = searchIndex.filter((item) =>
  ["Moon Phase Dashboard", "Space Events Calendar", "Astronomy Briefs", "Asteroid Watch"].includes(item.title)
);
