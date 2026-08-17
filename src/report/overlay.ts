import { createHash } from "node:crypto";
import type { ExtractedElement, ExtractedPage, Position } from "../extractor/types.js";
import type { PageReport } from "../aggregator/aggregate.js";
import { categoryOf, type Category } from "../aggregator/aggregate.js";
import type { PropertyDeviation } from "../matchers/types.js";
import type { AccessibilityFinding } from "../accessibility/types.js";
import type { TokenSpec } from "../schema/tokenSpec.js";
import { resolveToken } from "../matchers/resolve.js";
import { humanizeDeviation } from "./humanize.js";

/**
 * Below this instance score (0-100, the same category-weighted scale as
 * InstanceReport.score), a deviation is treated as ordinary noise rather
 * than something worth drawing a box around. Fixed, not relative to the
 * page's own score distribution: a relative cutoff ("worst N% on this
 * page") would still highlight *something* on an already-clean page,
 * which defeats the point of a "here's what's actually wrong" artifact —
 * an on-spec target should be able to render an overlay with zero boxes.
 * 15 sits clearly above the near-zero noise floor seen on genuine on-spec
 * targets (carbon-onspec 1.8, atlassian-onspec 1.9) while still catching
 * real drift (Jira real-app's worst offenders reach 18.3). Worth
 * revisiting once there's a larger sample of real-app scores to
 * calibrate against — flagging this as a judgment call, not a settled
 * constant.
 */
export const OVERLAY_SCORE_THRESHOLD = 15;

export const CATEGORY_COLORS: Record<Category, string> = {
  color: "#e53e3e",
  spacing: "#dd6b20",
  typography: "#3182ce",
  radius: "#805ad5",
};

/**
 * Deliberately not drawn from CATEGORY_COLORS: a contrast failure isn't a
 * fifth deviation category (it's not scored, not spec-relative, and can
 * fire on an otherwise perfectly on-spec element), so it gets its own color
 * rather than borrowing one of the four that implies it's part of that
 * scoring. A warm amber reads as a caution/warning color without
 * colliding with color's red or spacing's orange.
 */
export const ACCESSIBILITY_COLOR = "#ecc94b";

interface BaseBox {
  instanceId: string;
  component: string;
  position: Position;
}

export interface DeviationBox extends BaseBox {
  kind: "deviation";
  category: Category;
  score: number;
  deviations: PropertyDeviation[];
}

/** Only ever built for level === "fail" findings — a passing (AA/AAA) contrast result isn't something to highlight as a problem. */
export interface AccessibilityBox extends BaseBox {
  kind: "accessibility";
  finding: AccessibilityFinding;
}

/**
 * Deliberately a discriminated union, not one flat shape with optional
 * fields: a deviation box and an accessibility box represent two different
 * kinds of finding (spec-relative score vs. external WCAG pass/fail — see
 * accessibility/types.ts) and should stay clearly distinguishable in the
 * data, the same way PageReport/ProductReport keep them as separate fields
 * rather than blending accessibility in as a fifth deviation category.
 */
export type OverlayBox = DeviationBox | AccessibilityBox;

/**
 * An instance can deviate across more than one category at once (e.g. off
 * color *and* off spacing). One box gets one color, so it's colored by
 * whichever category has the largest mean normalized deviation for that
 * instance — the category most responsible for the flag — rather than
 * drawing a stack of overlapping boxes per instance.
 */
function dominantCategory(deviations: PropertyDeviation[]): Category {
  const byCategory = new Map<Category, number[]>();
  for (const d of deviations) {
    const category = categoryOf(d.property);
    const list = byCategory.get(category) ?? [];
    list.push(d.normalized);
    byCategory.set(category, list);
  }

  let best: Category = "color";
  let bestMean = -Infinity;
  for (const [category, values] of byCategory) {
    const m = values.reduce((a, b) => a + b, 0) / values.length;
    if (m > bestMean) {
      bestMean = m;
      best = category;
    }
  }
  return best;
}

/**
 * One box per *occurrence*, not per instance — a deviant style repeated
 * many times across a page (e.g. every secondary button) should be
 * visible everywhere it appears, not collapsed to a single sample box.
 * Instances with no captured positions (tag-based fixture extraction,
 * not real-page sampling) contribute no boxes.
 *
 * Returns both deviation boxes (gated by `threshold`, as before) and
 * accessibility boxes (gated by `level === "fail"` — a fixed, non-tunable
 * cutoff, since "passing" isn't a matter of degree the way a deviation
 * score is) in one array — callers (the per-page overlay and the
 * aggregate standalone report) draw and count them together, distinguished
 * by `kind`.
 */
export function buildOverlayBoxes(page: ExtractedPage, pageReport: PageReport, threshold = OVERLAY_SCORE_THRESHOLD): OverlayBox[] {
  const elementsById = new Map<string, ExtractedElement>();
  for (const el of page.elements) elementsById.set(el.instanceId, el);

  const boxes: OverlayBox[] = [];
  for (const component of pageReport.components) {
    for (const instance of component.instances) {
      if (instance.score <= threshold) continue;
      const positions = elementsById.get(instance.instanceId)?.positions ?? [];
      if (positions.length === 0) continue;

      const category = dominantCategory(instance.deviations);
      for (const position of positions) {
        boxes.push({
          kind: "deviation",
          instanceId: instance.instanceId,
          component: instance.component,
          category,
          score: instance.score,
          position,
          deviations: instance.deviations,
        });
      }
    }
  }

  for (const finding of pageReport.accessibility ?? []) {
    if (finding.level !== "fail") continue;
    const positions = elementsById.get(finding.instanceId)?.positions ?? [];
    if (positions.length === 0) continue;

    for (const position of positions) {
      boxes.push({
        kind: "accessibility",
        instanceId: finding.instanceId,
        component: finding.component,
        position,
        finding,
      });
    }
  }

  return boxes;
}

