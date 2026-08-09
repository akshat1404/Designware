import { chromium, type Browser } from "playwright";
import { createHash } from "node:crypto";
import type { CapturedStyles, ExtractedElement, ExtractedPage } from "./types.js";
import { stabilizePage } from "./stabilize.js";

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
}

/**
 * Runs entirely inside the page. Real pages have no `data-component`
 * markup to key off of (see extract.ts), so inclusion is driven by what
 * the brief calls out directly: elements with a visible non-transparent
 * background or border, and text-containing leaf nodes.
 */
const SAMPLE_SCRIPT = (): RawSample[] => {
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

  const results: RawSample[] = [];
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("body *"));

  for (const el of nodes) {
    if (!isVisible(el)) continue;
    const cs = getComputedStyle(el);
    const isText = hasDirectText(el);
    if (!isVisibleBackground(cs) && !isVisibleBorder(cs) && !isText) continue;

    results.push({
      tag: el.tagName.toLowerCase(),
      isText,
      styles: {
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
      },
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
  const groups = new Map<string, { component: string; styles: CapturedStyles; count: number }>();

  for (const sample of raw) {
    const component = sample.isText ? `${sample.tag}/text` : sample.tag;
    const signature = styleSignature(sample.styles);
    const key = `${component}|${signature}`;
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      groups.set(key, { component, styles: sample.styles, count: 1 });
    }
  }

  return Array.from(groups.entries()).map(([key, group]) => ({
    component: group.component,
    instanceId: createHash("sha256").update(key).digest("hex").slice(0, 8),
    styles: group.styles,
    count: group.count,
  }));
}

async function samplePage(browser: Browser, url: string, pageId: string): Promise<ExtractedPage> {
  const page = await browser.newPage({
    userAgent:
      "DesignwareBot/0.1 (+brand deviation research; see repo README) Mozilla/5.0 (compatible)",
  });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    await stabilizePage(page);
    const raw = (await page.evaluate(SAMPLE_SCRIPT)) as RawSample[];
    return { page: pageId, elements: dedupe(raw), unstable: raw.length < MIN_RAW_ELEMENTS };
  } catch {
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
 * target's score.
 */
export async function samplePages(targets: { url: string; pageId: string }[]): Promise<ExtractedPage[]> {
  const browser = await chromium.launch();
  try {
    const results: ExtractedPage[] = [];
    for (const target of targets) {
      results.push(await samplePage(browser, target.url, target.pageId));
    }
    return results;
  } finally {
    await browser.close();
  }
}
