import { describe, it, expect } from "vitest";
import {
  buildOverlayBoxes,
  overlayFilename,
  renderOverlayLegend,
  renderOverlayStage,
  CATEGORY_COLORS,
  ACCESSIBILITY_COLOR,
  OVERLAY_SCORE_THRESHOLD,
  type DeviationBox,
  type OverlayBox,
} from "../src/report/overlay.js";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import { humanizeDeviation } from "../src/report/humanize.js";
import { resolveToken } from "../src/matchers/resolve.js";
import type { PageReport, ComponentReport, InstanceReport } from "../src/aggregator/aggregate.js";
import type { CapturedStyles, ExtractedElement, ExtractedPage, Position } from "../src/extractor/types.js";
import type { PropertyDeviation } from "../src/matchers/types.js";
import type { AccessibilityFinding } from "../src/accessibility/types.js";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF" },
  spacing: [4, 8, 16],
  radius: [4, 8],
  fontSize: [12, 16, 24],
  fontFamily: ["Arial", "sans-serif"],
  fontWeight: [400, 700],
});

/** Narrows a box to DeviationBox, failing loudly if the test set it up wrong. */
function asDeviationBox(box: OverlayBox): DeviationBox {
  if (box.kind !== "deviation") throw new Error(`expected a deviation box, got kind=${box.kind}`);
  return box;
}

const STYLES: CapturedStyles = {
  color: "rgb(0, 0, 0)",
  backgroundColor: "rgba(0, 0, 0, 0)",
  borderTopColor: "rgba(0, 0, 0, 0)",
  borderTopWidth: "0px",
  borderTopStyle: "none",
  borderTopLeftRadius: "0px",
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "400",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
};

function deviation(overrides: Partial<PropertyDeviation> = {}): PropertyDeviation {
  return {
    property: "color",
    rawValue: "rgb(0, 0, 0)",
    nearestToken: "colors.brand-primary",
    distance: 10,
    normalized: 0.5,
    ...overrides,
  };
}

function instance(overrides: Partial<InstanceReport> = {}): InstanceReport {
  return {
    component: "button",
    instanceId: "inst1",
    deviations: [deviation()],
    score: 50,
    ...overrides,
  };
}

function pageReport(instances: InstanceReport[], accessibility: AccessibilityFinding[] = []): PageReport {
  const component: ComponentReport = { component: "button", instances, score: 0 };
  return { page: "https://example.com/", components: [component], score: 0, breakdown: [], accessibility };
}

function accessibilityFinding(overrides: Partial<AccessibilityFinding> = {}): AccessibilityFinding {
  return {
    page: "https://example.com/",
    component: "p/text",
    instanceId: "a11y1",
    ratio: 1.2,
    level: "fail",
    isLargeText: false,
    fontSize: 16,
    fontWeight: 400,
    color: "rgb(255, 255, 255)",
    effectiveBackground: "rgb(255, 255, 255)",
    backgroundResolved: true,
    humanReadable: "text here is barely readable against its background — 1.2:1, needs at least 4.5:1 for AA",
    ...overrides,
  };
}

function extractedElement(instanceId: string, positions: Position[]): ExtractedElement {
  return { component: "button", instanceId, styles: STYLES, positions };
}

function extractedPage(elements: ExtractedElement[]): ExtractedPage {
  return { page: "https://example.com/", elements };
}

