import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { CrawlTarget } from "../targets/types.js";
import type { PageReport, ProductReport } from "../aggregator/aggregate.js";
import type { ExtractedPage } from "../extractor/types.js";
import type { TokenSpec } from "../schema/tokenSpec.js";
import { buildOverlayBoxes, escapeHtml, OVERLAY_CSS, renderOverlayLegend, renderOverlayStage } from "./overlay.js";

function toDataUri(relativePath: string): string {
  const abs = path.resolve(process.cwd(), relativePath);
  return `data:image/png;base64,${readFileSync(abs).toString("base64")}`;
}

/**
 * One page's visual diagnostics inlined directly into the aggregate
 * document: the overlay (screenshot + flagged-deviation boxes, same
 * markup `writePageOverlays` produces per-file) plus the corrected render,
 * both as `data:` URIs so nothing outside this HTML file is required to
 * see them. Pages with no captured screenshot (Level 1 fixture runs)
 * contribute no section, same as the per-file overlay.
 */
function renderPageSection(pageReport: PageReport, extracted: ExtractedPage | undefined, spec: TokenSpec): string {
  if (!extracted?.screenshotPath) return "";

  const boxes = buildOverlayBoxes(extracted, pageReport);
  const screenshotDataUri = toDataUri(extracted.screenshotPath);

  const corrected = extracted.correctedScreenshotPath
    ? `<div class="corrected">
<h4>As it should have looked</h4>
<img src="${toDataUri(extracted.correctedScreenshotPath)}" alt="corrected render of ${escapeHtml(pageReport.page)}">
</div>`
    : "";

  return `<section class="page">
<h3>${escapeHtml(pageReport.page)} — score ${pageReport.score.toFixed(1)}</h3>
<div class="page-visuals">
<div class="overlay">
${renderOverlayLegend(pageReport.page, boxes)}
${renderOverlayStage(screenshotDataUri, boxes, spec)}
</div>
${corrected}
</div>
</section>`;
}

/** Same warning as summaryMarkdown's `> ⚠️ **UNVERIFIED ON-SPEC BASELINE**` banner, ported to HTML — same wording/severity, not a reinvented one, so it reads as the same caveat wherever it's seen. */
function renderUnverifiedBanner(target: CrawlTarget): string {
  if (!target.unverified) return "";
  return `<div class="unverified-banner">
<strong>⚠️ UNVERIFIED ON-SPEC BASELINE</strong> — ${escapeHtml(target.unverified)}
<br>Do not compare this score against genuine on-spec targets.
</div>`;
}

function renderBreakdownTable(report: ProductReport): string {
  const rows = report.breakdown
    .map((b) => `<tr><td>${escapeHtml(b.property)}</td><td>${b.meanNormalized.toFixed(2)}</td><td>${b.count}</td></tr>`)
    .join("\n");
  return `<h2>Breakdown by property</h2>
<table><thead><tr><th>property</th><th>mean deviation</th><th>n</th></tr></thead><tbody>
${rows}
</tbody></table>`;
}

function renderOffendersTable(report: ProductReport): string {
  const rows = report.worstOffenders
    .slice(0, 30)
    .map((o) => {
      const detail = o.detail ? ` (${o.detail})` : "";
      return `<tr><td>${escapeHtml(o.humanReadable)}</td><td>${escapeHtml(o.page)}</td><td>${escapeHtml(o.component)}</td><td>${escapeHtml(o.property)}${escapeHtml(detail)}: ${escapeHtml(String(o.rawValue))}</td><td>${escapeHtml(o.nearestToken)}</td><td>${o.normalized.toFixed(2)}</td></tr>`;
    })
    .join("\n");
  return `<h2>Worst offenders</h2>
<table><thead><tr><th>what's wrong</th><th>page</th><th>component</th><th>raw value</th><th>nearest token</th><th>normalized</th></tr></thead><tbody>
${rows}
</tbody></table>`;
}

