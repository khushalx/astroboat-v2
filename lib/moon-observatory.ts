import { Body, GeoVector, Libration, MoonPhase, RotationAxis } from "astronomy-engine";
import type { MoonData, MoonPhaseName } from "@/lib/types";

export type LunarVector = [number, number, number];
export type LunarSnapshot = {
  dateIso: string;
  phaseName: MoonPhaseName;
  illuminationPercent: number;
  phaseLongitude: number;
  sunDirection: LunarVector;
  libration: { longitude: number; latitude: number };
  distanceKm: number;
  source: "USNO daily snapshot" | "Calculated simulation";
};

const radians = Math.PI / 180;
const unit = (v: LunarVector): LunarVector => {
  const length = Math.hypot(...v);
  return v.map((n) => n / length) as LunarVector;
};
const dot = (a: LunarVector, b: LunarVector) => a.reduce((sum, n, i) => sum + n * b[i], 0);
const cross = (a: LunarVector, b: LunarVector): LunarVector => [
  a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]
];

export function phaseFromLongitude(longitude: number): MoonPhaseName {
  const angle = ((longitude % 360) + 360) % 360;
  if (angle < 1 || angle >= 359) return "New Moon";
  if (Math.abs(angle - 90) < 1) return "First Quarter";
  if (Math.abs(angle - 180) < 1) return "Full Moon";
  if (Math.abs(angle - 270) < 1) return "Last Quarter";
  return angle < 90 ? "Waxing Crescent" : angle < 180 ? "Waxing Gibbous" : angle < 270 ? "Waning Gibbous" : "Waning Crescent";
}

/** Daily simulations use local noon, never the browser's implicit timezone. */
export function lunarDateAtNoon(civilDate: string, timezoneOffset: number): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(civilDate)) throw new RangeError("Invalid lunar date");
  const date = new Date(civilDate + "T12:00:00Z");
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== civilDate) throw new RangeError("Invalid lunar date");
  return new Date(date.getTime() - timezoneOffset * 3600000);
}

export function shiftLunarDate(civilDate: string, days: number): string {
  const date = lunarDateAtNoon(civilDate, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Geocentric, lunar-north-up frame. No horizon rotation, refraction or eclipse shading. */
export function calculateLunarSnapshot(date: Date): LunarSnapshot {
  if (!Number.isFinite(date.getTime())) throw new RangeError("Invalid lunar date");
  const moon = GeoVector(Body.Moon, date, false);
  const sun = GeoVector(Body.Sun, date, false);
  const pole = RotationAxis(Body.Moon, date).north;
  const earthDirection = unit([-moon.x, -moon.y, -moon.z]);
  const right = unit(cross([pole.x, pole.y, pole.z], earthDirection));
  const up = unit(cross(earthDirection, right));
  const sunlight = unit([sun.x - moon.x, sun.y - moon.y, sun.z - moon.z]);
  const sunDirection: LunarVector = [dot(sunlight, right), dot(sunlight, up), dot(sunlight, earthDirection)];
  const libration = Libration(date);
  const phaseLongitude = MoonPhase(date);
  return {
    dateIso: date.toISOString(),
    phaseName: phaseFromLongitude(phaseLongitude),
    illuminationPercent: (1 + sunDirection[2]) * 50,
    phaseLongitude,
    sunDirection,
    libration: { longitude: libration.elon, latitude: libration.elat },
    distanceKm: libration.dist_km,
    source: "Calculated simulation"
  };
}

/** Retain the provider's daily phase/fraction; the model supplies orientation only. */
export function observationSnapshot(moon: MoonData): LunarSnapshot {
  const model = calculateLunarSnapshot(lunarDateAtNoon(moon.date, moon.timezoneOffset));
  if (moon.isFallback || moon.phaseName === "Unknown" || !Number.isFinite(moon.illuminationPercent)) return model;
  const fraction = Math.min(100, Math.max(0, moon.illuminationPercent)) / 100;
  const z = 2 * fraction - 1;
  const side = /waning|last/i.test(moon.phaseName) ? -1 : 1;
  const transverse = Math.sqrt(Math.max(0, 1 - z * z));
  const positionAngle = Math.atan2(model.sunDirection[1], Math.abs(model.sunDirection[0]));
  return {
    ...model,
    phaseName: moon.phaseName,
    illuminationPercent: moon.illuminationPercent,
    sunDirection: [side * transverse * Math.cos(positionAngle), transverse * Math.sin(positionAngle), z],
    source: "USNO daily snapshot"
  };
}

/** Camera basis expressed in lunar body coordinates; east-positive longitude. */
export function lunarViewBasis(longitude: number, latitude: number) {
  const lon = longitude * radians, lat = latitude * radians;
  const forward: LunarVector = [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  const right = unit(cross([0, 1, 0], forward));
  return { right, up: unit(cross(forward, right)), forward };
}
