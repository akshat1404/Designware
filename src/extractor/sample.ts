import { chromium, type Browser } from "playwright";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { CapturedStyles, ExtractedElement, ExtractedPage, Position } from "./types.js";
import { stabilizePage } from "./stabilize.js";
import { screenshotPath, correctedScreenshotPath } from "../cache/cache.js";
import type { TokenSpec } from "../schema/tokenSpec.js";
import type { PropertyKind } from "../matchers/types.js";
import { scoreElement } from "../aggregator/aggregate.js";
import { resolveToken } from "../matchers/resolve.js";

/**
 * Below this many *raw* (pre-dedupe) sampled elements, a page is treated as
 * having failed to render properly (blocked by a banner, still loading, an
 * error page) rather than genuinely minimal — dedupe naturally collapses a
 * consistent design down to very few unique styles, which is a good sign,
 * not an instability signal, so the threshold is checked before dedupe.
 */
export const MIN_RAW_ELEMENTS = 10;

export interface RawSample {
  tag: string;
  isText: boolean;
  styles: CapturedStyles;
  position: Position;
}

/**
 * `"component|styleSignature"` (the exact key `dedupe` groups by) -> CSS
 * property -> corrected value. Built once per page from the *first* walk's
 * scored deviations, then handed back into a *second* run of the same
 * in-page script so every element sharing a flagged style signature gets
 * corrected, wherever it appears.
 */
export type CorrectionMap = Record<string, Record<string, string>>;

/**
 * Runs entirely inside the page. Real pages have no `data-component`
 * markup to key off of (see extract.ts), so inclusion is driven by what
 * the brief calls out directly: elements with a visible non-transparent
 * background or border, and text-containing leaf nodes.
 *
 * Doubles as the correction pass: called a second time (same page, same
 * live DOM, no reload) with a `corrections` map, it re-walks with the
 * identical selection/signature logic and patches any matching element's
 * style in place. Reusing one script for both passes — rather than a
 * second near-duplicate — guarantees the signature computed here always
 * matches the one `dedupe` computed from this same script's first-pass
 * output, with no risk of the two drifting out of sync.
 */
const SAMPLE_SCRIPT = (corrections?: CorrectionMap): RawSample[] => {
  function isVisible(el: HTMLElement): boolean {
    if (el.offsetParent === null && getComputedStyle(el).position !== "fixed") return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    return true;
  }

  function hasDirectText(el: Element): boolean {
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim().length > 0) return true;
    }
    return false;
  }

  function isVisibleBorder(cs: CSSStyleDeclaration): boolean {
    return cs.borderTopStyle !== "none" && parseFloat(cs.borderTopWidth) > 0;
  }

  function isVisibleBackground(cs: CSSStyleDeclaration): boolean {
    const match = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
    if (!match) return false;
    const parts = match[1].split(",").map((v) => parseFloat(v.trim()));
    const alpha = parts.length === 4 ? parts[3] : 1;
    return alpha > 0;
  }

  /**
   * An element's own `background-color` is very often `transparent` — its
   * real visual background is whatever's behind it, inherited up the DOM
   * tree. Walks from the element itself (so an opaque background set on the
   * element directly still wins) up through `parentElement` until it finds
   * one, reusing the same alpha-parsing `isVisibleBackground` already does
   * for inclusion. Falls back to white (flagged via `resolved: false`)
   * rather than silently assuming it when nothing in the chain has one —
   * `<html>`/`<body>` normally do, so this is a rare edge case in practice.
   */
  function resolveEffectiveBackground(el: HTMLElement): { color: string; resolved: boolean } {
    let node: HTMLElement | null = el;
    while (node) {
      const cs = getComputedStyle(node);
      if (isVisibleBackground(cs)) return { color: cs.backgroundColor, resolved: true };
      node = node.parentElement;
    }
    return { color: "rgb(255, 255, 255)", resolved: false };
  }

  const results: RawSample[] = [];
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("body *"));

  for (const el of nodes) {
    if (!isVisible(el)) continue;
    const cs = getComputedStyle(el);
    const isText = hasDirectText(el);
    if (!isVisibleBackground(cs) && !isVisibleBorder(cs) && !isText) continue;

    const tag = el.tagName.toLowerCase();
    const bg = isText ? resolveEffectiveBackground(el) : undefined;
    const styles = {
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      borderTopColor: cs.borderTopColor,
      borderTopWidth: cs.borderTopWidth,
      borderTopStyle: cs.borderTopStyle,
      borderTopLeftRadius: cs.borderTopLeftRadius,
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      marginTop: cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      marginLeft: cs.marginLeft,
      ...(bg ? { effectiveBackgroundColor: bg.color, effectiveBackgroundResolved: bg.resolved } : {}),
    };

    if (corrections) {
      // Same grouping key dedupe() uses ("component|styleSignature") — see
      // that function's own comment for why this one-liner is duplicated
      // here rather than imported: this runs inside the page, dedupe runs
      // in Node, and Playwright's evaluate() can't share a closure across
      // two separate calls.
      const component = isText ? `${tag}/text` : tag;
      const fix = corrections[`${component}|${JSON.stringify(styles)}`];
      if (fix) {
        for (const prop in fix) {
          el.style.setProperty(prop, fix[prop], "important");
        }
      }
    }

    const rect = el.getBoundingClientRect();
    results.push({
      tag,
      isText,
      position: {
        // page-relative, not viewport-relative — a full-page screenshot's
        // coordinate space doesn't depend on scroll offset at capture time.
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      },
      styles,
    });
  }
  return results;
};

