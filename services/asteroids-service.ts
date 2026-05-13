import {
  ASTEROIDS_REVALIDATE_SECONDS,
  AU_TO_KM,
  DEFAULT_ASTEROIDS_LIMIT,
  JPL_CAD_API_URL,
  LUNAR_DISTANCE_KM,
  NASA_NEOWS_API_BASE
} from "@/lib/constants";
import { nearEarthObjects as mockNearEarthObjects } from "@/lib/mock-data";
import type { NearEarthObject, NeoRiskLevel } from "@/lib/types";
import {
  formatDateTime,
  formatKilometers,
  formatLunarDistance,
  formatNumber
} from "@/lib/utils";
import type { JplCadResponse } from "@/services/jpl-cad-types";
import type { NeoWsFeedResponse, NeoWsObject } from "@/services/neows-types";

export async function getNearEarthObjects(): Promise<NearEarthObject[]> {
  const jplObjects = await getJplCloseApproaches();

  if (jplObjects.length > 0) {
    return jplObjects;
  }

  const neowsObjects = await getNeoWsFeed();

  if (neowsObjects.length > 0) {
    return neowsObjects;
  }

  console.warn("Asteroid APIs unavailable. Falling back to Astroboat mock NEO data.");
  return getMockAsteroids();
}

export async function getJplCloseApproaches(): Promise<NearEarthObject[]> {
  const url = buildJplCadUrl();

  try {
    const response = await fetch(url, {
      next: { revalidate: ASTEROIDS_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      console.warn("JPL CAD request failed.");
      return [];
    }

    const payload = (await response.json()) as JplCadResponse;
    const fields = Array.isArray(payload.fields) ? payload.fields : [];

    return (payload.data ?? [])
      .map((row) => mapJplCadRowToNearEarthObject(row, fields))
      .filter((neo): neo is NearEarthObject => Boolean(neo));
  } catch {
    console.warn("JPL CAD request errored.");
    return [];
  }
}

export async function getNeoWsFeed(): Promise<NearEarthObject[]> {
  const apiKey = process.env.NASA_API_KEY;

  if (!apiKey) {
    return [];
  }

  const today = new Date();
  const end = addDays(today, 7);
  const url = new URL(`${NASA_NEOWS_API_BASE}/feed`);
  url.searchParams.set("start_date", formatDateOnly(today));
  url.searchParams.set("end_date", formatDateOnly(end));
  url.searchParams.set("api_key", apiKey);

  try {
    const response = await fetch(url, {
      next: { revalidate: ASTEROIDS_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      console.warn("NASA NeoWs request failed.");
      return [];
    }

    const payload = (await response.json()) as NeoWsFeedResponse;
    const objects = Object.values(payload.near_earth_objects ?? {}).flat();

    return objects
      .map(mapNeoWsObjectToNearEarthObject)
      .filter((neo): neo is NearEarthObject => Boolean(neo));
  } catch {
    console.warn("NASA NeoWs request errored.");
    return [];
  }
}

export async function getNearEarthObjectById(id: string): Promise<NearEarthObject | null> {
  const objects = await getNearEarthObjects();

  return objects.find((object) => object.id === id || object.externalId === id) ?? null;
}

export function getFieldIndex(fields: string[], fieldName: string) {
  return fields.findIndex((field) => field === fieldName);
}

export function mapJplCadRowToNearEarthObject(row: string[], fields: string[]): NearEarthObject | null {
  const designation = getValue(row, fields, "des");
  const fullname = getValue(row, fields, "fullname");
  const closeDateRaw = getValue(row, fields, "cd");
  const distanceAu = parseNumber(getValue(row, fields, "dist"));
  const speedKps = parseNumber(getValue(row, fields, "v_rel"));
  const h = parseNumber(getValue(row, fields, "h"));

  if (!designation || !closeDateRaw || !Number.isFinite(distanceAu) || !Number.isFinite(speedKps)) {
    return null;
  }

  const closeApproachDateUtc = parseJplCloseApproachDate(closeDateRaw);

  if (!closeApproachDateUtc) {
    return null;
  }

  const distanceKm = distanceAu * AU_TO_KM;
  const distanceLunar = distanceKm / LUNAR_DISTANCE_KM;
  const speedKph = speedKps * 3600;
  const diameter = Number.isFinite(h) ? estimateDiameterFromH(h) : undefined;
  const base = {
    distanceLunar,
    isPotentiallyHazardous: false
  };
  const riskLevel = getNeoRiskLevel(base);

  return finalizeNeo({
    id: `jpl-${slugify(designation)}`,
    externalId: designation,
    name: fullname || designation,
    designation,
    closeApproachDate: closeApproachDateUtc.slice(0, 10),
    closeApproachDateDisplay: formatDateTime(closeApproachDateUtc),
    closeApproachDateUtc,
    distanceKm,
    distanceAu,
    distanceLunar,
    speedKps,
    speedKph,
    estimatedDiameterMinMeters: diameter?.minMeters,
    estimatedDiameterMaxMeters: diameter?.maxMeters,
    estimatedDiameterDisplay: diameter
      ? `Estimated ${formatNumber(diameter.minMeters, 0)}-${formatNumber(diameter.maxMeters, 0)} m`
      : "Size estimate unavailable",
    isPotentiallyHazardous: false,
    riskLevel,
    source: "JPL SBDB",
    sourceUrl: `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(designation)}`,
    orbitingBody: "Earth"
  });
}

function mapNeoWsObjectToNearEarthObject(object: NeoWsObject): NearEarthObject | null {
  const approach = object.close_approach_data?.[0];
  const distanceKm = parseNumber(approach?.miss_distance?.kilometers);
  const distanceAu = parseNumber(approach?.miss_distance?.astronomical);
  const distanceLunar = parseNumber(approach?.miss_distance?.lunar);
  const speedKps = parseNumber(approach?.relative_velocity?.kilometers_per_second);
  const speedKph = parseNumber(approach?.relative_velocity?.kilometers_per_hour);
  const closeApproachDateUtc = parseNeoWsDate(approach?.close_approach_date_full, approach?.close_approach_date);

  if (!object.id || !object.name || !closeApproachDateUtc || !Number.isFinite(distanceKm) || !Number.isFinite(speedKps)) {
    return null;
  }

  const minMeters = object.estimated_diameter?.meters?.estimated_diameter_min;
  const maxMeters = object.estimated_diameter?.meters?.estimated_diameter_max;
  const riskLevel = getNeoRiskLevel({
    distanceLunar,
    isPotentiallyHazardous: object.is_potentially_hazardous_asteroid
  });

  return finalizeNeo({
    id: `neows-${object.id}`,
    externalId: object.id,
    name: object.name,
    designation: object.id,
    closeApproachDate: closeApproachDateUtc.slice(0, 10),
    closeApproachDateDisplay: formatDateTime(closeApproachDateUtc),
    closeApproachDateUtc,
    distanceKm,
    distanceAu: Number.isFinite(distanceAu) ? distanceAu : undefined,
    distanceLunar: Number.isFinite(distanceLunar) ? distanceLunar : distanceKm / LUNAR_DISTANCE_KM,
    speedKps,
    speedKph: Number.isFinite(speedKph) ? speedKph : speedKps * 3600,
    estimatedDiameterMinMeters: minMeters,
    estimatedDiameterMaxMeters: maxMeters,
    estimatedDiameterDisplay:
      typeof minMeters === "number" && typeof maxMeters === "number"
        ? `Estimated ${formatNumber(minMeters, 0)}-${formatNumber(maxMeters, 0)} m`
        : "Size estimate unavailable",
    isPotentiallyHazardous: object.is_potentially_hazardous_asteroid,
    riskLevel,
    source: "NASA NeoWs",
    sourceUrl: object.nasa_jpl_url,
    orbitingBody: approach?.orbiting_body ?? "Earth"
  });
}

export function estimateDiameterFromH(h: number) {
  const minMeters = diameterFromMagnitude(h, 0.25);
  const maxMeters = diameterFromMagnitude(h, 0.05);

  return {
    minMeters,
    maxMeters
  };
}

export function getNeoRiskLevel(object: {
  distanceLunar?: number;
  isPotentiallyHazardous?: boolean;
}): NeoRiskLevel {
  if (object.isPotentiallyHazardous) {
    return "watch";
  }

  if (typeof object.distanceLunar === "number" && Number.isFinite(object.distanceLunar)) {
    return object.distanceLunar <= 5 ? "notable" : "safe";
  }

  return "unknown";
}

export function createRiskExplanation(neo: Pick<NearEarthObject, "riskLevel">) {
  switch (neo.riskLevel) {
    case "safe":
      return "This object is passing at a large distance from Earth. It is useful for tracking and research, but it is not an impact concern.";
    case "watch":
      return "This object is officially classified for monitoring based on size and orbit, but that does not mean it will impact Earth.";
    case "notable":
      return "This is a relatively close astronomical pass, so it is interesting for observation and tracking, but current data does not indicate an impact.";
    default:
      return "Some risk classification data is unavailable, so this object is shown for educational tracking only.";
  }
}

export function createSizeComparison(minMeters?: number, maxMeters?: number) {
  const size = typeof maxMeters === "number" ? maxMeters : minMeters;

  if (!size || !Number.isFinite(size)) {
    return "Size estimate unavailable";
  }

  if (size < 5) return "roughly small-car sized or smaller";
  if (size < 15) return "roughly house-sized";
  if (size < 50) return "roughly building-sized";
  if (size < 150) return "roughly stadium-scale";
  return "very large asteroid-scale object";
}

export function createDistanceComparison(distanceKm: number, distanceLunar?: number) {
  if (typeof distanceLunar === "number" && Number.isFinite(distanceLunar)) {
    return `About ${formatLunarDistance(distanceLunar)} from Earth (${formatKilometers(distanceKm)})`;
  }

  return `${formatKilometers(distanceKm)} from Earth`;
}

export function createNeoWhyItMatters(neo: Pick<NearEarthObject, "riskLevel">) {
  if (neo.riskLevel === "notable") {
    return "Close approaches like this help refine orbital models for small near-Earth objects.";
  }

  if (neo.riskLevel === "watch") {
    return "Monitoring larger or orbitally notable objects improves long-term orbit knowledge and survey completeness.";
  }

  return "Close-approach tracking helps astronomers refine asteroid orbits and improve planetary-defense knowledge.";
}

function finalizeNeo(
  neo: Omit<NearEarthObject, "riskExplanation" | "sizeComparison" | "distanceComparison" | "whyItMatters">
): NearEarthObject {
  const completeNeo = {
    ...neo,
    riskExplanation: "",
    sizeComparison: "",
    distanceComparison: "",
    whyItMatters: ""
  };

  return {
    ...completeNeo,
    riskExplanation: createRiskExplanation(completeNeo),
    sizeComparison: createSizeComparison(completeNeo.estimatedDiameterMinMeters, completeNeo.estimatedDiameterMaxMeters),
    distanceComparison: createDistanceComparison(completeNeo.distanceKm, completeNeo.distanceLunar),
    whyItMatters: createNeoWhyItMatters(completeNeo)
  };
}

function buildJplCadUrl() {
  const today = new Date();
  const dateMax = addDays(today, 30);
  const url = new URL(JPL_CAD_API_URL);

  url.searchParams.set("date-min", formatDateOnly(today));
  url.searchParams.set("date-max", formatDateOnly(dateMax));
  url.searchParams.set("dist-max", "0.2");
  url.searchParams.set("body", "Earth");
  url.searchParams.set("sort", "date");
  url.searchParams.set("limit", String(DEFAULT_ASTEROIDS_LIMIT));

  return url;
}

function getMockAsteroids() {
  return mockNearEarthObjects.map((object) => ({
    ...object,
    source: "Mock" as const,
    isFallback: true
  }));
}

function getValue(row: string[], fields: string[], fieldName: string) {
  const index = getFieldIndex(fields, fieldName);

  return index >= 0 ? row[index] : undefined;
}

function parseJplCloseApproachDate(value: string) {
  const normalized = value.replace(/^(\d{4})-([A-Za-z]{3})-(\d{2})/, (_, year: string, month: string, day: string) => {
    return `${year}-${monthToNumber(month)}-${day}`;
  });
  const date = new Date(`${normalized.replace(" ", "T")}:00Z`);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function parseNeoWsDate(fullDate?: string, dateOnly?: string) {
  const value = fullDate ? `${fullDate.replace(" ", "T")}:00Z` : dateOnly ? `${dateOnly}T00:00:00Z` : "";
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function diameterFromMagnitude(h: number, albedo: number) {
  const diameterKm = (1329 / Math.sqrt(albedo)) * 10 ** (-h / 5);

  return Math.max(0.1, diameterKm * 1000);
}

function parseNumber(value: string | number | undefined) {
  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthToNumber(month: string) {
  const monthIndex = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(
    month.toLowerCase()
  );

  return String(monthIndex + 1).padStart(2, "0");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
