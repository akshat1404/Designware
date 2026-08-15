import { createHash } from "node:crypto";
import type { ExtractedElement, ExtractedPage, Position } from "../extractor/types.js";
import type { PageReport } from "../aggregator/aggregate.js";
import { categoryOf, type Category } from "../aggregator/aggregate.js";
import type { PropertyDeviation } from "../matchers/types.js";

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

export interface OverlayBox {
  instanceId: string;
  component: string;
  category: Category;
  score: number;
  position: Position;
  deviations: PropertyDeviation[];
}

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

function boxLabel(box: OverlayBox): string {
  return box.deviations
    .filter((d) => categoryOf(d.property) === box.category)
    .map((d) => `${d.property}${d.detail ? ` (${d.detail})` : ""}: ${d.rawValue} -> ${d.nearestToken} (distance ${d.distance.toFixed(2)})`)
    .join("\n");
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

/** The sticky legend bar: page URL, category color key, flagged-occurrence count. */
export function renderOverlayLegend(pageUrl: string, boxes: OverlayBox[]): string {
  const legend = (Object.entries(CATEGORY_COLORS) as [Category, string][])
    .map(([category, color]) => `<span class="legend-item"><span class="swatch" style="background:${color}"></span>${category}</span>`)
    .join("");

  return `<div class="legend">
  <strong>${escapeHtml(pageUrl)}</strong>
  ${legend}
  <span class="count">${boxes.length} flagged occurrence${boxes.length === 1 ? "" : "s"} (score &gt; ${OVERLAY_SCORE_THRESHOLD})</span>
</div>`;
}

/** The screenshot + absolutely-positioned deviation boxes on top of it. `screenshotSrc` should be a `data:` URI so the markup has no outside file dependency wherever it's embedded. */
export function renderOverlayStage(screenshotSrc: string, boxes: OverlayBox[]): string {
  const boxDivs = boxes
    .map((box) => {
      const color = CATEGORY_COLORS[box.category];
      const title = escapeHtml(`${box.component} #${box.instanceId} — score ${box.score.toFixed(1)}\n${boxLabel(box)}`);
      return `<div class="dev-box" style="left:${box.position.x}px;top:${box.position.y}px;width:${box.position.width}px;height:${box.position.height}px;border-color:${color};" title="${title}"></div>`;
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
export function renderOverlayHtml(pageUrl: string, screenshotSrc: string, boxes: OverlayBox[]): string {
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
${renderOverlayStage(screenshotSrc, boxes)}
</body>
</html>
`;
}
