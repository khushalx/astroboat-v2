import {
  DEFAULT_EVENTS_LIMIT,
  DEFAULT_LAUNCHES_LIMIT,
  EVENTS_REVALIDATE_SECONDS,
  SPACE_DEVS_API_BASE
} from "@/lib/constants";
import { spaceEvents as mockSpaceEvents } from "@/lib/mock-data";
import type { SpaceEvent, SpaceEventCategory, SpaceEventStatus } from "@/lib/types";
import type { SpaceDevsEvent, SpaceDevsLaunch, SpaceDevsListResponse } from "@/services/space-devs-types";

export type SpaceCalendarResult = {
  events: SpaceEvent[];
  warnings: string[];
  liveDataAvailable: boolean;
  lastUpdated: string;
};

type FetchResult<T> = {
  data: T[];
  failed: boolean;
  throttled: boolean;
};

type SpaceDevsJsonResult<T> = {
  payload?: T;
  failed: boolean;
  throttled: boolean;
};

const throttledWarning = "Live event data is temporarily rate-limited. Showing saved Astroboat events for now.";
const fallbackWarning = "Live event data is temporarily unavailable. Showing saved Astroboat events.";
let spaceDevsThrottleUntil = 0;

function buildSpaceDevsUrl(path: string, params: Record<string, string | number>) {
  const url = new URL(`${SPACE_DEVS_API_BASE}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url;
}

export async function fetchSpaceDevsJson<T>(url: string): Promise<SpaceDevsJsonResult<T>> {
  if (Date.now() < spaceDevsThrottleUntil) {
    return { failed: true, throttled: true };
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: EVENTS_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json"
      }
    });

    const body = await response.text();
    const isThrottled = response.status === 429 || body.toLowerCase().includes("request was throttled");

    if (isThrottled) {
      spaceDevsThrottleUntil = Date.now() + EVENTS_REVALIDATE_SECONDS * 1000;
      console.warn("The Space Devs API is rate-limited. Using Astroboat event fallback.");

      return { failed: true, throttled: true };
    }

    if (!response.ok) {
      console.warn(`The Space Devs request failed with status ${response.status}.`);

      return { failed: true, throttled: false };
    }

    return {
      payload: JSON.parse(body) as T,
      failed: false,
      throttled: false
    };
  } catch {
    console.warn("The Space Devs request errored. Using Astroboat event fallback.");

    return { failed: true, throttled: false };
  }
}

async function fetchSpaceDevsList<T>(url: URL): Promise<FetchResult<T>> {
  const result = await fetchSpaceDevsJson<SpaceDevsListResponse<T>>(url.toString());

  if (result.failed || !result.payload) {
    return { data: [], failed: true, throttled: result.throttled };
  }

  return {
    data: Array.isArray(result.payload.results) ? result.payload.results : [],
    failed: false,
    throttled: false
  };
}

export async function getUpcomingLaunches(limit = DEFAULT_LAUNCHES_LIMIT): Promise<SpaceEvent[]> {
  const url = buildSpaceDevsUrl("/launches/upcoming/", {
    limit,
    mode: "normal",
    ordering: "net",
    net__gte: getTodayDateFilter()
  });
  const result = await fetchSpaceDevsList<SpaceDevsLaunch>(url);

  if (result.failed) {
    return getMockLaunchFallback(limit);
  }

  return result.data.map(mapLaunchToSpaceEvent).filter(isValidSpaceEvent);
}

export async function getLaunchLibraryEvents(limit = DEFAULT_EVENTS_LIMIT): Promise<SpaceEvent[]> {
  const url = buildSpaceDevsUrl("/events/", {
    limit,
    mode: "list",
    ordering: "date",
    date__gte: getTodayDateFilter()
  });
  const result = await fetchSpaceDevsList<SpaceDevsEvent>(url);

  if (result.failed) {
    return getMockSpaceflightFallback(limit);
  }

  return result.data.map(mapSpaceDevEventToSpaceEvent).filter(isValidSpaceEvent);
}

export async function getCombinedSpaceCalendar(limit = 40): Promise<SpaceCalendarResult> {
  const launchesResult = await getLaunchSource(DEFAULT_LAUNCHES_LIMIT);
  const eventsResult = launchesResult.throttled
    ? { events: getMockSpaceflightFallback(DEFAULT_EVENTS_LIMIT), failed: true, throttled: true }
    : await getEventSource(DEFAULT_EVENTS_LIMIT);
  const warnings: string[] = [];

  if (launchesResult.throttled || eventsResult.throttled) {
    warnings.push(throttledWarning);
  } else if (launchesResult.failed && eventsResult.failed) {
    warnings.push(fallbackWarning);
  } else if (launchesResult.failed) {
    warnings.push("Launch data is temporarily unavailable. Showing saved Astroboat launch events alongside live space events.");
  } else if (eventsResult.failed) {
    warnings.push("Spaceflight event data is temporarily unavailable. Showing saved Astroboat events alongside live launches.");
  }

  const curatedSkyEvents = getCuratedSkyEvents();
  const events = dedupeEvents([...launchesResult.events, ...eventsResult.events, ...curatedSkyEvents])
    .filter(isValidSpaceEvent)
    .sort((a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime())
    .slice(0, limit);

  return {
    events,
    warnings,
    liveDataAvailable: !launchesResult.failed || !eventsResult.failed,
    lastUpdated: new Date().toISOString()
  };
}

export async function getUpcomingSpaceEvents(): Promise<SpaceEvent[]> {
  return (await getCombinedSpaceCalendar()).events;
}

export async function getSpaceEventBySlug(slug: string): Promise<SpaceEvent | undefined> {
  const calendar = await getCombinedSpaceCalendar();

  return calendar.events.find((event) => event.slug === slug);
}

export async function getUpcomingEvents(limit?: number): Promise<SpaceEvent[]> {
  const calendar = await getCombinedSpaceCalendar(limit);

  return calendar.events;
}

export async function getEventsByCategory(category: SpaceEventCategory): Promise<SpaceEvent[]> {
  const calendar = await getCombinedSpaceCalendar();

  return calendar.events.filter((event) => event.category === category);
}

async function getLaunchSource(limit: number): Promise<{ events: SpaceEvent[]; failed: boolean; throttled: boolean }> {
  const url = buildSpaceDevsUrl("/launches/upcoming/", {
    limit,
    mode: "normal",
    ordering: "net",
    net__gte: getTodayDateFilter()
  });
  const result = await fetchSpaceDevsList<SpaceDevsLaunch>(url);

  return {
    events: result.failed ? getMockLaunchFallback(limit) : result.data.map(mapLaunchToSpaceEvent).filter(isValidSpaceEvent),
    failed: result.failed,
    throttled: result.throttled
  };
}

async function getEventSource(limit: number): Promise<{ events: SpaceEvent[]; failed: boolean; throttled: boolean }> {
  const url = buildSpaceDevsUrl("/events/", {
    limit,
    mode: "list",
    ordering: "date",
    date__gte: getTodayDateFilter()
  });
  const result = await fetchSpaceDevsList<SpaceDevsEvent>(url);

  return {
    events: result.failed ? getMockSpaceflightFallback(limit) : result.data.map(mapSpaceDevEventToSpaceEvent).filter(isValidSpaceEvent),
    failed: result.failed,
    throttled: result.throttled
  };
}

export function mapLaunchToSpaceEvent(launch: SpaceDevsLaunch): SpaceEvent {
  const id = String(launch.id ?? launch.slug ?? launch.name ?? crypto.randomUUID());
  const title = cleanText(launch.name, "Untitled launch");
  const dateUtc = cleanText(launch.net ?? launch.window_start ?? launch.window_end, "");
  const provider = cleanText(launch.launch_service_provider?.name, "");
  const mission = cleanText(launch.mission?.name, "");
  const rocket = cleanText(launch.rocket?.configuration?.full_name, "");
  const location = [launch.pad?.name, launch.pad?.location?.name].filter(Boolean).join(", ") || "Launch location unavailable";
  const webcastUrl = firstUrl(launch.vid_urls) ?? firstUrl(launch.mission?.vid_urls);
  const sourceUrl = firstUrl(launch.info_urls) ?? firstUrl(launch.mission?.info_urls) ?? cleanText(launch.url, "");

  return {
    id: `launch-${id}`,
    externalId: id,
    slug: createEventSlug(launch.slug ?? title, id),
    title,
    description: cleanText(launch.mission?.description, `${title} is an upcoming launch tracked by The Space Devs Launch Library 2.`),
    category: "launch",
    status: normalizeLaunchStatus(launch.status, dateUtc),
    dateUtc,
    dateDisplay: formatDateTimeUtc(dateUtc),
    location,
    agency: provider || undefined,
    provider: provider || undefined,
    mission: mission || undefined,
    rocket: rocket || undefined,
    imageUrl: cleanText(launch.image?.image_url, "") || undefined,
    sourceUrl: sourceUrl || undefined,
    webcastUrl: webcastUrl || undefined,
    visibility: webcastUrl || launch.webcast_live ? "Online" : "Worldwide",
    source: "The Space Devs",
    importance: launch.webcast_live ? "high" : "medium",
    whyItMatters: createWhyItMatters({
      category: "launch",
      provider,
      mission,
      rocket,
      title
    })
  };
}

export function mapSpaceDevEventToSpaceEvent(event: SpaceDevsEvent): SpaceEvent {
  const id = String(event.id ?? event.slug ?? event.name ?? crypto.randomUUID());
  const title = cleanText(event.name, "Untitled space event");
  const dateUtc = cleanText(event.date, "");
  const category = normalizeEventCategory(event);
  const webcastUrl = firstUrl(event.vid_urls);
  const sourceUrl = firstUrl(event.info_urls) ?? cleanText(event.url, "");
  const program = event.program?.map((item) => item.name).filter(Boolean).join(", ");

  return {
    id: `event-${id}`,
    externalId: id,
    slug: createEventSlug(event.slug ?? title, id),
    title,
    description: cleanText(event.description, `${title} is a spaceflight event tracked by The Space Devs Launch Library 2.`),
    category,
    status: normalizeDateStatus(dateUtc, event.webcast_live ? "live" : "scheduled"),
    dateUtc,
    dateDisplay: formatDateTimeUtc(dateUtc),
    location: cleanText(event.location, "Location unavailable"),
    agency: program || undefined,
    imageUrl: cleanText(event.image?.image_url, "") || undefined,
    sourceUrl: sourceUrl || undefined,
    webcastUrl: webcastUrl || undefined,
    visibility: webcastUrl || event.webcast_live ? "Online" : "Worldwide",
    source: "The Space Devs",
    importance: category === "eva" || category === "docking" || category === "landing" || category === "crew" ? "high" : "medium",
    whyItMatters: createWhyItMatters({
      category,
      title,
      provider: program ?? "",
      mission: title
    })
  };
}

export function normalizeLaunchStatus(status: SpaceDevsLaunch["status"], dateUtc: string): SpaceEventStatus {
  const raw = `${status?.name ?? ""} ${status?.abbrev ?? ""}`.toLowerCase();

  if (raw.includes("failure") || raw.includes("failed")) {
    return "failed";
  }

  if (raw.includes("delay") || raw.includes("hold")) {
    return "delayed";
  }

  if (raw.includes("to be confirmed") || raw.includes("tbc")) {
    return "to_be_confirmed";
  }

  if (raw.includes("to be determined") || raw.includes("tbd")) {
    return "to_be_determined";
  }

  if (raw.includes("success") || raw.includes("successful")) {
    return "completed";
  }

  if (raw.includes("go") || raw.includes("scheduled")) {
    return normalizeDateStatus(dateUtc, "scheduled");
  }

  return normalizeDateStatus(dateUtc, "unknown");
}

export function normalizeEventCategory(event: SpaceDevsEvent): SpaceEventCategory {
  const type = event.type?.name?.toLowerCase() ?? "";

  if (type.includes("eva")) return "eva";
  if (type.includes("docking")) return "docking";
  if (type.includes("landing")) return "landing";
  if (type.includes("press") || type.includes("conference") || type.includes("news")) return "conference";
  if (type.includes("crew") || type.includes("human")) return "crew";

  return "space_event";
}

export function createWhyItMatters(event: {
  category: SpaceEventCategory;
  title: string;
  provider?: string;
  mission?: string;
  rocket?: string;
}) {
  if (event.category === "launch") {
    const provider = event.provider ? `${event.provider} ` : "";
    const rocket = event.rocket ? ` on ${event.rocket}` : "";
    const mission = event.mission ? ` for ${event.mission}` : "";

    return `${provider}launch activity${rocket}${mission} is useful for tracking mission cadence, spacecraft operations, and public viewing or webcast opportunities.`;
  }

  if (event.category === "docking") {
    return "Docking events are key milestones for station logistics, crew support, and orbital operations.";
  }

  if (event.category === "eva") {
    return "Spacewalks expose real-time station maintenance and human spaceflight operations outside the spacecraft.";
  }

  if (event.category === "landing") {
    return "Landing events close the mission loop and reveal whether spacecraft recovery, sample return, or crew return objectives were met.";
  }

  if (event.category === "crew") {
    return "Crewed events are high-interest mission milestones that affect station schedules, spacecraft readiness, and public coverage.";
  }

  return "This event helps place spaceflight activity in context beyond launches alone.";
}

export function createEventSlug(title: string, id: string | number) {
  const normalizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${normalizedTitle || "space-event"}-${String(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export function formatDateTimeUtc(dateUtc: string) {
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

export function formatDateOnly(dateUtc: string) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function getRelativeTimeLabel(dateUtc: string) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "Timing unknown";
  }

  const diffMs = date.getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const absHours = Math.abs(diffHours);

  if (absHours < 1) return diffMs >= 0 ? "Within the hour" : "Less than an hour ago";
  if (absHours < 48) return diffMs >= 0 ? `In ${absHours} hours` : `${absHours} hours ago`;

  const days = Math.round(absHours / 24);

  return diffMs >= 0 ? `In ${days} days` : `${days} days ago`;
}

function normalizeDateStatus(dateUtc: string, fallback: SpaceEventStatus): SpaceEventStatus {
  const date = new Date(dateUtc);

  if (!Number.isNaN(date.getTime()) && date.getTime() < Date.now() && fallback !== "failed" && fallback !== "delayed") {
    return "completed";
  }

  return fallback;
}

function isValidSpaceEvent(event: SpaceEvent) {
  return Boolean(
    event.id &&
      event.title &&
      event.slug &&
      event.dateUtc &&
      !Number.isNaN(new Date(event.dateUtc).getTime()) &&
      event.category &&
      event.status
  );
}

function getCuratedSkyEvents() {
  return mockSpaceEvents.filter((event) => event.category === "sky_event");
}

function getMockLaunchFallback(limit: number) {
  return mockSpaceEvents.filter((event) => event.category === "launch").slice(0, limit);
}

function getMockSpaceflightFallback(limit: number) {
  return mockSpaceEvents.filter((event) => event.category !== "sky_event").slice(0, limit);
}

function dedupeEvents(events: SpaceEvent[]) {
  const seen = new Set<string>();

  return events.filter((event) => {
    const key = event.externalId ? `${event.source}-${event.externalId}` : event.slug;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function cleanText(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : fallback;
}

function firstUrl(urls: Array<{ url?: string | null }> | null | undefined) {
  return urls?.find((item) => Boolean(item.url?.trim()))?.url?.trim();
}

function getTodayDateFilter() {
  return new Date().toISOString().slice(0, 10);
}
