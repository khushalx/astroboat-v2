import type { NavItem } from "@/lib/types";

export const SITE_NAME = "Astroboat";

export const SPACE_DEVS_API_BASE = "https://ll.thespacedevs.com/2.3.0";

export const EVENTS_REVALIDATE_SECONDS = 21600;

export const DEFAULT_EVENTS_LIMIT = 10;

export const DEFAULT_LAUNCHES_LIMIT = 10;

export const USNO_API_BASE = "https://aa.usno.navy.mil/api";

export const MOON_REVALIDATE_SECONDS = 21600;

export const DEFAULT_MOON_LOCATION = {
  name: "Ahmedabad, India",
  latitude: 23.0225,
  longitude: 72.5714,
  timezoneOffset: 5.5
};

export const JPL_CAD_API_URL = "https://ssd-api.jpl.nasa.gov/cad.api";

export const NASA_NEOWS_API_BASE = "https://api.nasa.gov/neo/rest/v1";

export const ASTEROIDS_REVALIDATE_SECONDS = 21600;

export const DEFAULT_ASTEROIDS_LIMIT = 20;

export const AU_TO_KM = 149597870.7;

export const LUNAR_DISTANCE_KM = 384400;

export const OPEN_NOTIFY_ISS_URL = "http://api.open-notify.org/iss-now.json";

export const N2YO_API_BASE = "https://api.n2yo.com/rest/v1/satellite";

export const SATELLITES_REVALIDATE_SECONDS = 300;

export const SATELLITE_PASSES_REVALIDATE_SECONDS = 1800;

export const ISS_NORAD_ID = 25544;

export const DEFAULT_SATELLITE_LOCATION = {
  name: "Ahmedabad, India",
  latitude: 23.0225,
  longitude: 72.5714,
  altitudeMeters: 53
};

export const DEFAULT_PASS_DAYS = 5;

export const DEFAULT_MIN_VISIBILITY_SECONDS = 120;

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Briefs", href: "/briefs" },
  { label: "Events", href: "/events" },
  { label: "Moon", href: "/moon" },
  { label: "Asteroid Watch", href: "/asteroids" }
];

export const eventFilters = ["All", "Launches", "Space Events", "Sky Events", "This Week", "This Month", "Online", "Worldwide"];

export const articleCategories = ["All", "Sky Watching", "Moon", "Asteroids", "Missions", "Cosmology", "Basics"];
