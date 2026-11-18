import { DEFAULT_MOON_LOCATION, MOON_REVALIDATE_SECONDS, USNO_API_BASE } from "@/lib/constants";
import type { MoonData, MoonEvent, MoonPhaseName, PrimaryMoonPhase } from "@/lib/types";
import type { UsnoMoonPhenomenon, UsnoOneDayResponse, UsnoPhaseItem, UsnoMoonPhasesResponse } from "@/services/usno-types";

type MoonDataParams = {
  date?: string;
  latitude?: number;
  longitude?: number;
  timezoneOffset?: number;
  locationName?: string;
};

type MoonPhenomena = {
  moonrise?: string;
  moonset?: string;
  transit?: string;
};

export async function getCurrentMoonData(params?: MoonDataParams): Promise<MoonData> {
  return getMoonDataForLocation(params);
}

export async function getMoonDataForLocation(params: MoonDataParams = {}): Promise<MoonData> {
  const latitude = params.latitude ?? DEFAULT_MOON_LOCATION.latitude;
  const longitude = params.longitude ?? DEFAULT_MOON_LOCATION.longitude;
  const timezoneOffset = params.timezoneOffset ?? DEFAULT_MOON_LOCATION.timezoneOffset;
  const locationName = params.locationName ?? DEFAULT_MOON_LOCATION.name;
  const date = params.date ?? formatDateForUsno(new Date(), timezoneOffset);

  const [oneDayResult, phasesResult] = await Promise.all([
    fetchUsnoOneDayData({ date, latitude, longitude, timezoneOffset }),
    getUpcomingMoonPhases(date)
  ]);

  if (!oneDayResult?.properties?.data) {
    console.warn("USNO Moon one-day data unavailable.");
    return createUnavailableMoonData({ date, latitude, longitude, timezoneOffset, locationName }, phasesResult);
  }

  const data = oneDayResult.properties?.data;
  const phaseName = normalizeMoonPhaseName(data?.curphase);
  const illuminationPercent = parseIllumination(data?.fracillum, Number.NaN);
  if (phaseName === "Unknown" || !Number.isFinite(illuminationPercent)) {
    return createUnavailableMoonData({ date, latitude, longitude, timezoneOffset, locationName }, phasesResult);
  }
  const moonPhenomena = parseMoonPhenomena(data?.moondata);
  const boundary = params.date ? Date.parse(`${date}T00:00:00Z`) : Date.now();
  const upcomingPhases = phasesResult.filter((phase) => Date.parse(phase.dateUtc) >= boundary);
  const closestPrimaryPhase = data?.closestphase ? mapUsnoPhaseToMoonEvent(data.closestphase) : undefined;

  return {
    date,
    locationName,
    latitude,
    longitude,
    timezoneOffset,
    phaseName,
    illuminationPercent,
    moonrise: moonPhenomena.moonrise,
    moonset: moonPhenomena.moonset,
    transit: moonPhenomena.transit,
    closestPrimaryPhase,
    nextNewMoon: upcomingPhases.find((event) => event.phase === "New Moon"),
    nextFullMoon: upcomingPhases.find((event) => event.phase === "Full Moon"),
    upcomingPhases,
    photographyScore: calculateMoonPhotographyScore(phaseName, illuminationPercent),
    viewingAdvice: createMoonViewingAdvice(phaseName, illuminationPercent),
    beginnerExplanation: createMoonBeginnerExplanation(phaseName, illuminationPercent),
    source: "USNO"
  };
}

