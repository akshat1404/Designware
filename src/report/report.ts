import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ProductReport } from "../aggregator/aggregate.js";
import type { CrawlTarget } from "../targets/types.js";

const REPORTS_ROOT = path.resolve(process.cwd(), "reports");

function summaryMarkdown(target: CrawlTarget, report: ProductReport): string {
  const lines: string[] = [];
  lines.push(`# ${target.label} (${target.kind})`);
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
  lines.push("| page | component | instance | property | value | nearest token | normalized |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const o of report.worstOffenders.slice(0, 30)) {
    const detail = o.detail ? ` (${o.detail})` : "";
    const value = String(o.rawValue).replace(/\|/g, "\\|");
    lines.push(`| ${o.page} | ${o.component} | ${o.instanceId} | ${o.property}${detail} | ${value} | ${o.nearestToken} | ${o.normalized.toFixed(2)} |`);
  }
  lines.push("");

  return lines.join("\n");
}

/** Writes reports/<target-key>/report.json (full data) and summary.md (human-readable). */
export function writeReport(target: CrawlTarget, report: ProductReport): void {
  const dir = path.join(REPORTS_ROOT, target.key);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "report.json"), JSON.stringify({ target, report }, null, 2), "utf-8");
  writeFileSync(path.join(dir, "summary.md"), summaryMarkdown(target, report), "utf-8");
}
