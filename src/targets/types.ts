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
  /**
   * Set when an "on-spec" target could not be confirmed to actually render
   * the real component library (e.g. a docs page *about* the design system
   * rather than pages built *with* it). An unverified on-spec score is not
   * a trustworthy near-zero baseline and must not be read next to genuine
   * on-spec targets as if it were one.
   */
  unverified?: string;
}
