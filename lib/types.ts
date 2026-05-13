export type SourceInfo = {
  id: string;
  name: "NASA" | "ESA" | "JPL" | "USNO" | "Space Devs" | "arXiv" | "ISRO" | "Astroboat" | "APOD";
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
  isFallback?: boolean;
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
