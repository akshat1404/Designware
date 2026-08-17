import { describe, it, expect, afterEach } from "vitest";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { writeReport } from "../src/report/report.js";
import { overlayFilename } from "../src/report/overlay.js";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import type { CrawlTarget } from "../src/targets/types.js";
import type { PageReport, ProductReport } from "../src/aggregator/aggregate.js";
import type { ExtractedPage } from "../src/extractor/types.js";

const TEST_KEY = "test-report-target";

const TEST_SPEC: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF" },
  spacing: [4, 8, 16],
  radius: [4, 8],
  fontSize: [12, 16, 24],
  fontFamily: ["Arial", "sans-serif"],
  fontWeight: [400, 700],
});

// Smallest possible valid PNG (1x1, transparent) — enough to round-trip through readFileSync/base64.
const FAKE_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

afterEach(() => {
  rmSync(path.resolve(process.cwd(), "reports", TEST_KEY), { recursive: true, force: true });
  rmSync(path.resolve(process.cwd(), "cache", TEST_KEY), { recursive: true, force: true });
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
      humanReadable: "color is a different shade than the brand palette — closest match is colors.brand-primary",
    },
  ],
  unstablePages: ["https://example.com/broken"],
};

describe("writeReport", () => {
  it("writes report.json with the full target and report data", () => {
    writeReport(target, report, TEST_SPEC);
    const jsonPath = path.resolve(process.cwd(), "reports", TEST_KEY, "report.json");
    const parsed = JSON.parse(readFileSync(jsonPath, "utf-8"));
    expect(parsed.target.key).toBe(TEST_KEY);
    expect(parsed.report.score).toBe(42.5);
  });

  it("writes a human-readable summary.md with score, breakdown, offenders, and unstable pages", () => {
    writeReport(target, report, TEST_SPEC);
    const mdPath = path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md");
    const summary = readFileSync(mdPath, "utf-8");
    expect(summary).toContain("42.5 / 100");
    expect(summary).toContain("color");
    expect(summary).toContain("colors.brand-primary");
    expect(summary).toContain("https://example.com/broken");
  });

  it("flags on-spec targets with a note that they should score near zero", () => {
    writeReport({ ...target, kind: "on-spec" }, report, TEST_SPEC);
    const mdPath = path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md");
    const summary = readFileSync(mdPath, "utf-8");
    expect(summary).toMatch(/treat that as a matcher bug/i);
  });

  it('reports "N/A" rather than a misleading 0.0/100 when every page was excluded as unstable', () => {
    const allUnstable: ProductReport = { ...report, pages: [], unstablePages: target.urls };
    writeReport(target, allUnstable, TEST_SPEC);
    const mdPath = path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md");
    const summary = readFileSync(mdPath, "utf-8");
    expect(summary).toContain("N/A");
    expect(summary).not.toContain("0.0 / 100");
  });

  it("embeds the overlay's screenshot as a data URI, not a link back into cache/", () => {
    const cacheDir = path.resolve(process.cwd(), "cache", TEST_KEY);
    mkdirSync(cacheDir, { recursive: true });
    const screenshotAbsPath = path.join(cacheDir, "fake.png");
    writeFileSync(screenshotAbsPath, FAKE_PNG);

    const extractedPages: ExtractedPage[] = [
      {
        page: scoredPage.page,
        elements: [],
        screenshotPath: path.relative(process.cwd(), screenshotAbsPath),
      },
    ];

    writeReport(target, report, TEST_SPEC, extractedPages);

    const overlayPath = path.resolve(process.cwd(), "reports", TEST_KEY, overlayFilename(scoredPage.page));
    const overlayHtml = readFileSync(overlayPath, "utf-8");

    expect(overlayHtml).toContain(`data:image/png;base64,${FAKE_PNG.toString("base64")}`);
    expect(overlayHtml).not.toContain("cache");
    expect(overlayHtml).not.toContain("fake.png");
  });

  it("links the standalone report.html from the top of summary.md", () => {
    writeReport(target, report, TEST_SPEC);
    const mdPath = path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md");
    const summary = readFileSync(mdPath, "utf-8");
    expect(summary).toContain("(./report.html)");
  });

  it("writes a self-contained report.html with the score and human-readable offenders, no external file dependencies", () => {
    const cacheDir = path.resolve(process.cwd(), "cache", TEST_KEY);
    mkdirSync(cacheDir, { recursive: true });
    const screenshotAbsPath = path.join(cacheDir, "fake.png");
    writeFileSync(screenshotAbsPath, FAKE_PNG);

    const extractedPages: ExtractedPage[] = [
      {
        page: scoredPage.page,
        elements: [],
        screenshotPath: path.relative(process.cwd(), screenshotAbsPath),
      },
    ];

    writeReport(target, report, TEST_SPEC, extractedPages);

    const htmlPath = path.resolve(process.cwd(), "reports", TEST_KEY, "report.html");
    const html = readFileSync(htmlPath, "utf-8");

    expect(html).toContain("42.5 / 100");
    expect(html).toContain(report.worstOffenders[0].humanReadable);
    expect(html).toContain(`data:image/png;base64,${FAKE_PNG.toString("base64")}`);

    // No dependency on any other file: every src/href is either a data: URI, an
    // in-page #anchor, or absent — nothing pointing at report.json, summary.md,
    // the per-page overlay files, or cache/.
    const externalRefs = [...html.matchAll(/(?:src|href)="([^"]*)"/g)].map((m) => m[1]).filter((ref) => !ref.startsWith("data:") && !ref.startsWith("#"));
    expect(externalRefs).toEqual([]);
    expect(html).not.toContain("cache");
    expect(html).not.toContain("fake.png");
  });

  it("omits the accessibility section from summary.md and report.html when there's nothing to report", () => {
    writeReport(target, report, TEST_SPEC);
    const summary = readFileSync(path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md"), "utf-8");
    const html = readFileSync(path.resolve(process.cwd(), "reports", TEST_KEY, "report.html"), "utf-8");
    expect(summary).not.toContain("WCAG contrast");
    expect(html).not.toContain("WCAG contrast");
  });

  it("adds an accessibility section to summary.md and report.html, separate from the deviation breakdown/offenders", () => {
    const withAccessibility: ProductReport = {
      ...report,
      accessibility: {
        totalChecked: 2,
        passCount: 1,
        failCount: 1,
        worstOffenders: [
          {
            page: "https://example.com/",
            component: "p/text",
            instanceId: "def456",
            ratio: 2.1,
            level: "fail",
            isLargeText: false,
            fontSize: 16,
            fontWeight: 400,
            color: "rgb(255, 255, 255)",
            effectiveBackground: "rgb(238, 238, 238)",
            backgroundResolved: true,
            humanReadable: "text here is barely readable against its background — 2.1:1, needs at least 4.5:1 for AA",
            tieIn: {
              correctedRatio: 4.6,
              correctedLevel: "AA",
              humanReadable: "currently 2.1:1 (fails AA) — the spec token would give you 4.6:1 (passes AA)",
            },
          },
        ],
      },
    };
    writeReport(target, withAccessibility, TEST_SPEC);
    const summary = readFileSync(path.resolve(process.cwd(), "reports", TEST_KEY, "summary.md"), "utf-8");
    const html = readFileSync(path.resolve(process.cwd(), "reports", TEST_KEY, "report.html"), "utf-8");

    for (const doc of [summary, html]) {
      expect(doc).toContain("WCAG contrast");
      expect(doc).toContain("barely readable");
      expect(doc).toContain("the spec token would give you 4.6:1");
      expect(doc).toContain("Checked: 2");
    }
  });

  it("shows the unverified-baseline warning in report.html when target.unverified is set, and omits it otherwise", () => {
    const unverifiedTarget: CrawlTarget = { ...target, unverified: "Could not confirm these pages render actual Polaris components." };
    writeReport(unverifiedTarget, report, TEST_SPEC);
    const unverifiedHtml = readFileSync(path.resolve(process.cwd(), "reports", TEST_KEY, "report.html"), "utf-8");
    expect(unverifiedHtml).toContain("UNVERIFIED ON-SPEC BASELINE");
    expect(unverifiedHtml).toContain("Could not confirm these pages render actual Polaris components.");

    writeReport(target, report, TEST_SPEC);
    const regularHtml = readFileSync(path.resolve(process.cwd(), "reports", TEST_KEY, "report.html"), "utf-8");
    expect(regularHtml).not.toContain("UNVERIFIED ON-SPEC BASELINE");
  });
});
