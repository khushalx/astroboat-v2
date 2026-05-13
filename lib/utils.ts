export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function humanizeToken(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatDateTime(value: string) {
  const date = new Date(value);

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

export function formatNumber(value: number, maximumFractionDigits = 1) {
  if (!Number.isFinite(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en", { maximumFractionDigits }).format(value);
}

export function formatKilometers(value: number) {
  return Number.isFinite(value) ? `${formatNumber(value, 0)} km` : "Distance unavailable";
}

export function formatSpeedKps(value: number) {
  return Number.isFinite(value) ? `${formatNumber(value, 1)} km/s` : "Speed unavailable";
}

export function formatLunarDistance(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${formatNumber(value, 1)} lunar distances`
    : "Lunar distance unavailable";
}

export function formatAu(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `${formatNumber(value, 4)} AU` : "AU unavailable";
}

export function formatCoordinate(value: number, type: "latitude" | "longitude") {
  if (!Number.isFinite(value)) {
    return "Coordinate unavailable";
  }

  const direction = type === "latitude" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";

  return `${formatNumber(Math.abs(value), 2)}° ${direction}`;
}

export function formatUnixTimestamp(unixSeconds: number) {
  if (!Number.isFinite(unixSeconds)) {
    return "Time unavailable";
  }

  return formatDateTime(new Date(unixSeconds * 1000).toISOString());
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "Duration unavailable";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes <= 0) {
    return `${remainingSeconds} sec`;
  }

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
}

export function formatDegrees(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `${formatNumber(value, 0)}°` : "Degrees unavailable";
}

export function formatElevation(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `${formatNumber(value, 0)}°` : "Elevation unavailable";
}

export function formatSpeed(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `${formatNumber(value, 0)} km/h` : "Speed unavailable";
}
