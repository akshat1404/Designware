import { describe, it, expect, afterEach } from "vitest";
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { writeReport } from "../src/report/report.js";
import type { CrawlTarget } from "../src/targets/types.js";
import type { PageReport, ProductReport } from "../src/aggregator/aggregate.js";

const TEST_KEY = "test-report-target";

afterEach(() => {
  rmSync(path.resolve(process.cwd(), "reports", TEST_KEY), { recursive: true, force: true });
});

const target: CrawlTarget = {
  key: TEST_KEY,
  label: "Test Target",
  kind: "real-app",
  urls: ["https://example.com/"],
};

const scoredPage: PageReport = {
  page: "https://example.com/",
  components: [],
  score: 42.5,
  breakdown: [],
};

const report: ProductReport = {
  product: "Test Target",
  pages: [scoredPage],
  score: 42.5,
  breakdown: [{ property: "color", meanNormalized: 0.7, count: 3 }],
  worstOffenders: [
    {
      page: "https://example.com/",
      component: "button",
      instanceId: "abc123",
      property: "color",
      rawValue: "rgb(0, 200, 80)",
      nearestToken: "colors.brand-primary",
      distance: 40,
      normalized: 0.9,
    },
  ],
  unstablePages: ["https://example.com/broken"],
};

describe("writeReport", () => {
  it("writes report.json with the full target and report data", () => {
    writeReport(target, report);
    const jsonPath = path.resolve(process.cwd(), "reports", TEST_KEY, "report.json");
    const parsed = JSON.parse(readFileSync(jsonPath, "utf-8"));
    expect(parsed.target.key).toBe(TEST_KEY);
    expect(parsed.report.score).toBe(42.5);
  });

  it("writes a human-readable summary.md with score, breakdown, offenders, and unstable pages", () => {
    writeReport(target, report);
    const mdPath = path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md");
    const summary = readFileSync(mdPath, "utf-8");
    expect(summary).toContain("42.5 / 100");
    expect(summary).toContain("color");
    expect(summary).toContain("colors.brand-primary");
    expect(summary).toContain("https://example.com/broken");
  });

  it("flags on-spec targets with a note that they should score near zero", () => {
    writeReport({ ...target, kind: "on-spec" }, report);
    const mdPath = path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md");
    const summary = readFileSync(mdPath, "utf-8");
    expect(summary).toMatch(/treat that as a matcher bug/i);
  });

  it('reports "N/A" rather than a misleading 0.0/100 when every page was excluded as unstable', () => {
    const allUnstable: ProductReport = { ...report, pages: [], unstablePages: target.urls };
    writeReport(target, allUnstable);
    const mdPath = path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md");
    const summary = readFileSync(mdPath, "utf-8");
    expect(summary).toContain("N/A");
    expect(summary).not.toContain("0.0 / 100");
  });
});
