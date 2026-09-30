export type Guide = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  aiAssisted?: boolean;
  category: string;
  tags: string[];
  readingMinutes: number;
  heroImage?: { src: string; alt: string; credit: string; creditUrl: string };
  ogImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  showTableOfContents?: boolean;
  sections: { id: string; heading: string; paragraphs: string[] }[];
  sources: { label: string; url: string }[];
  relatedPaths: { label: string; href: string }[];
  status: "published" | "draft";
};

// Add hand-reviewed guides here. Drafts stay out of public routes and the sitemap.
const guides: Guide[] = [
  {
    slug: "what-is-a-near-earth-object",
    title: "What Is a Near-Earth Object?",
    description: "A clear guide to near-Earth asteroids and comets, close-approach distances, and what a hazardous classification means.",
    publishedAt: "2026-09-30",
    author: "Astroboat",
    aiAssisted: true,
    category: "Asteroids",
    tags: ["Near-Earth objects", "Asteroids", "Planetary defense"],
    readingMinutes: 4,
    showTableOfContents: true,
    sections: [
      {
        id: "definition",
        heading: "The short definition",
        paragraphs: [
          "A near-Earth object, or NEO, is an asteroid or comet whose orbit brings it into Earth's neighborhood around the Sun. In orbital terms, NASA uses a closest distance to the Sun of less than 1.3 astronomical units. Most known NEOs are asteroids.",
          "Near-Earth describes an orbit, not an impact prediction. An object can be classified as an NEO without being on a collision course with Earth."
        ]
      },
      {
        id: "close-approach",
        heading: "What a close approach tells you",
        paragraphs: [
          "A close-approach listing gives the predicted date, distance, and speed when an object passes Earth. Astroboat's Asteroid Watch uses NASA JPL close-approach data and displays distance in kilometres and lunar distances. One lunar distance is roughly the average separation between Earth and the Moon, about 384,400 kilometres.",
          "The word close is relative to astronomical scales. A pass many lunar distances away can still appear on a close-approach list. Distance and orbit uncertainty matter more than a dramatic headline."
        ]
      },
      {
        id: "hazardous",
        heading: "Does potentially hazardous mean dangerous now?",
        paragraphs: [
          "No. NASA's potentially hazardous asteroid category describes objects with an orbit that can approach Earth's orbit within about 7.5 million kilometres and an estimated diameter of at least about 140 metres. The classification flags objects worth tracking. It does not say that an impact is expected on a particular date.",
          "Size is often an estimate, and new observations can refine an object's orbit. For a specific risk assessment, consult NASA JPL's CNEOS information and the original object record linked from the Astroboat tool."
        ]
      },
      {
        id: "reading-the-data",
        heading: "How to read Astroboat's asteroid list",
        paragraphs: [
          "Start with the approach date and distance. Then check the estimated diameter range and speed, which describe the object but do not by themselves establish an impact risk. Use the source link on each entry to inspect the underlying NASA record.",
          "Astroboat's watch labels are interface cues for browsing a short list. They are not formal NASA impact probabilities. The list covers a limited future window and is not a complete catalogue of every NEO."
        ]
      }
    ],
    sources: [
      { label: "NASA Science: Asteroid Facts", url: "https://science.nasa.gov/solar-system/asteroids/facts/" },
      { label: "NASA JPL CNEOS: Close Approaches", url: "https://cneos.jpl.nasa.gov/ca/" },
      { label: "NASA JPL CNEOS: Close-Approach Data Notes", url: "https://cneos.jpl.nasa.gov/ca/neo_ca_info.html" }
    ],
    relatedPaths: [
      { label: "See upcoming near-Earth object approaches", href: "/asteroids" },
      { label: "Review Astroboat's data sources", href: "/data-sources" }
    ],
    status: "published"
  }
];

export const publishedGuides = guides.filter((guide) => guide.status === "published");

export function getPublishedGuide(slug: string) {
  return publishedGuides.find((guide) => guide.slug === slug);
}