function styleSignature(styles: CapturedStyles): string {
  return JSON.stringify(styles);
}

/**
 * Groups raw samples by (tagName-based component proxy, exact style
 * signature) so N identical buttons collapse into one instance carrying a
 * `count`, rather than N separate report entries for the same style.
 */
export function dedupe(raw: RawSample[]): ExtractedElement[] {
  const groups = new Map<string, { component: string; styles: CapturedStyles; positions: Position[] }>();

  for (const sample of raw) {
    const component = sample.isText ? `${sample.tag}/text` : sample.tag;
    const signature = styleSignature(sample.styles);
    const key = `${component}|${signature}`;
    const existing = groups.get(key);
    if (existing) {
      existing.positions.push(sample.position);
    } else {
      groups.set(key, { component, styles: sample.styles, positions: [sample.position] });
    }
  }

  return Array.from(groups.entries()).map(([key, group]) => ({
    component: group.component,
    instanceId: createHash("sha256").update(key).digest("hex").slice(0, 8),
    styles: group.styles,
    positions: group.positions,
    count: group.positions.length,
  }));
}

/**
 * Only properties whose correction can't shift surrounding layout. Spacing
 * and font-size are the obvious reflow risks; font-weight is excluded for
 * the same reason — a heavier weight is frequently wider and can wrap or
 * push neighboring content, same as a font-size change would.
 */
const CORRECTABLE_PROPERTIES: readonly PropertyKind[] = ["color", "background-color", "border-color", "border-radius", "font-family"];

/**
 * Below this normalized deviation, treat an instance's property as already
 * on-spec rather than needing correction. Not 0: matchColor's Delta-E path
 * goes through an RGB -> Lab round trip, which can leave a genuinely exact
 * match at a normalized value like 1e-13 instead of literal 0 — this floor
 * sits far below any real, visually-meaningful deviation (the smallest
 * scale-based normalized "spacing:16" mismatch is already orders of
 * magnitude above it) while safely absorbing that float noise.
 */
const CORRECTION_EPSILON = 1e-3;

/**
 * Scores each deduped element and, for every deviation in a
 * layout-safe property, resolves its nearest token back to a real CSS
 * value. Keyed the same way `dedupe` groups elements, so applying a
 * correction to one matching signature in-page automatically covers every
 * occurrence of it — no position tracking needed here at all.
 */