describe("buildOverlayBoxes", () => {
  it("includes only instances whose score clears the threshold", () => {
    const low = instance({ instanceId: "low", score: 10 });
    const high = instance({ instanceId: "high", score: 20 });
    const page = pageReport([low, high]);
    const extracted = extractedPage([
      extractedElement("low", [{ x: 0, y: 0, width: 10, height: 10 }]),
      extractedElement("high", [{ x: 5, y: 5, width: 10, height: 10 }]),
    ]);

    const boxes = buildOverlayBoxes(extracted, page);
    expect(boxes.map((b) => b.instanceId)).toEqual(["high"]);
  });

  it("treats a score exactly at the threshold as not meaningful (strictly greater-than)", () => {
    const atThreshold = instance({ instanceId: "at", score: OVERLAY_SCORE_THRESHOLD });
    const page = pageReport([atThreshold]);
    const extracted = extractedPage([extractedElement("at", [{ x: 0, y: 0, width: 10, height: 10 }])]);

    expect(buildOverlayBoxes(extracted, page)).toHaveLength(0);
  });

  it("respects a custom threshold override", () => {
    const inst = instance({ instanceId: "custom", score: 5 });
    const page = pageReport([inst]);
    const extracted = extractedPage([extractedElement("custom", [{ x: 0, y: 0, width: 10, height: 10 }])]);

    expect(buildOverlayBoxes(extracted, page, 1)).toHaveLength(1);
    expect(buildOverlayBoxes(extracted, page, 10)).toHaveLength(0);
  });

  it("colors a box by whichever category has the largest mean normalized deviation", () => {
    const inst = instance({
      instanceId: "mixed",
      score: 50,
      deviations: [
        deviation({ property: "color", normalized: 0.9 }),
        deviation({ property: "spacing", normalized: 0.1, nearestToken: "spacing:8", detail: "padding-top" }),
        deviation({ property: "spacing", normalized: 0.15, nearestToken: "spacing:8", detail: "padding-left" }),
      ],
    });
    const page = pageReport([inst]);
    const extracted = extractedPage([extractedElement("mixed", [{ x: 0, y: 0, width: 10, height: 10 }])]);

    const box = asDeviationBox(buildOverlayBoxes(extracted, page)[0]);
    expect(box.category).toBe("color");
    expect(CATEGORY_COLORS[box.category]).toBe(CATEGORY_COLORS.color);
  });

  it("switches the dominant category when a different category's mean is larger", () => {
    const inst = instance({
      instanceId: "mixed2",
      score: 50,
      deviations: [deviation({ property: "color", normalized: 0.2 }), deviation({ property: "spacing", normalized: 0.8, nearestToken: "spacing:8" })],
    });
    const page = pageReport([inst]);
    const extracted = extractedPage([extractedElement("mixed2", [{ x: 0, y: 0, width: 10, height: 10 }])]);

    const box = asDeviationBox(buildOverlayBoxes(extracted, page)[0]);
    expect(box.category).toBe("spacing");
  });

  it("produces one box per position for a multi-occurrence instance — none lost, none duplicated", () => {
    const positions: Position[] = [
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 20, y: 0, width: 10, height: 10 },
      { x: 40, y: 0, width: 10, height: 10 },
    ];
    const inst = instance({ instanceId: "repeated", score: 40 });
    const page = pageReport([inst]);
    const extracted = extractedPage([extractedElement("repeated", positions)]);

    const boxes = buildOverlayBoxes(extracted, page);
    expect(boxes).toHaveLength(3);
    expect(boxes.map((b) => b.position)).toEqual(positions);
    expect(boxes.every((b) => b.instanceId === "repeated")).toBe(true);
  });

  it("produces no boxes for an above-threshold instance with no captured positions", () => {
    const inst = instance({ instanceId: "noPos", score: 40 });
    const page = pageReport([inst]);
    const extracted = extractedPage([extractedElement("noPos", [])]);

    expect(buildOverlayBoxes(extracted, page)).toHaveLength(0);
  });

  describe("accessibility findings", () => {
    it("boxes only fail-level findings, not AA/AAA passes", () => {
      const findings = [
        accessibilityFinding({ instanceId: "failing", level: "fail" }),
        accessibilityFinding({ instanceId: "passingAA", level: "AA" }),
        accessibilityFinding({ instanceId: "passingAAA", level: "AAA" }),
      ];
      const page = pageReport([], findings);
      const extracted = extractedPage([
        extractedElement("failing", [{ x: 0, y: 0, width: 10, height: 10 }]),
        extractedElement("passingAA", [{ x: 20, y: 0, width: 10, height: 10 }]),
        extractedElement("passingAAA", [{ x: 40, y: 0, width: 10, height: 10 }]),
      ]);

      const boxes = buildOverlayBoxes(extracted, page);
      expect(boxes.map((b) => b.instanceId)).toEqual(["failing"]);
      expect(boxes[0].kind).toBe("accessibility");
    });

    it("looks up positions via instanceId, same as deviation boxes, and produces one box per occurrence", () => {
      const positions: Position[] = [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 30, y: 0, width: 10, height: 10 },
      ];
      const finding = accessibilityFinding({ instanceId: "repeatedA11y", level: "fail" });
      const page = pageReport([], [finding]);
      const extracted = extractedPage([extractedElement("repeatedA11y", positions)]);

      const boxes = buildOverlayBoxes(extracted, page);
      expect(boxes).toHaveLength(2);
      expect(boxes.map((b) => b.position)).toEqual(positions);
      expect(boxes.every((b) => b.kind === "accessibility")).toBe(true);
    });

    it("produces no box for a failing finding with no captured positions", () => {
      const finding = accessibilityFinding({ instanceId: "noPosA11y", level: "fail" });
      const page = pageReport([], [finding]);
      const extracted = extractedPage([extractedElement("noPosA11y", [])]);

      expect(buildOverlayBoxes(extracted, page)).toHaveLength(0);
    });

    it("keeps deviation and accessibility boxes both present and distinguishable when a page has both", () => {
      const inst = instance({ instanceId: "devInst", score: 40 });
      const finding = accessibilityFinding({ instanceId: "a11yInst", level: "fail" });
      const page = pageReport([inst], [finding]);
      const extracted = extractedPage([
        extractedElement("devInst", [{ x: 0, y: 0, width: 10, height: 10 }]),
        extractedElement("a11yInst", [{ x: 20, y: 0, width: 10, height: 10 }]),
      ]);

      const boxes = buildOverlayBoxes(extracted, page);
      expect(boxes).toHaveLength(2);
      expect(boxes.map((b) => b.kind).sort()).toEqual(["accessibility", "deviation"]);
    });
  });
});