/** Stable, filesystem-safe, collision-resistant base name for a page's generated visual artifacts (shared by the overlay and the corrected-render screenshot). */
export function pageSlug(url: string): string {
  const slug =
    url
      .replace(/^https?:\/\//, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "page";
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 8);
  return `${slug}-${hash}`;
}

export function overlayFilename(url: string): string {
  return `${pageSlug(url)}-overlay.html`;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Plain-English tooltip body, one sentence per line — same humanizeDeviation used for the worst-offenders table, reused here rather than the raw property/value/distance format. */
function deviationBoxLabel(box: DeviationBox, spec: TokenSpec): string {
  return box.deviations
    .filter((d) => categoryOf(d.property) === box.category)
    .map((d) => humanizeDeviation(d, resolveToken(d.nearestToken, spec)))
    .join("\n");
}

function boxColor(box: OverlayBox): string {
  return box.kind === "accessibility" ? ACCESSIBILITY_COLOR : CATEGORY_COLORS[box.category];
}

/** Already-written plain English for accessibility (finding.humanReadable, no re-humanization needed); resolves + humanizes on the fly for deviations. */
function boxTitle(box: OverlayBox, spec: TokenSpec): string {
  if (box.kind === "accessibility") {
    return `${box.component} #${box.instanceId} — contrast ${box.finding.ratio.toFixed(1)}:1 (${box.finding.level})\n${box.finding.humanReadable}`;
  }
  return `${box.component} #${box.instanceId} — score ${box.score.toFixed(1)}\n${deviationBoxLabel(box, spec)}`;
}

/** Shared `<style>` body for both the standalone per-page overlay and the aggregate standalone report — kept in one place so the two never drift apart. */
export const OVERLAY_CSS = `
  .legend { position: sticky; top: 0; z-index: 10; background: #222; color: #eee; padding: 8px 12px; display: flex; gap: 16px; align-items: center; font-size: 13px; }
  .legend-item { display: flex; align-items: center; gap: 6px; }
  .swatch { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }
  .count { margin-left: auto; color: #999; }
  .stage { position: relative; display: inline-block; }
  .stage img { display: block; max-width: none; }
  .dev-box { position: absolute; border: 2px solid; background: rgba(255, 255, 255, 0.08); box-sizing: border-box; cursor: help; }
`;

/** The sticky legend bar: page URL, category color key (deviations + accessibility), flagged-occurrence count. */
export function renderOverlayLegend(pageUrl: string, boxes: OverlayBox[]): string {
  const legend = (Object.entries(CATEGORY_COLORS) as [Category, string][])
    .map(([category, color]) => `<span class="legend-item"><span class="swatch" style="background:${color}"></span>${category}</span>`)
    .join("");
  const accessibilityItem = `<span class="legend-item"><span class="swatch" style="background:${ACCESSIBILITY_COLOR}"></span>accessibility (WCAG fail)</span>`;

  const deviationCount = boxes.filter((b) => b.kind === "deviation").length;
  const accessibilityCount = boxes.filter((b) => b.kind === "accessibility").length;

  return `<div class="legend">
  <strong>${escapeHtml(pageUrl)}</strong>
  ${legend}
  ${accessibilityItem}
  <span class="count">${deviationCount} deviation${deviationCount === 1 ? "" : "s"} (score &gt; ${OVERLAY_SCORE_THRESHOLD}), ${accessibilityCount} contrast failure${accessibilityCount === 1 ? "" : "s"}</span>
</div>`;
}

/** The screenshot + absolutely-positioned finding boxes (deviations and accessibility failures alike) on top of it. `screenshotSrc` should be a `data:` URI so the markup has no outside file dependency wherever it's embedded. */
export function renderOverlayStage(screenshotSrc: string, boxes: OverlayBox[], spec: TokenSpec): string {
  const boxDivs = boxes
    .map((box) => {
      const title = escapeHtml(boxTitle(box, spec));
      return `<div class="dev-box" style="left:${box.position.x}px;top:${box.position.y}px;width:${box.position.width}px;height:${box.position.height}px;border-color:${boxColor(box)};" title="${title}"></div>`;
    })
    .join("\n  ");

  return `<div class="stage">
  <img src="${screenshotSrc}" alt="page screenshot">
  ${boxDivs}
</div>`;
}

/**
 * Standalone HTML overlay: the captured screenshot as a background image
 * with absolutely-positioned, color-coded boxes drawn over every flagged
 * occurrence. `screenshotSrc` goes straight into the `<img src>` — pass a
 * `data:` URI (see writePageOverlays), not a file path, so the generated
 * file has no dependency on cache/, the report directory, or any relative
 * path surviving outside the checkout that produced it.
 */
export function renderOverlayHtml(pageUrl: string, screenshotSrc: string, boxes: OverlayBox[], spec: TokenSpec): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Deviation overlay - ${escapeHtml(pageUrl)}</title>
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a1a; }
${OVERLAY_CSS}
</style>
</head>
<body>
${renderOverlayLegend(pageUrl, boxes)}
${renderOverlayStage(screenshotSrc, boxes, spec)}
</body>
</html>
`;
}
