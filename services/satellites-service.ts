import {
  DEFAULT_MIN_VISIBILITY_SECONDS,
  DEFAULT_PASS_DAYS,
  DEFAULT_SATELLITE_LOCATION,
  ISS_NORAD_ID,
  N2YO_API_BASE,
  OPEN_NOTIFY_ISS_URL,
  SATELLITE_PASSES_REVALIDATE_SECONDS,
  SATELLITES_REVALIDATE_SECONDS
} from "@/lib/constants";
import { mockCurrentSatelliteStatus, satellitePasses as mockSatellitePasses } from "@/lib/mock-data";
import type { SatelliteFinderData, SatellitePass, SatelliteSource, SatelliteStatus } from "@/lib/types";
import {
  formatCoordinate,
  formatDateTime,
  formatDuration,
  formatUnixTimestamp
} from "@/lib/utils";
import type { N2yoVisualPass, N2yoVisualPassResponse } from "@/services/n2yo-types";
import type { OpenNotifyIssResponse } from "@/services/open-notify-types";

type SatelliteFinderParams = {
  noradId?: number;
  satelliteName?: string;
  latitude?: number;
  longitude?: number;
  altitudeMeters?: number;
  locationName?: string;
};

type VisiblePassParams = SatelliteFinderParams & {
  days?: number;
  minVisibilitySeconds?: number;
};

export async function getSatelliteFinderData(params: SatelliteFinderParams = {}): Promise<SatelliteFinderData> {
  const location = resolveLocation(params);
  const currentSatellite = await getIssCurrentLocation();
  const passes = await getVisiblePasses({
    noradId: params.noradId,
    satelliteName: params.satelliteName,
    latitude: location.latitude,
    longitude: location.longitude,
    altitudeMeters: location.altitudeMeters,
    locationName: location.name
  });
  const passFallback = passes.some((pass) => pass.isFallback);

  return {
    currentSatellite,
    passes,
    location,
    sourceNote:
      "ISS live position is sourced from Open Notify. Visible pass predictions use N2YO when an API key is configured; otherwise Astroboat shows sample pass data.",
    isFallback: Boolean(currentSatellite.isFallback || passFallback)
  };
}

