import { canonicalUrlKey, titleTokens, tokenSimilarity } from "@/lib/content-utils";

export type DedupeCandidate = {
  id: string;
  title: string;
  /** Canonical publisher URL plus any URLs the publisher declares as the same story (e.g. language versions). */
  urls: string[];
  publishedAt: string;
  /** Higher wins when several candidates describe the same story. */
  preference: number;
};

export type DedupeCluster<T extends DedupeCandidate> = {
  representative: T;
  members: T[];
};

const NEAR_DUPLICATE_SIMILARITY = 0.72;
const NEAR_DUPLICATE_WINDOW_MS = 4 * 86_400_000;
const EXACT_TITLE_WINDOW_MS = 21 * 86_400_000;

function exactTitleKey(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function timestamp(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

/**
 * Groups candidates that describe the same story:
 * - identical canonical URLs (tracking parameters, scheme, www and AMP ignored)
 * - publisher-declared alternates (English and Spanish NASA releases link each other)
 * - identical titles from different feeds
 * - near-identical titles published within a few days (cross-publisher copies)
 */
export function clusterCandidates<T extends DedupeCandidate>(candidates: T[]): Array<DedupeCluster<T>> {
  const parent = candidates.map((_, index) => index);
  const find = (index: number): number => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]];
      index = parent[index];
    }
    return index;
  };
  const union = (a: number, b: number) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent[rootB] = rootA;
  };

  const byUrl = new Map<string, number>();
  const byTitle = new Map<string, number>();
  const tokens = candidates.map((candidate) => titleTokens(candidate.title));
  const times = candidates.map((candidate) => timestamp(candidate.publishedAt));

  candidates.forEach((candidate, index) => {
    for (const url of candidate.urls) {
      const key = canonicalUrlKey(url);
      if (!key) continue;
      const existing = byUrl.get(key);
      if (existing === undefined) byUrl.set(key, index);
      else union(existing, index);
    }

    const titleKey = exactTitleKey(candidate.title);
    if (titleKey.length >= 12) {
      const existing = byTitle.get(titleKey);
      if (existing !== undefined && (!times[existing] || !times[index] || Math.abs(times[existing] - times[index]) <= EXACT_TITLE_WINDOW_MS)) {
        union(existing, index);
      } else if (existing === undefined) {
        byTitle.set(titleKey, index);
      }
    }
  });

  for (let a = 0; a < candidates.length; a += 1) {
    if (tokens[a].length < 4) continue;
    for (let b = a + 1; b < candidates.length; b += 1) {
      if (tokens[b].length < 4 || find(a) === find(b)) continue;
      if (times[a] && times[b] && Math.abs(times[a] - times[b]) > NEAR_DUPLICATE_WINDOW_MS) continue;
      if (tokenSimilarity(tokens[a], tokens[b]) >= NEAR_DUPLICATE_SIMILARITY) union(a, b);
    }
  }

  const groups = new Map<number, T[]>();
  candidates.forEach((candidate, index) => {
    const root = find(index);
    const group = groups.get(root) ?? [];
    group.push(candidate);
    groups.set(root, group);
  });

  return [...groups.values()].map((members) => ({
    members,
    representative: [...members].sort((a, b) => b.preference - a.preference || timestamp(a.publishedAt) - timestamp(b.publishedAt))[0]
  }));
}
