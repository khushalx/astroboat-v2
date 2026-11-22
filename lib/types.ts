export type SourceInfo = {
  id: string;
  name: string;
  kind: "agency" | "archive" | "research" | "platform" | "internal";
  credibility: "Primary" | "Reviewed" | "Preprint" | "Editorial";
};

export type SpaceEventCategory =
  | "launch"
  | "space_event"
  | "eva"
  | "docking"
  | "landing"
  | "crew"
  | "conference"
  | "sky_event"
  | "other";

export type SpaceEventStatus =
  | "scheduled"
  | "confirmed"
  | "to_be_confirmed"
  | "to_be_determined"
  | "live"
  | "completed"
  | "delayed"
  | "failed"
  | "unknown";

export type VisibilityRegion = "Worldwide" | "Region-specific" | "Online" | "India" | "Southern Hemisphere" | "Northern Hemisphere";

export type AstronomyBrief = {
  id: string;
  slug: string;
  legacySlug?: string;
  source: SourceInfo;
  originalUrl: string;
  title: string;
  summary: string[];
  why: string;
  tags: string[];
  readingTime: string;
  publishedAt: string;
  category?: string;
  difficulty?: "Beginner" | "Intermediate" | "Research";
  imageUrl?: string;
  beginnerExplanation?: string;
  // Machine summaries are source digests; only reviewed, original analysis can be indexed.
  quality?: "source_digest" | "original_analysis";
  takeaway?: string;
  context?: string;
  whatNext?: string;
  importantNumbers?: string[];
  updatedAt?: string;
  author?: string;
  isFallback?: boolean;
  /** Feed that supplied this brief (e.g. "nasa-science"); stable across runs. */
  sourceFeedId?: string;
  /** Composite ranking for the lead story; 0 means not eligible to be featured. */
  featureScore?: number;
  /** Explainable editorial relevance score (0-100). */
  editorialScore?: number;
  /** True when restored from the last verified snapshot because its source is temporarily down. */
  isStale?: boolean;
};

export type BriefSourceStatus = {
  id: string;
  name: string;
  enabled: boolean;
  count: number;
  ok: boolean;
  error?: string;
  /** Items restored from the last-known-good snapshot while this source is failing. */
  staleCount?: number;
};

export type BriefsResult = {
  briefs: AstronomyBrief[];
  sourceStatuses: BriefSourceStatus[];
  lastChecked: string;
  latestItemDate?: string;
  isFallback: boolean;
  warnings: string[];
  /** True when every live source failed and the list is the last verified snapshot. */
  isStale?: boolean;
  staleSavedAt?: string;
  featuredId?: string;
};

export type SpaceEvent = {
  id: string;
  externalId?: string;
  slug: string;
  title: string;
  description: string;
  category: SpaceEventCategory;
  status: SpaceEventStatus;
  dateUtc: string;
  dateDisplay: string;
  location: string;
  agency?: string;
  provider?: string;
  mission?: string;
  rocket?: string;
  imageUrl?: string;
  sourceUrl?: string;
  webcastUrl?: string;
  visibility: VisibilityRegion;
  source: "The Space Devs" | "Mock";
  importance: "high" | "medium" | "low";
  whyItMatters: string;
};

export type LunarCyclePhase = {
  phase: string;
  illumination: number;
};

export type MoonPhaseName =
  | "New Moon"
  | "Waxing Crescent"
  | "First Quarter"
  | "Waxing Gibbous"
  | "Full Moon"
  | "Waning Gibbous"
  | "Last Quarter"
  | "Waning Crescent"
  | "Unknown";

export type PrimaryMoonPhase = "New Moon" | "First Quarter" | "Full Moon" | "Last Quarter";

export type MoonEvent = {
  phase: PrimaryMoonPhase;
  dateUtc: string;
  dateDisplay: string;
  timeUtc?: string;
};

export type MoonData = {
  date: string;
  locationName: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  phaseName: MoonPhaseName;
  illuminationPercent: number;
  moonrise?: string;
  moonset?: string;
  transit?: string;
  closestPrimaryPhase?: MoonEvent;
  nextNewMoon?: MoonEvent;
  nextFullMoon?: MoonEvent;
  upcomingPhases: MoonEvent[];
  photographyScore: number;
  viewingAdvice: string;
  beginnerExplanation: string;
  source: "USNO" | "Mock";
  isFallback?: boolean;
};

export type NeoRiskLevel = "safe" | "watch" | "notable" | "unknown";

export type NeoSource = "JPL SBDB" | "NASA NeoWs" | "Mock";

