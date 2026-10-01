export type AnalyticsEvent =
  | "article_opened"
  | "original_source_clicked"
  | "related_article_clicked"
  | "tool_used"
  | "search_performed"
  | "share_clicked";

export function trackEvent(event: AnalyticsEvent, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", event, params);
}