export function buildCorrections(elements: ExtractedElement[], spec: TokenSpec): CorrectionMap {
  const corrections: CorrectionMap = {};

  for (const el of elements) {
    const { deviations } = scoreElement(el, spec);
    const fixes: Record<string, string> = {};

    for (const d of deviations) {
      if (!CORRECTABLE_PROPERTIES.includes(d.property)) continue;
      if (d.normalized <= CORRECTION_EPSILON) continue;

      const resolved = resolveToken(d.nearestToken, spec);
      fixes[d.property] = d.property === "border-radius" ? `${resolved}px` : d.property === "font-family" ? `"${resolved}"` : String(resolved);
    }

    if (Object.keys(fixes).length > 0) {
      corrections[`${el.component}|${styleSignature(el.styles)}`] = fixes;
    }
  }

  return corrections;
}

async function samplePage(browser: Browser, url: string, pageId: string, targetKey: string, spec: TokenSpec): Promise<ExtractedPage> {
  const page = await browser.newPage({
    userAgent:
      "DesignwareBot/0.1 (+brand deviation research; see repo README) Mozilla/5.0 (compatible)",
  });
  try {
    // Heavy real sites (analytics beacons, chat widgets, personalization
    // scripts) often never go fully network-idle — waiting on it here
    // reliably timed out the whole capture on sites like ibm.com.
    // domcontentloaded is enough to start sampling; stabilizePage's
    // triggerLazyLoad already makes a best-effort, non-fatal networkidle
    // attempt afterward.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await stabilizePage(page);

    const shotAbsPath = screenshotPath(targetKey, url);
    mkdirSync(path.dirname(shotAbsPath), { recursive: true });
    await page.screenshot({ path: shotAbsPath, fullPage: true });

    const raw = (await page.evaluate(SAMPLE_SCRIPT, undefined)) as RawSample[];
    const elements = dedupe(raw);

    // Corrections are applied in this same page/session, not by reloading
    // and re-targeting via the captured positions — a fresh page.goto() is
    // a new render (dynamic content, ad slots, timing, minor layout shift)
    // with no guarantee the DOM lines up with what was just sampled. The
    // overlay doesn't have this problem (it only ever draws on top of the
    // original screenshot), but a corrected *render* needs the actual live
    // DOM patched in place before it closes.
    const corrections = buildCorrections(elements, spec);
    if (Object.keys(corrections).length > 0) {
      await page.evaluate(SAMPLE_SCRIPT, corrections);
    }

    const correctedAbsPath = correctedScreenshotPath(targetKey, url);
    mkdirSync(path.dirname(correctedAbsPath), { recursive: true });
    await page.screenshot({ path: correctedAbsPath, fullPage: true });

    return {
      page: pageId,
      elements,
      unstable: raw.length < MIN_RAW_ELEMENTS,
      screenshotPath: path.relative(process.cwd(), shotAbsPath),
      correctedScreenshotPath: path.relative(process.cwd(), correctedAbsPath),
    };
  } catch (err) {
    console.error(`  capture failed for ${url}: ${(err as Error).message}`);
    return { page: pageId, elements: [], unstable: true };
  } finally {
    await page.close();
  }
}

/**
 * Same shape of entrypoint as extract.ts's extractPages, but for arbitrary
 * real URLs with no markup cooperation — used by Level 2 validation
 * targets. Pages that fail to load or render enough content are marked
 * `unstable` rather than silently contributing a near-empty capture to a
 * target's score. `targetKey` namespaces the saved screenshots the same
 * way the extraction cache is namespaced. `spec` drives the in-page
 * correction pass (see buildCorrections/samplePage).
 */
export async function samplePages(
  targets: { url: string; pageId: string }[],
  targetKey: string,
  spec: TokenSpec
): Promise<ExtractedPage[]> {
  const browser = await chromium.launch();
  try {
    const results: ExtractedPage[] = [];
    for (const target of targets) {
      results.push(await samplePage(browser, target.url, target.pageId, targetKey, spec));
    }
    return results;
  } finally {
    await browser.close();
  }
}