export type NearEarthObject = {
  id: string;
  externalId?: string;
  name: string;
  designation?: string;
  closeApproachDate: string;
  closeApproachDateDisplay: string;
  closeApproachDateUtc?: string;
  distanceKm: number;
  distanceAu?: number;
  distanceLunar?: number;
  speedKps: number;
  speedKph?: number;
  estimatedDiameterMinMeters?: number;
  estimatedDiameterMaxMeters?: number;
  estimatedDiameterDisplay: string;
  isPotentiallyHazardous?: boolean;
  riskLevel: NeoRiskLevel;
  riskExplanation: string;
  sizeComparison: string;
  distanceComparison: string;
  source: NeoSource;
  sourceUrl?: string;
  orbitingBody?: string;
  whyItMatters: string;
  isFallback?: boolean;
};

export type SatelliteSource = "Open Notify" | "N2YO" | "Mock";

export type SatelliteType = "ISS" | "Starlink" | "Weather Satellite" | "Other";

export type SatelliteStatus = {
  id: string;
  noradId: number;
  name: string;
  type: SatelliteType;
  latitude: number;
  longitude: number;
  timestamp: number;
  timestampDisplay: string;
  altitudeKm?: number;
  velocityKph?: number;
  source: SatelliteSource;
  isFallback?: boolean;
};

export type SatellitePass = {
  id: string;
  satelliteName: string;
  noradId: number;
  locationName: string;
  startTimeUtc: string;
  startTimeDisplay: string;
  maxTimeUtc?: string;
  maxTimeDisplay?: string;
  endTimeUtc?: string;
  endTimeDisplay?: string;
  durationSeconds: number;
  durationDisplay: string;
  maxElevationDegrees?: number;
  startAzimuthDegrees?: number;
  startAzimuthCompass?: string;
  endAzimuthDegrees?: number;
  endAzimuthCompass?: string;
  magnitude?: number;
  visibilityQuality: "excellent" | "good" | "fair" | "sample" | "unknown";
  viewingAdvice: string;
  source: SatelliteSource;
  isFallback?: boolean;
};

export type SatelliteFinderData = {
  currentSatellite: SatelliteStatus;
  passes: SatellitePass[];
  location: {
    name: string;
    latitude: number;
    longitude: number;
    altitudeMeters: number;
  };
  sourceNote: string;
  isFallback?: boolean;
};

export type LearningPath = {
  id: string;
  title: string;
  difficulty: "Beginner" | "Starter" | "Intermediate" | "All levels";
  time: string;
  progress: number;
  visual: "horizon" | "moon" | "orbit" | "satellite" | "transit" | "mission";
  description: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  category: "Sky Watching" | "Moon" | "Asteroids" | "Satellites" | "Missions" | "Cosmology" | "Basics";
  tag: string;
  readTime: string;
  description: string;
  featured?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
};

export type ToolCard = {
  title: string;
  href: string;
  description: string;
  status: "Ready" | "Mock data" | "Prototype" | "Coming Next";
};

export type GalleryCategory =
  | "All"
  | "Galaxies"
  | "Nebulae"
  | "Deep Space"
  | "Planets"
  | "Moon"
  | "Sun"
  | "Earth"
  | "Stars"
  | "Missions";

/** Hosting archive an image was retrieved from. */
export type GallerySource =
  | "NASA APOD"
  | "NASA Image Library"
  | "ESA / Webb"
  | "ESA / Hubble"
  | "ESO";

export type GalleryImage = {
  id: string;
  title: string;
  description: string;
  /** Alternative text supplied by the publisher, when available. */
  alt?: string;
  /** Display rendition shown in the viewer. */
  imageUrl: string;
  /** Smaller rendition for grid cards. */
  thumbnailUrl: string;
  /** Direct high-resolution image file. Only set after the URL was confirmed to serve an image. */
  hdImageUrl?: string;
  /** Hosting archive the image was retrieved from (not necessarily the original publisher). */
  source: GallerySource;
  /** Official detail page for the image at its hosting archive. */
  sourceUrl: string;
  /** Official credit line exactly as supplied by the source. */
  credit: string;
  /** Organization that originally published the image, when the metadata states it. */
  publisher?: string;
  /** Photographer or creator, when the metadata names one. */
  creator?: string;
  /** Copyright or usage notice supplied by the source. */
  rights?: string;
  /** Page describing the usage terms, or a license URL supplied by the source. */
  rightsUrl?: string;
  date: string;
  category: GalleryCategory;
  objectName?: string;
  observatory?: string;
  distance?: string;
  aspectRatio?: number;
  featured?: boolean;
  isFallback?: boolean;
  /** Restored from the last verified snapshot because its source is temporarily unavailable. */
  isStale?: boolean;
};

export type GalleryResult = {
  images: GalleryImage[];
  featuredImage: GalleryImage | null;
  categories: string[];
  total: number;
  lastUpdated: string;
  isFallback: boolean;
  warnings: string[];
};
