import type { SpaceEvent } from "@/lib/types";

type TimedEvent = Pick<SpaceEvent, "dateUtc" | "status">;
export function isUpcomingEvent(event: TimedEvent, now = Date.now()) {
  const time = Date.parse(event.dateUtc);
  if (!Number.isFinite(time) || event.status === "completed" || event.status === "failed") return false;
  return time >= now || (event.status === "live" && time > now - 86400000);
}
export function isPastEvent(event: TimedEvent, now = Date.now()) {
  return Number.isFinite(Date.parse(event.dateUtc)) && !isUpcomingEvent(event, now);
}