export async function getIssCurrentLocation(): Promise<SatelliteStatus> {
  try {
    const response = await fetch(OPEN_NOTIFY_ISS_URL, {
      next: { revalidate: SATELLITES_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      console.warn("Open Notify ISS request failed.");
      return getMockCurrentSatelliteStatus();
    }

    const payload = (await response.json()) as OpenNotifyIssResponse;
    const latitude = parseNumber(payload.iss_position?.latitude);
    const longitude = parseNumber(payload.iss_position?.longitude);
    const timestamp = parseNumber(payload.timestamp);

    if (!isValidLatitude(latitude) || !isValidLongitude(longitude) || !Number.isFinite(timestamp)) {
      console.warn("Open Notify ISS response was missing usable coordinates.");
      return getMockCurrentSatelliteStatus();
    }

    return {
      id: "iss-current",
      noradId: ISS_NORAD_ID,
      name: "International Space Station",
      type: "ISS",
      latitude,
      longitude,
      timestamp,
      timestampDisplay: formatUnixTimestamp(timestamp),
      source: "Open Notify"
    };
  } catch {
    console.warn("Open Notify ISS request errored.");
    return getMockCurrentSatelliteStatus();
  }
}

export async function getVisiblePasses(params: VisiblePassParams = {}): Promise<SatellitePass[]> {
  const apiKey = process.env.N2YO_API_KEY;
  const location = resolveLocation(params);
  const noradId = params.noradId ?? ISS_NORAD_ID;
  const satelliteName = params.satelliteName ?? "International Space Station";
  const days = params.days ?? DEFAULT_PASS_DAYS;
  const minVisibilitySeconds = params.minVisibilitySeconds ?? DEFAULT_MIN_VISIBILITY_SECONDS;

  if (!apiKey) {
    return getMockSatellitePasses(location.name, satelliteName, noradId);
  }

  const url = new URL(
    `${N2YO_API_BASE}/visualpasses/${noradId}/${location.latitude}/${location.longitude}/${location.altitudeMeters}/${days}/${minVisibilitySeconds}`
  );
  url.searchParams.set("apiKey", apiKey);

  try {
    const response = await fetch(url, {
      next: { revalidate: SATELLITE_PASSES_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      console.warn("N2YO visible passes request failed.");
      return getMockSatellitePasses(location.name, satelliteName, noradId);
    }

    const payload = (await response.json()) as N2yoVisualPassResponse;

    if (payload.error || !Array.isArray(payload.passes)) {
      console.warn("N2YO visible passes response did not include pass data.");
      return getMockSatellitePasses(location.name, satelliteName, noradId);
    }

    const apiSatelliteName = payload.info?.satname ?? satelliteName;
    const apiNoradId = payload.info?.satid ?? noradId;
    const passes = payload.passes
      .map((pass, index) => mapN2yoPassToSatellitePass(pass, index, apiSatelliteName, apiNoradId, location.name))
      .filter((pass): pass is SatellitePass => Boolean(pass));

    return passes.length > 0 ? passes : getMockSatellitePasses(location.name, satelliteName, noradId);
  } catch {
    console.warn("N2YO visible passes request errored.");
    return getMockSatellitePasses(location.name, satelliteName, noradId);
  }
}

export async function getSatellitePasses(limit?: number): Promise<SatellitePass[]> {
  const passes = await getVisiblePasses();

  return typeof limit === "number" ? passes.slice(0, limit) : passes;
}

export function getMockSatellitePasses(
  locationName = DEFAULT_SATELLITE_LOCATION.name,
  satelliteName = "International Space Station",
  noradId = ISS_NORAD_ID
): SatellitePass[] {
  return mockSatellitePasses.map((pass) => ({
    ...pass,
    satelliteName,
    noradId,
    locationName,
    visibilityQuality: "sample",
    source: "Mock" as SatelliteSource,
    isFallback: true,
    viewingAdvice: createSatelliteViewingAdvice({ visibilityQuality: "sample" })
  }));
}

export function degreesToCompass(degrees: number) {
  if (!Number.isFinite(degrees)) {
    return "Unknown";
  }

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % directions.length;

  return directions[index];
}

export function getPassVisibilityQuality(pass: {
  maxElevationDegrees?: number;
  durationSeconds?: number;
  source?: SatelliteSource;
}): SatellitePass["visibilityQuality"] {
  if (pass.source === "Mock") {
    return "sample";
  }

  const maxElevation = pass.maxElevationDegrees;
  const duration = pass.durationSeconds;

  if (typeof maxElevation !== "number" || !Number.isFinite(maxElevation) || typeof duration !== "number" || !Number.isFinite(duration)) {
    return "unknown";
  }

  if (maxElevation >= 60 && duration >= 240) return "excellent";
  if (maxElevation >= 35 && duration >= 180) return "good";
  if (maxElevation >= 15) return "fair";

  return "unknown";
}

export function createSatelliteViewingAdvice(pass: {
  visibilityQuality: SatellitePass["visibilityQuality"];
}) {
  switch (pass.visibilityQuality) {
    case "excellent":
      return "This is a strong viewing opportunity. Look toward the starting direction a few minutes before the pass begins.";
    case "good":
      return "This pass should be visible if the sky is clear and the horizon is open.";
    case "fair":
      return "This may be harder to spot. Try watching from a darker area with a clear horizon.";
    case "sample":
      return "This is sample pass data. Add an N2YO API key to enable live visible pass predictions.";
    default:
      return "Visibility depends on local sky conditions, brightness, and horizon clarity.";
  }
}

function mapN2yoPassToSatellitePass(
  pass: N2yoVisualPass,
  index: number,
  satelliteName: string,
  noradId: number,
  locationName: string
): SatellitePass | null {
  const startUtc = unixToIso(pass.startUTC);
  const maxUtc = unixToIso(pass.maxUTC);
  const endUtc = unixToIso(pass.endUTC);
  const durationSeconds = parseNumber(pass.duration);
  const maxElevationDegrees = parseOptionalNumber(pass.maxEl);
  const startAzimuthDegrees = parseOptionalNumber(pass.startAz);
  const endAzimuthDegrees = parseOptionalNumber(pass.endAz);
  const magnitude = parseOptionalNumber(pass.mag);

  if (!startUtc || !Number.isFinite(durationSeconds)) {
    return null;
  }

  const basePass = {
    maxElevationDegrees,
    durationSeconds,
    source: "N2YO" as SatelliteSource
  };
  const visibilityQuality = getPassVisibilityQuality(basePass);

  return {
    id: `n2yo-${noradId}-${pass.startUTC ?? index}`,
    satelliteName,
    noradId,
    locationName,
    startTimeUtc: startUtc,
    startTimeDisplay: formatDateTime(startUtc),
    maxTimeUtc: maxUtc,
    maxTimeDisplay: maxUtc ? formatDateTime(maxUtc) : undefined,
    endTimeUtc: endUtc,
    endTimeDisplay: endUtc ? formatDateTime(endUtc) : undefined,
    durationSeconds,
    durationDisplay: formatDuration(durationSeconds),
    maxElevationDegrees,
    startAzimuthDegrees,
    startAzimuthCompass: pass.startAzCompass ?? compassFromOptionalDegrees(startAzimuthDegrees),
    endAzimuthDegrees,
    endAzimuthCompass: pass.endAzCompass ?? compassFromOptionalDegrees(endAzimuthDegrees),
    magnitude,
    visibilityQuality,
    viewingAdvice: createSatelliteViewingAdvice({ visibilityQuality }),
    source: "N2YO"
  };
}

function getMockCurrentSatelliteStatus(): SatelliteStatus {
  return {
    ...mockCurrentSatelliteStatus,
    timestampDisplay: mockCurrentSatelliteStatus.timestampDisplay || formatUnixTimestamp(mockCurrentSatelliteStatus.timestamp),
    source: "Mock",
    isFallback: true
  };
}

function resolveLocation(params: SatelliteFinderParams) {
  return {
    name: params.locationName ?? DEFAULT_SATELLITE_LOCATION.name,
    latitude: validNumberOr(params.latitude, DEFAULT_SATELLITE_LOCATION.latitude),
    longitude: validNumberOr(params.longitude, DEFAULT_SATELLITE_LOCATION.longitude),
    altitudeMeters: validNumberOr(params.altitudeMeters, DEFAULT_SATELLITE_LOCATION.altitudeMeters)
  };
}

function unixToIso(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  const date = new Date(value * 1000);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function parseNumber(value: string | number | undefined) {
  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseOptionalNumber(value: string | number | undefined) {
  const parsed = parseNumber(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function validNumberOr(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isValidLatitude(value: number) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: number) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

function compassFromOptionalDegrees(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? degreesToCompass(value) : undefined;
}

export function formatSatelliteCoordinateSummary(status: Pick<SatelliteStatus, "latitude" | "longitude">) {
  return `${formatCoordinate(status.latitude, "latitude")} / ${formatCoordinate(status.longitude, "longitude")}`;
}
