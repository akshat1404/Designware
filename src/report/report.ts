import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { PageReport, ProductReport } from "../aggregator/aggregate.js";
import type { CrawlTarget } from "../targets/types.js";
import type { ExtractedPage } from "../extractor/types.js";
import { buildOverlayBoxes, overlayFilename, pageSlug, renderOverlayHtml } from "./overlay.js";
import { writeStandaloneReport } from "./standalone.js";

const REPORTS_ROOT = path.resolve(process.cwd(), "reports");

function summaryMarkdown(target: CrawlTarget, report: ProductReport, overlayLinks: Map<string, string>, correctedLinks: Map<string, string>): string {
  const lines: string[] = [];
  lines.push(`# ${target.label} (${target.kind})`);
  lines.push("");
  lines.push("[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.");
  lines.push("");
  if (report.pages.length === 0) {
    lines.push(`**Score: N/A — every crawled page was excluded as unstable, there is no data to score.**`);
  } else {
    lines.push(`**Score: ${report.score.toFixed(1)} / 100** — 0 is fully on-spec, 100 is maximally deviant.`);
  }
  if (target.unverified) {
    lines.push("");
    lines.push(`> ⚠️ **UNVERIFIED ON-SPEC BASELINE** — ${target.unverified}`);
    lines.push("> Do not compare this score against genuine on-spec targets.");
  } else if (target.kind === "on-spec") {
    lines.push("");
    lines.push("_This is the company's own design-system site — it should score near zero. If it doesn't, treat that as a matcher bug, not real drift._");
  }
  lines.push("");
  lines.push(`Pages scored: ${report.pages.length}${report.unstablePages.length > 0 ? `, excluded as unstable: ${report.unstablePages.length}` : ""}`);

  if (report.unstablePages.length > 0) {
    lines.push("");
    lines.push("## Unstable pages (excluded from score)");
    for (const p of report.unstablePages) lines.push(`- ${p}`);
  }

  if (overlayLinks.size > 0 || correctedLinks.size > 0) {
    lines.push("");
    lines.push("## Visual diagnostics");
    lines.push("");
    lines.push(
      "Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout)."
    );
    lines.push("");
    for (const page of report.pages) {
      const overlay = overlayLinks.get(page.page);
      const corrected = correctedLinks.get(page.page);
      const parts: string[] = [];
      if (overlay) parts.push(`[overlay](./${overlay})`);
      if (corrected) parts.push(`[as it should have looked](./${corrected})`);
      if (parts.length > 0) lines.push(`- ${page.page} — ${parts.join(" · ")}`);
    }
  }

  lines.push("");
  lines.push("## Breakdown by property");
  lines.push("");
  lines.push("| property | mean deviation | n |");
  lines.push("|---|---|---|");
  for (const b of report.breakdown) {
    lines.push(`| ${b.property} | ${b.meanNormalized.toFixed(2)} | ${b.count} |`);
  }

  lines.push("");
  lines.push("## Worst offenders");
  lines.push("");
  lines.push("| what's wrong | page | component | instance | raw value | nearest token | normalized |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const o of report.worstOffenders.slice(0, 30)) {
    const detail = o.detail ? ` (${o.detail})` : "";
    const value = String(o.rawValue).replace(/\|/g, "\\|");
    const humanReadable = o.humanReadable.replace(/\|/g, "\\|");
    lines.push(`| ${humanReadable} | ${o.page} | ${o.component} | ${o.instanceId} | ${o.property}${detail}: ${value} | ${o.nearestToken} | ${o.normalized.toFixed(2)} |`);
  }
  lines.push("");

  if (report.accessibility && report.accessibility.totalChecked > 0) {
    lines.push("## Accessibility — WCAG contrast");
    lines.push("");
    lines.push(
      `_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._`
    );
    lines.push("");
    lines.push(`Checked: ${report.accessibility.totalChecked}, passing: ${report.accessibility.passCount}, failing: ${report.accessibility.failCount}`);
    lines.push("");
    lines.push("| finding | page | component | ratio | level | spec-token fix |");
    lines.push("|---|---|---|---|---|---|");
    for (const f of report.accessibility.worstOffenders) {
      const finding = f.humanReadable.replace(/\|/g, "\\|");
      const fix = f.tieIn ? f.tieIn.humanReadable.replace(/\|/g, "\\|") : "—";
      lines.push(`| ${finding} | ${f.page} | ${f.component} | ${f.ratio.toFixed(1)}:1 | ${f.level} | ${fix} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Writes one overlay HTML file per page that has both a captured
 * screenshot and scored data, alongside the report. Pages with no
 * screenshot (Level 1 fixture runs, which don't call this) or no
 * boxes above the threshold still get skipped/produced gracefully —
 * an overlay with zero boxes is a legitimate "nothing flagged" result.
 *
 * The screenshot is embedded as a base64 data URI rather than linked by
 * relative path: a link back into cache/ (gitignored, never travels with
 * the report) leaves the overlay broken the moment it's opened anywhere
 * other than the exact checkout that produced it. A data URI makes the
 * file genuinely standalone — open it anywhere, hand it to anyone.
 */
function writePageOverlays(dir: string, pages: PageReport[], extractedByUrl: Map<string, ExtractedPage>): Map<string, string> {
  const links = new Map<string, string>();
  for (const pageReport of pages) {
    const extracted = extractedByUrl.get(pageReport.page);
    if (!extracted?.screenshotPath) continue;

    const boxes = buildOverlayBoxes(extracted, pageReport);
    const screenshotAbsPath = path.resolve(process.cwd(), extracted.screenshotPath);
    const screenshotDataUri = `data:image/png;base64,${readFileSync(screenshotAbsPath).toString("base64")}`;

    const filename = overlayFilename(pageReport.page);
    writeFileSync(path.join(dir, filename), renderOverlayHtml(pageReport.page, screenshotDataUri, boxes), "utf-8");
    links.set(pageReport.page, filename);
  }
  return links;
}

/**
 * Copies each page's already-captured corrected-render screenshot (taken
 * in sample.ts, in the same live session as the original capture) from
 * the content-addressed cache into the report directory as a plain,
 * standalone PNG — no HTML wrapper, unlike the overlay, since the point
 * is that it reads as a real screenshot.
 */
function writePageCorrectedScreenshots(dir: string, pages: PageReport[], extractedByUrl: Map<string, ExtractedPage>): Map<string, string> {
  const links = new Map<string, string>();
  for (const pageReport of pages) {
    const extracted = extractedByUrl.get(pageReport.page);
    if (!extracted?.correctedScreenshotPath) continue;

    const srcAbsPath = path.resolve(process.cwd(), extracted.correctedScreenshotPath);
    const filename = `${pageSlug(pageReport.page)}-corrected.png`;
    copyFileSync(srcAbsPath, path.join(dir, filename));
    links.set(pageReport.page, filename);
  }
  return links;
}

/**
 * Writes reports/<target-key>/report.json (full data), summary.md
 * (human-readable), and per-page overlay HTML + corrected-render PNG
 * files for any page in `extractedPages` that carries a screenshot
 * (Level 2 real-page crawls — Level 1 fixture runs don't pass this and
 * simply get no visual artifacts).
 */
export function writeReport(target: CrawlTarget, report: ProductReport, extractedPages: ExtractedPage[] = []): void {
  const dir = path.join(REPORTS_ROOT, target.key);
  mkdirSync(dir, { recursive: true });

  const extractedByUrl = new Map(extractedPages.map((p) => [p.page, p]));
  const overlayLinks = writePageOverlays(dir, report.pages, extractedByUrl);
  const correctedLinks = writePageCorrectedScreenshots(dir, report.pages, extractedByUrl);

  writeFileSync(path.join(dir, "report.json"), JSON.stringify({ target, report }, null, 2), "utf-8");
  writeFileSync(path.join(dir, "summary.md"), summaryMarkdown(target, report, overlayLinks, correctedLinks), "utf-8");
  writeStandaloneReport(dir, target, report, extractedByUrl);
}
