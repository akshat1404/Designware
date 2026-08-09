import { describe, it, expect } from "vitest";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import { scoreElement, scoreProduct } from "../src/aggregator/aggregate.js";
import type { ExtractedElement, ExtractedPage, CapturedStyles } from "../src/extractor/types.js";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF", "brand-text": "#111111", surface: "#FFFFFF" },
  spacing: [4, 8, 16, 24, 32],
  radius: [4, 8, 16],
  fontSize: [12, 14, 16, 20, 24],
  fontFamily: ["Arial", "sans-serif"],
  fontWeight: [400, 700],
});

const COMPLIANT_STYLES: CapturedStyles = {
  color: "rgb(17, 17, 17)", // brand-text
  backgroundColor: "rgb(255, 255, 255)", // surface
  borderTopColor: "rgb(51, 102, 255)", // brand-primary
  borderTopWidth: "2px",
  borderTopStyle: "solid",
  borderTopLeftRadius: "8px",
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "400",
  paddingTop: "8px",
  paddingRight: "8px",
  paddingBottom: "8px",
  paddingLeft: "8px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
};

function element(overrides: Partial<CapturedStyles> = {}, component = "Widget", instanceId = "default"): ExtractedElement {
  return { component, instanceId, styles: { ...COMPLIANT_STYLES, ...overrides } };
}

describe("scoreElement border-color handling", () => {
  it("scores an on-spec border with zero deviation", () => {
    const result = scoreElement(element(), spec);
    const border = result.deviations.find((d) => d.property === "border-color");
    expect(border).toBeDefined();
    expect(border!.distance).toBeCloseTo(0, 3);
  });

  it("flags an off-spec border color", () => {
    const result = scoreElement(element({ borderTopColor: "rgb(0, 200, 80)" }), spec);
    const border = result.deviations.find((d) => d.property === "border-color");
    expect(border).toBeDefined();
    expect(border!.normalized).toBeGreaterThan(0.5);
  });

  it("skips border-color entirely when border-style is none", () => {
    const result = scoreElement(element({ borderTopStyle: "none", borderTopColor: "rgb(0, 200, 80)" }), spec);
    expect(result.deviations.find((d) => d.property === "border-color")).toBeUndefined();
  });

  it("skips border-color entirely when border width is zero", () => {
    const result = scoreElement(element({ borderTopWidth: "0px", borderTopColor: "rgb(0, 200, 80)" }), spec);
    expect(result.deviations.find((d) => d.property === "border-color")).toBeUndefined();
  });

  it("skips border-color when the border color is transparent", () => {
    const result = scoreElement(element({ borderTopColor: "rgba(0, 0, 0, 0)" }), spec);
    expect(result.deviations.find((d) => d.property === "border-color")).toBeUndefined();
  });
});

describe("scoreProduct breakdown and worst offenders", () => {
  const compliantPage: ExtractedPage = { page: "compliant-page", elements: [element()] };
  const deviantPage: ExtractedPage = {
    page: "deviant-page",
    elements: [
      element({ fontSize: "18px" }, "Deviant", "big-font"),
      element({ borderTopColor: "rgb(0, 200, 80)" }, "Deviant", "bad-border"),
    ],
  };

  it("groups mean normalized deviation by property kind", () => {
    const report = scoreProduct("test-product", [compliantPage, deviantPage], spec);
    const fontSizeBreakdown = report.breakdown.find((b) => b.property === "font-size");
    expect(fontSizeBreakdown).toBeDefined();
    expect(fontSizeBreakdown!.count).toBe(3); // one per element across both pages
    expect(fontSizeBreakdown!.meanNormalized).toBeGreaterThan(0);
    expect(fontSizeBreakdown!.meanNormalized).toBeLessThan(1);
  });

  it("sorts worst offenders by normalized deviation descending and caps at the limit", () => {
    const report = scoreProduct("test-product", [compliantPage, deviantPage], spec, 3);
    expect(report.worstOffenders.length).toBe(3);
    for (let i = 1; i < report.worstOffenders.length; i++) {
      expect(report.worstOffenders[i - 1].normalized).toBeGreaterThanOrEqual(report.worstOffenders[i].normalized);
    }
    const top = report.worstOffenders[0];
    expect(top.normalized).toBeGreaterThan(0.5);
    expect(top.page).toBe("deviant-page");
    expect(top.component).toBe("Deviant");
  });
});
