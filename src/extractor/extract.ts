import { chromium, type Browser } from "playwright";
import { pathToFileURL } from "node:url";
import type { ExtractedElement, ExtractedPage } from "./types.js";

/**
 * Which nodes get measured is driven by markup, not CSS-selector guessing:
 * any element carrying `data-component="<name>"` is one extractable
 * instance, grouped under `<name>` for the aggregator's rollup. This is a
 * deliberate MVP simplification (see brief's "Storybook vs live app" open
 * decision) — a real integration will need router/DOM-driven discovery,
 * but explicit tagging is what makes the synthetic fixtures deterministic.
 * `data-bde-state` (optional) distinguishes instances within a component,
 * e.g. the same button's default/hover/error states.
 */
const EXTRACT_SCRIPT = () => {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-component]"));
  return nodes.map((el, i) => {
    const cs = window.getComputedStyle(el);
    return {
      component: el.getAttribute("data-component") ?? "unknown",
      instanceId: el.getAttribute("data-bde-state") ?? `${el.tagName.toLowerCase()}-${i}`,
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
    };
  });
};

export interface ExtractOptions {
  /** Disable CSS animations/transitions before capture so styles are stable (brief's "stabilization" step). */
  disableAnimations?: boolean;
}

async function extractFromPage(browser: Browser, url: string, pageId: string, opts: ExtractOptions): Promise<ExtractedPage> {
  const page = await browser.newPage();
  try {
    if (opts.disableAnimations !== false) {
      await page.addStyleTag({
        content: `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }`,
      });
    }
    await page.goto(url, { waitUntil: "networkidle" });
    const elements = (await page.evaluate(EXTRACT_SCRIPT)) as ExtractedElement[];
    return { page: pageId, elements };
  } finally {
    await page.close();
  }
}

/** Local filesystem path (fixture .html) -> file:// URL Playwright can navigate to. */
export function fileUrl(path: string): string {
  return pathToFileURL(path).href;
}

/**
 * Drives a headless Chromium instance and extracts resolved styles for
 * every tagged element on each target. One browser instance is reused
 * across targets to keep synthetic-fixture test runs fast.
 */
export async function extractPages(targets: { url: string; pageId: string }[], opts: ExtractOptions = {}): Promise<ExtractedPage[]> {
  const browser = await chromium.launch();
  try {
    const results: ExtractedPage[] = [];
    for (const target of targets) {
      results.push(await extractFromPage(browser, target.url, target.pageId, opts));
    }
    return results;
  } finally {
    await browser.close();
  }
}