export async function getUpcomingMoonPhases(date = formatDateForUsno(new Date())): Promise<MoonEvent[]> {
  const url = buildUsnoUrl("/moon/phases/date", {
    date,
    nump: "8"
  });

  try {
    const response = await fetch(url, {
      next: { revalidate: MOON_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      console.warn("USNO Moon phases request failed. No lunar milestones available.");
      return [];
    }

    const payload = (await response.json()) as UsnoMoonPhasesResponse;

    return (payload.phasedata ?? [])
      .map(mapUsnoPhaseToMoonEvent)
      .filter((event): event is MoonEvent => Boolean(event));
  } catch {
    console.warn("USNO Moon phases request errored. No lunar milestones available.");
    return [];
  }
}

async function fetchUsnoOneDayData(params: {
  date: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
}) {
  const url = buildUsnoUrl("/rstt/oneday", {
    date: params.date,
    coords: `${params.latitude},${params.longitude}`,
    tz: String(params.timezoneOffset)
  });

  try {
    const response = await fetch(url, {
      next: { revalidate: MOON_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as UsnoOneDayResponse;
  } catch {
    return undefined;
  }
}

function buildUsnoUrl(path: string, params: Record<string, string>) {
  const url = new URL(`${USNO_API_BASE}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url;
}

export function parseMoonPhenomena(moondata: UsnoMoonPhenomenon[] | null | undefined): MoonPhenomena {
  const result: MoonPhenomena = {};

  moondata?.forEach((event) => {
    const phen = event.phen?.toLowerCase() ?? "";
    const time = event.time?.trim();

    if (!time) {
      return;
    }

    if (phen.includes("rise")) {
      result.moonrise = time;
    } else if (phen.includes("set")) {
      result.moonset = time;
    } else if (phen.includes("upper transit")) {
      result.transit = time;
    }
  });

  return result;
}

export function parseIllumination(value: string | number | null | undefined, fallback = 0): number {
  const normalized = typeof value === "string" ? value.trim() : value;
  const explicitPercent = typeof normalized === "string" && normalized.includes("%");
  const parsed = normalized == null || normalized === "" ? Number.NaN : typeof normalized === "number" ? normalized : Number(normalized.replace("%", ""));

  if (!Number.isFinite(parsed)) {
    return clampPercent(fallback);
  }

  return clampPercent(!explicitPercent && parsed <= 1 ? parsed * 100 : parsed);
}

export function normalizeMoonPhaseName(value: string | null | undefined): MoonPhaseName {
  const phase = value?.toLowerCase().trim() ?? "";

  if (phase.includes("new")) return "New Moon";
  if (phase.includes("first")) return "First Quarter";
  if (phase.includes("full")) return "Full Moon";
  if (phase.includes("last") || phase.includes("third")) return "Last Quarter";
  if (phase.includes("waxing") && phase.includes("crescent")) return "Waxing Crescent";
  if (phase.includes("waxing") && phase.includes("gibbous")) return "Waxing Gibbous";
  if (phase.includes("waning") && phase.includes("gibbous")) return "Waning Gibbous";
  if (phase.includes("waning") && phase.includes("crescent")) return "Waning Crescent";

  return "Unknown";
}

export function mapUsnoPhaseToMoonEvent(item: UsnoPhaseItem): MoonEvent | undefined {
  const phase = normalizePrimaryMoonPhase(item.phase);

  if (!phase || !item.year || !item.month || !item.day) {
    return undefined;
  }

  const timeUtc = item.time?.trim();
  const dateUtc = `${item.year}-${pad(item.month)}-${pad(item.day)}T${timeUtc ? `${timeUtc}:00` : "00:00:00"}Z`;
  const dateDisplay = formatDateTimeUtc(dateUtc);

  return {
    phase,
    dateUtc,
    dateDisplay,
    timeUtc: timeUtc || undefined
  };
}

export function createMoonViewingAdvice(phaseName: MoonPhaseName, illuminationPercent: number): string {
  if (phaseName === "New Moon" || illuminationPercent <= 5) {
    return "Moonlight will be minimal, so this is better for dark-sky stargazing than Moon photography.";
  }

  if (phaseName === "Full Moon" || illuminationPercent >= 92) {
    return "The Moon is bright and easy to observe, but surface shadows are softer, so crater contrast may be lower.";
  }

  if (phaseName === "First Quarter" || phaseName === "Last Quarter") {
    return "This is one of the best phases for observing lunar craters because shadows near the terminator create strong contrast.";
  }

  if (phaseName.includes("Crescent")) {
    return "Crescent phases are beginner-friendly because the terminator makes craters and lunar relief easier to see.";
  }

  return "Gibbous phases are bright and detailed, with useful views near the terminator and strong visibility for casual observing.";
}

export function createMoonBeginnerExplanation(phaseName: MoonPhaseName, illuminationPercent: number): string {
  if (phaseName === "Unknown") {
    return `The Moon is about ${illuminationPercent}% illuminated. The exact named phase is unavailable, but illumination still helps plan observing conditions.`;
  }

  return `${phaseName} means about ${illuminationPercent}% of the Moon's near side is illuminated from Earth's perspective. Use the shadow line, called the terminator, to find the strongest surface contrast.`;
}

export function calculateMoonPhotographyScore(phaseName: MoonPhaseName, illuminationPercent: number): number {
  let score = 5;

  if (phaseName === "New Moon" || illuminationPercent <= 5) {
    score = 2;
  } else if (phaseName === "Full Moon" || illuminationPercent >= 92) {
    score = 8;
  } else if (phaseName === "First Quarter" || phaseName === "Last Quarter") {
    score = 9;
  } else if (phaseName.includes("Crescent")) {
    score = 7;
  } else if (phaseName.includes("Gibbous")) {
    score = 8;
  }

  return Math.max(0, Math.min(10, score));
}

function createUnavailableMoonData(params: Required<MoonDataParams>, phases: MoonEvent[]): MoonData {
  const upcomingPhases = phases.filter((phase) => Date.parse(phase.dateUtc) >= Date.now());
  return {
    ...params,
    phaseName: "Unknown",
    illuminationPercent: 0,
    upcomingPhases,
    nextNewMoon: upcomingPhases.find((phase) => phase.phase === "New Moon"),
    nextFullMoon: upcomingPhases.find((phase) => phase.phase === "Full Moon"),
    photographyScore: 0,
    viewingAdvice: "Current lunar conditions could not be retrieved. Check USNO for observing information.",
    beginnerExplanation: "The Moon’s phases reflect how much of its sunlit near side we see from Earth.",
    source: "USNO",
    isFallback: true
  };
}

function normalizePrimaryMoonPhase(value: string | null | undefined): PrimaryMoonPhase | undefined {
  const phase = normalizeMoonPhaseName(value);

  if (phase === "New Moon" || phase === "First Quarter" || phase === "Full Moon" || phase === "Last Quarter") {
    return phase;
  }

  return undefined;
}

export function formatDateForUsno(date: Date, timezoneOffset = DEFAULT_MOON_LOCATION.timezoneOffset) {
  return new Date(date.getTime() + timezoneOffset * 3600000).toISOString().slice(0, 10);
}

function formatDateTimeUtc(dateUtc: string) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: false
  }).format(date);
}

function clampPercent(value: number) {
  return Math.round(Math.max(0, Math.min(100, value)) * 10) / 10;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}
