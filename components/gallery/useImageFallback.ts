"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

type Status = "loading" | "loaded" | "failed";
type State = { key: string; index: number; status: Status };
type Action = { type: "loaded" } | { type: "advance"; count: number } | { type: "reset"; key: string; count: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loaded":
      return state.status === "loaded" ? state : { ...state, status: "loaded" };
    case "advance":
      return state.index + 1 < action.count ? { ...state, index: state.index + 1, status: "loading" } : { ...state, status: "failed" };
    case "reset":
      return { key: action.key, index: 0, status: action.count > 0 ? "loading" : "failed" };
  }
}

/** Keeps only distinct https image URLs, in priority order. */
export function imageCandidates(...urls: Array<string | undefined | null>): string[] {
  const result: string[] = [];
  for (const url of urls) {
    if (typeof url !== "string" || !/^https:\/\/[^\s"'<>]+$/i.test(url) || result.includes(url)) continue;
    result.push(url);
  }
  return result;
}

/**
 * Loads the first working rendition from a candidate list.
 *
 * - Resets synchronously when the candidate list changes, so the previous
 *   image's "failed" or "loaded" state never leaks into the next one.
 * - Detects images that finished loading before React hydrated (onLoad is
 *   missed in that case, which used to leave a skeleton on screen forever).
 * - Treats a stalled request as a failure after `timeoutMs` and moves on.
 * - Rejects 1×1 tracking pixels and other empty decodes.
 */
export function useImageFallback(candidates: string[], timeoutMs = 15000) {
  const key = candidates.join("\n");
  const stableCandidates = useMemo(() => (key ? key.split("\n") : []), [key]);
  const [state, dispatch] = useReducer(reducer, { key, index: 0, status: stableCandidates.length > 0 ? "loading" : "failed" });
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Adjust state while rendering (React's documented pattern for "reset when a
  // prop changes"), so the first paint for new candidates is already clean.
  const changed = state.key !== key;
  if (changed) dispatch({ type: "reset", key, count: stableCandidates.length });
  const current: State = changed ? { key, index: 0, status: stableCandidates.length > 0 ? "loading" : "failed" } : state;

  const src = current.status === "failed" ? undefined : stableCandidates[current.index];

  const onLoad = useCallback(
    (event: { currentTarget: HTMLImageElement }) => {
      const image = event.currentTarget;
      if (image.naturalWidth > 1 && image.naturalHeight > 1) dispatch({ type: "loaded" });
      else dispatch({ type: "advance", count: stableCandidates.length });
    },
    [stableCandidates.length]
  );

  const onError = useCallback(() => dispatch({ type: "advance", count: stableCandidates.length }), [stableCandidates.length]);

  useEffect(() => {
    if (!src || current.status !== "loading") return;

    const image = imgRef.current;
    if (image?.complete && image.currentSrc) {
      if (image.naturalWidth > 1) dispatch({ type: "loaded" });
      else dispatch({ type: "advance", count: stableCandidates.length });
      return;
    }

    const timer = window.setTimeout(() => dispatch({ type: "advance", count: stableCandidates.length }), timeoutMs);
    return () => window.clearTimeout(timer);
  }, [src, current.status, stableCandidates.length, timeoutMs]);

  return { src, status: current.status, imgRef, onLoad, onError };
}

/** Exposed for unit tests of the fallback state machine. */
export const __imageFallbackReducer = reducer;
