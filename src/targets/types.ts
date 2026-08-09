/**
 * "on-spec" targets are a company's own design-system site (expected to
 * score near-zero — if it doesn't, that's a matcher bug, not real drift).
 * "real-app" targets are their actual product, where drift is the whole
 * point of measuring. The two are never blended into one number.
 */
export type TargetKind = "on-spec" | "real-app";

export interface CrawlTarget {
  /** stable identifier, used for cache/report directory names, e.g. "carbon-onspec" */
  key: string;
  label: string;
  kind: TargetKind;
  /** absolute URLs to crawl — small, explicit list, no auto-discovery */
  urls: string[];
}
