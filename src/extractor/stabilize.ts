import type { Page } from "playwright";

/**
 * Best-effort selectors for the handful of consent-management platforms
 * that cover most sites. Non-fatal by design: a page with no banner (or an
 * unrecognized one) just proceeds — this is a nicety, not a requirement,
 * and real Level-2 targets will still show up as noisy elements if a
 * banner is missed rather than silently corrupting the whole capture.
 */
const COOKIE_BANNER_SELECTORS = [
  "#onetrust-accept-btn-handler",
  "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "button:has-text('Accept all')",
  "button:has-text('Accept All')",
  "button:has-text('Accept')",
];

/** Disables CSS animations/transitions so resolved styles are stable across captures. */
export async function disableAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }`,
  });
}

export async function dismissCookieBanners(page: Page): Promise<void> {
  for (const selector of COOKIE_BANNER_SELECTORS) {
    try {
      await page.locator(selector).first().click({ timeout: 1500 });
      return;
    } catch {
      // not present or not clickable — try the next selector
    }
  }
}

/**
 * Scrolls to the bottom and back so lazy-loaded/IntersectionObserver-gated
 * content renders before capture, then waits for the resulting network
 * activity to settle.
 */
export async function triggerLazyLoad(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  try {
    await page.waitForLoadState("networkidle", { timeout: 5000 });
  } catch {
    // some pages never go fully idle (polling, websockets) — proceed anyway
  }
}

export async function stabilizePage(page: Page): Promise<void> {
  await dismissCookieBanners(page);
  await disableAnimations(page);
  await triggerLazyLoad(page);
}
