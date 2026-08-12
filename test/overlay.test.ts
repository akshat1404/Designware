import { describe, it, expect } from "vitest";
import { buildOverlayBoxes, overlayFilename, CATEGORY_COLORS, OVERLAY_SCORE_THRESHOLD } from "../src/report/overlay.js";
import type { PageReport, ComponentReport, InstanceReport } from "../src/aggregator/aggregate.js";
import type { CapturedStyles, ExtractedElement, ExtractedPage, Position } from "../src/extractor/types.js";
import type { PropertyDeviation } from "../src/matchers/types.js";

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

function pageReport(instances: InstanceReport[]): PageReport {
  const component: ComponentReport = { component: "button", instances, score: 0 };
  return { page: "https://example.com/", components: [component], score: 0, breakdown: [] };
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

    const [box] = buildOverlayBoxes(extracted, page);
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

    const [box] = buildOverlayBoxes(extracted, page);
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