/**
 * A separate section, not merged into the breakdown/offenders tables above:
 * WCAG contrast is an external, objective pass/fail against the standard's
 * own thresholds, independent of the brand token spec.
 */
function renderAccessibilitySection(report: ProductReport): string {
  const a = report.accessibility;
  if (!a || a.totalChecked === 0) return "";

  const rows = a.worstOffenders
    .map(
      (f) =>
        `<tr><td>${escapeHtml(f.humanReadable)}</td><td>${escapeHtml(f.page)}</td><td>${escapeHtml(f.component)}</td><td>${f.ratio.toFixed(1)}:1</td><td>${escapeHtml(f.level)}</td><td>${f.tieIn ? escapeHtml(f.tieIn.humanReadable) : "—"}</td></tr>`
    )
    .join("\n");

  return `<h2>Accessibility — WCAG contrast</h2>
<p class="a11y-note">Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass.</p>
<p>Checked: ${a.totalChecked}, passing: ${a.passCount}, failing: ${a.failCount}</p>
<table><thead><tr><th>finding</th><th>page</th><th>component</th><th>ratio</th><th>level</th><th>spec-token fix</th></tr></thead><tbody>
${rows}
</tbody></table>`;
}

/**
 * Renders the whole product report — score, breakdown, worst offenders
 * (with the Part A plain-English sentence as the primary column), and
 * every page's visual diagnostics — as one self-contained HTML document.
 * Every image is a `data:` URI, so the file has no dependency on
 * report.json, summary.md, the per-page overlay files, or cache/: open it
 * anywhere, hand it to anyone, it just works.
 */
export function renderStandaloneReportHtml(target: CrawlTarget, report: ProductReport, extractedByUrl: Map<string, ExtractedPage>, spec: TokenSpec): string {
  const scoreLine =
    report.pages.length === 0
      ? "Score: N/A — every crawled page was excluded as unstable, there is no data to score."
      : `Score: ${report.score.toFixed(1)} / 100 — 0 is fully on-spec, 100 is maximally deviant.`;

  const pageSections = report.pages
    .map((p) => renderPageSection(p, extractedByUrl.get(p.page), spec))
    .filter((s) => s !== "")
    .join("\n");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(target.label)} - design drift report</title>
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a1a; color: #eee; }
  header { padding: 24px; border-bottom: 1px solid #333; }
  h1 { margin: 0 0 8px; }
  .score { font-size: 1.2em; }
  main { padding: 24px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 32px; }
  th, td { border: 1px solid #333; padding: 6px 10px; text-align: left; font-size: 13px; vertical-align: top; }
  th { background: #222; }
  .unverified-banner { margin: 16px 24px 0; padding: 12px 16px; background: #4a2e00; border: 2px solid #d9822b; border-radius: 4px; color: #ffd8a8; font-size: 14px; }
  .a11y-note { color: #999; font-size: 13px; max-width: 70ch; }
  .page { margin-bottom: 40px; border-top: 1px solid #333; padding-top: 16px; }
  .page-visuals { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
  .overlay, .corrected { max-width: 100%; overflow: auto; }
  .corrected img { max-width: 100%; display: block; }
${OVERLAY_CSS}
</style>
</head>
<body>
<header>
<h1>${escapeHtml(target.label)} (${escapeHtml(target.kind)})</h1>
<div class="score">${scoreLine}</div>
</header>
${renderUnverifiedBanner(target)}
<main>
${renderBreakdownTable(report)}
${renderOffendersTable(report)}
${renderAccessibilitySection(report)}
${pageSections}
</main>
</body>
</html>
`;
}

/** Writes reports/<target-key>/report.html — see renderStandaloneReportHtml. */
export function writeStandaloneReport(dir: string, target: CrawlTarget, report: ProductReport, extractedByUrl: Map<string, ExtractedPage>, spec: TokenSpec): void {
  writeFileSync(path.join(dir, "report.html"), renderStandaloneReportHtml(target, report, extractedByUrl, spec), "utf-8");
}
