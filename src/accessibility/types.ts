/**
 * WCAG contrast findings are a distinct finding category from
 * PropertyDeviation (matchers/types.ts): they answer "does this pass an
 * external, objective standard (WCAG)", independent of the token spec — an
 * element can be perfectly on-spec and still fail contrast, or off-spec and
 * still pass. Kept as its own shape/list throughout the report rather than
 * folded into deviations or the 0-100 composite score.
 */
export type WcagLevel = "AAA" | "AA" | "fail";

/**
 * What the corrected-to-spec-token color(s) would do to this element's
 * contrast ratio, when it's also flagged as a color/background-color
 * deviation. Only present when the corrected ratio crosses a pass threshold
 * (fail -> AA/AAA, or AA -> AAA) that the captured ratio doesn't clear —
 * ties an accessibility failure directly to an already-known, actionable
 * fix. Absent (not just "no improvement") when there's nothing to correct
 * or correcting doesn't cross a threshold, so its presence alone is the
 * "worth calling out" signal.
 */
export interface ContrastTieIn {
  correctedRatio: number;
  correctedLevel: WcagLevel;
  /** plain-English rendering, e.g. "currently 3.2:1 (fails AA) — the spec token would give you 4.6:1 (passes AA)". */
  humanReadable: string;
}

export interface AccessibilityFinding {
  page: string;
  component: string;
  instanceId: string;
  ratio: number;
  level: WcagLevel;
  isLargeText: boolean;
  fontSize: number;
  fontWeight: number;
  /** raw computed `color` this element renders with. */
  color: string;
  /** resolved effective background (see CapturedStyles.effectiveBackgroundColor). */
  effectiveBackground: string;
  /** false if no ancestor had a non-transparent background and white was assumed. */
  backgroundResolved: boolean;
  /** plain-English rendering, e.g. "text here is barely readable against its background — 2.1:1, needs at least 4.5:1". */
  humanReadable: string;
  tieIn?: ContrastTieIn;
}

export interface AccessibilitySummary {
  totalChecked: number;
  passCount: number;
  failCount: number;
  /** lowest-ratio findings first, capped — enough context to manually verify each one. */
  worstOffenders: AccessibilityFinding[];
}
