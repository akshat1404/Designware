import type { ExtractedElement } from "../extractor/types.js";
import type { PropertyDeviation } from "../matchers/types.js";
import type { TokenSpec } from "../schema/tokenSpec.js";
import type { AccessibilityFinding, WcagLevel } from "./types.js";
import { contrastRatio, parseCssColor } from "../color/convert.js";
import { parsePx } from "../matchers/scale.js";
import { resolveToken } from "../matchers/resolve.js";
import { humanizeContrast, humanizeContrastTieIn } from "../report/humanize.js";

/** WCAG 2.1 "large text": >=24px at any weight, or >=18.66px (~14pt) at bold (700+). */
const LARGE_TEXT_MIN_SIZE_PX = 24;
const LARGE_TEXT_BOLD_MIN_SIZE_PX = 18.66;
const LARGE_TEXT_BOLD_MIN_WEIGHT = 700;

export function isLargeText(fontSizePx: number, fontWeight: number): boolean {
  if (fontSizePx >= LARGE_TEXT_MIN_SIZE_PX) return true;
  return fontSizePx >= LARGE_TEXT_BOLD_MIN_SIZE_PX && fontWeight >= LARGE_TEXT_BOLD_MIN_WEIGHT;
}

const WCAG_THRESHOLDS: Record<"normal" | "large", { AA: number; AAA: number }> = {
  normal: { AA: 4.5, AAA: 7 },
  large: { AA: 3, AAA: 4.5 },
};

export function classifyContrast(ratio: number, largeText: boolean): WcagLevel {
  const t = largeText ? WCAG_THRESHOLDS.large : WCAG_THRESHOLDS.normal;
  if (ratio >= t.AAA) return "AAA";
  if (ratio >= t.AA) return "AA";
  return "fail";
}

const LEVEL_RANK: Record<WcagLevel, number> = { fail: 0, AA: 1, AAA: 2 };

/**
 * What correcting a color/background-color deviation on this element to its
 * nearest spec token would do to the contrast ratio — see ContrastTieIn's
 * doc comment for why this is only surfaced when it crosses a threshold the
 * captured value misses, not on every improvement.
 */
function buildTieIn(
  deviations: PropertyDeviation[],
  ratio: number,
  level: WcagLevel,
  largeText: boolean,
  capturedColor: string,
  effectiveBackground: string,
  spec: TokenSpec
): AccessibilityFinding["tieIn"] {
  const colorDev = deviations.find((d) => d.property === "color");
  // Only meaningful when the effective background *is* this element's own
  // background — an ancestor's flagged background-color deviation belongs
  // to a different sampled instance, not this one.
  const bgDev = deviations.find((d) => d.property === "background-color");

  if (!colorDev && !bgDev) return undefined;

  const correctedFg = colorDev ? parseCssColor(String(resolveToken(colorDev.nearestToken, spec))) : parseCssColor(capturedColor);
  const correctedBg = bgDev ? parseCssColor(String(resolveToken(bgDev.nearestToken, spec))) : parseCssColor(effectiveBackground);

  const correctedRatio = contrastRatio(correctedFg, correctedBg);
  const correctedLevel = classifyContrast(correctedRatio, largeText);

  if (LEVEL_RANK[correctedLevel] <= LEVEL_RANK[level]) return undefined;

  return {
    correctedRatio,
    correctedLevel,
    humanReadable: humanizeContrastTieIn(ratio, level, correctedRatio, correctedLevel),
  };
}

/**
 * Computes the WCAG contrast finding for one sampled element, or undefined
 * when there's nothing to check: only real-page sampling (sample.ts)
 * resolves `effectiveBackgroundColor`, and only for text-containing
 * elements — tag-based fixture extraction and non-text elements carry no
 * value there at all.
 *
 * `deviations` is this same element's already-computed PropertyDeviation
 * list (from scoreElement) — passed in rather than recomputed here so this
 * module has no dependency on the aggregator (which is what calls this).
 */
export function checkElementAccessibility(
  el: ExtractedElement,
  page: string,
  deviations: PropertyDeviation[],
  spec: TokenSpec
): AccessibilityFinding | undefined {
  const s = el.styles;
  if (s.effectiveBackgroundColor === undefined) return undefined;

  const fg = parseCssColor(s.color);
  const bg = parseCssColor(s.effectiveBackgroundColor);
  const ratio = contrastRatio(fg, bg);
  const fontSize = parsePx(s.fontSize);
  const fontWeight = Number(s.fontWeight);
  const largeText = isLargeText(fontSize, fontWeight);
  const level = classifyContrast(ratio, largeText);

  return {
    page,
    component: el.component,
    instanceId: el.instanceId,
    ratio,
    level,
    isLargeText: largeText,
    fontSize,
    fontWeight,
    color: s.color,
    effectiveBackground: s.effectiveBackgroundColor,
    backgroundResolved: s.effectiveBackgroundResolved ?? false,
    humanReadable: humanizeContrast(ratio, level, largeText),
    tieIn: buildTieIn(deviations, ratio, level, largeText, s.color, s.effectiveBackgroundColor, spec),
  };
}