describe("overlay tooltips", () => {
  it("renders a deviation box's tooltip using humanizeDeviation, not the raw property/value/distance format", () => {
    const dev = deviation({ property: "color", rawValue: "rgb(0, 0, 0)", nearestToken: "colors.brand-primary" });
    const inst = instance({ instanceId: "tooltipDev", score: 50, deviations: [dev] });
    const page = pageReport([inst]);
    const extracted = extractedPage([extractedElement("tooltipDev", [{ x: 0, y: 0, width: 10, height: 10 }])]);
    const boxes = buildOverlayBoxes(extracted, page);

    const html = renderOverlayStage("data:image/png;base64,x", boxes, spec);
    const expectedSentence = humanizeDeviation(dev, resolveToken(dev.nearestToken, spec));

    expect(html).toContain(expectedSentence);
    // The old raw format is gone — no more "-> colors.brand-primary (distance ...)".
    expect(html).not.toMatch(/\(distance \d/);
  });

  it("renders an accessibility box's tooltip using the finding's own humanReadable sentence directly", () => {
    const finding = accessibilityFinding({ instanceId: "tooltipA11y", humanReadable: "text here is barely readable against its background — 1.2:1, needs at least 4.5:1 for AA" });
    const page = pageReport([], [finding]);
    const extracted = extractedPage([extractedElement("tooltipA11y", [{ x: 0, y: 0, width: 10, height: 10 }])]);
    const boxes = buildOverlayBoxes(extracted, page);

    const html = renderOverlayStage("data:image/png;base64,x", boxes, spec);
    expect(html).toContain(finding.humanReadable);
  });

  it("colors an accessibility box with ACCESSIBILITY_COLOR, not one of the four category colors", () => {
    const finding = accessibilityFinding({ instanceId: "colorA11y" });
    const page = pageReport([], [finding]);
    const extracted = extractedPage([extractedElement("colorA11y", [{ x: 0, y: 0, width: 10, height: 10 }])]);
    const boxes = buildOverlayBoxes(extracted, page);

    const html = renderOverlayStage("data:image/png;base64,x", boxes, spec);
    expect(html).toContain(`border-color:${ACCESSIBILITY_COLOR}`);
    expect(Object.values(CATEGORY_COLORS)).not.toContain(ACCESSIBILITY_COLOR);
  });
});

describe("renderOverlayLegend", () => {
  it("includes an accessibility color/count entry alongside the four category entries when there's at least one accessibility box", () => {
    const finding = accessibilityFinding({ instanceId: "legendA11y" });
    const page = pageReport([], [finding]);
    const extracted = extractedPage([extractedElement("legendA11y", [{ x: 0, y: 0, width: 10, height: 10 }])]);
    const boxes = buildOverlayBoxes(extracted, page);

    const legend = renderOverlayLegend(page.page, boxes);
    expect(legend).toContain(ACCESSIBILITY_COLOR);
    expect(legend).toMatch(/accessibility/i);
    expect(legend).toContain("1 contrast failure");
    for (const color of Object.values(CATEGORY_COLORS)) {
      expect(legend).toContain(color);
    }
  });
});

describe("overlayFilename", () => {
  it("is stable for the same URL", () => {
    expect(overlayFilename("https://example.com/foo")).toBe(overlayFilename("https://example.com/foo"));
  });

  it("differs for URLs that would otherwise slug identically", () => {
    const a = overlayFilename("https://example.com/foo");
    const b = overlayFilename("https://example.com/foo/");
    expect(a).not.toBe(b);
  });
});
