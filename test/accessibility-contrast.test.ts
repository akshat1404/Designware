import { describe, it, expect } from "vitest";
import { checkElementAccessibility, classifyContrast, isLargeText } from "../src/accessibility/contrast.js";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import type { CapturedStyles, ExtractedElement } from "../src/extractor/types.js";
import type { PropertyDeviation } from "../src/matchers/types.js";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-text": "#111111", surface: "#FFFFFF" },
  spacing: [4, 8, 16],
  radius: [4, 8],
  fontSize: [12, 16, 24],
  fontFamily: ["Arial", "sans-serif"],
  fontWeight: [400, 700],
});

describe("isLargeText", () => {
  it("treats >=24px as large regardless of weight", () => {
    expect(isLargeText(24, 400)).toBe(true);
    expect(isLargeText(23.99, 400)).toBe(false);
  });

  it("treats >=18.66px as large only at weight >=700", () => {
    expect(isLargeText(18.66, 700)).toBe(true);
    expect(isLargeText(18.65, 700)).toBe(false);
    expect(isLargeText(18.66, 699)).toBe(false);
    expect(isLargeText(20, 700)).toBe(true);
  });

  it("treats normal-weight, normal-size text as not large", () => {
    expect(isLargeText(16, 400)).toBe(false);
  });
});

describe("classifyContrast", () => {
  it("classifies normal text at the 4.5/7 AA/AAA boundaries", () => {
    expect(classifyContrast(4.49, false)).toBe("fail");
    expect(classifyContrast(4.5, false)).toBe("AA");
    expect(classifyContrast(6.99, false)).toBe("AA");
    expect(classifyContrast(7, false)).toBe("AAA");
  });

  it("classifies large text at the 3/4.5 AA/AAA boundaries", () => {
    expect(classifyContrast(2.99, true)).toBe("fail");
    expect(classifyContrast(3, true)).toBe("AA");
    expect(classifyContrast(4.49, true)).toBe("AA");
    expect(classifyContrast(4.5, true)).toBe("AAA");
  });
});

const BASE_STYLES: CapturedStyles = {
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
  effectiveBackgroundColor: "rgb(255, 255, 255)",
  effectiveBackgroundResolved: true,
};

function element(overrides: Partial<CapturedStyles> = {}): ExtractedElement {
  return { component: "p/text", instanceId: "x", styles: { ...BASE_STYLES, ...overrides } };
}

describe("checkElementAccessibility", () => {
  it("returns undefined when there's no effective background (fixture extraction, or a non-text element)", () => {
    const el = element({ effectiveBackgroundColor: undefined, effectiveBackgroundResolved: undefined });
    expect(checkElementAccessibility(el, "page-1", [], spec)).toBeUndefined();
  });

  it("reports the ratio and AAA level for a high-contrast pair", () => {
    const el = element({ color: "rgb(0, 0, 0)", effectiveBackgroundColor: "rgb(255, 255, 255)" });
    const finding = checkElementAccessibility(el, "page-1", [], spec)!;
    expect(finding.ratio).toBeCloseTo(21, 4);
    expect(finding.level).toBe("AAA");
    expect(finding.page).toBe("page-1");
  });

  it("reports fail and phrases the shortfall for a low-contrast pair", () => {
    const el = element({ color: "rgb(255, 255, 255)", effectiveBackgroundColor: "rgb(238, 238, 238)" });
    const finding = checkElementAccessibility(el, "page-1", [], spec)!;
    expect(finding.level).toBe("fail");
    expect(finding.humanReadable).toMatch(/barely readable/);
    expect(finding.humanReadable).toContain("4.5:1");
  });

  it("classifies large text (24px) against the 3:1 AA threshold, not the 4.5:1 normal-text one", () => {
    // rgb(148,148,148) on white ~= 3.03:1 — fails normal-text AA, passes large-text AA.
    const el = element({ color: "rgb(148, 148, 148)", fontSize: "24px", effectiveBackgroundColor: "rgb(255, 255, 255)" });
    const finding = checkElementAccessibility(el, "page-1", [], spec)!;
    expect(finding.isLargeText).toBe(true);
    expect(finding.level).toBe("AA");
  });

  it("carries backgroundResolved through from the captured styles", () => {
    const el = element({ effectiveBackgroundResolved: false });
    const finding = checkElementAccessibility(el, "page-1", [], spec)!;
    expect(finding.backgroundResolved).toBe(false);
  });

  it("attaches a tie-in note when correcting a flagged color deviation crosses a pass threshold", () => {
    const el = element({ color: "rgb(200, 200, 200)", effectiveBackgroundColor: "rgb(255, 255, 255)" });
    const colorDeviation: PropertyDeviation = {
      property: "color",
      rawValue: "rgb(200, 200, 200)",
      nearestToken: "colors.brand-text", // resolves to #111111
      distance: 40,
      normalized: 0.9,
    };
    const finding = checkElementAccessibility(el, "page-1", [colorDeviation], spec)!;
    expect(finding.level).toBe("fail");
    expect(finding.tieIn).toBeDefined();
    expect(finding.tieIn!.correctedLevel).not.toBe("fail");
    expect(finding.tieIn!.humanReadable).toContain("spec token would give you");
  });

  it("omits the tie-in note when correcting the deviation doesn't cross a threshold", () => {
    // Captured color is already the brand-text token's own value, so
    // "correcting" it changes nothing — same ratio, same level.
    const el = element({ color: "rgb(17, 17, 17)", effectiveBackgroundColor: "rgb(255, 255, 255)" });
    const colorDeviation: PropertyDeviation = {
      property: "color",
      rawValue: "rgb(17, 17, 17)",
      nearestToken: "colors.brand-text",
      distance: 0,
      normalized: 0,
    };
    const finding = checkElementAccessibility(el, "page-1", [colorDeviation], spec)!;
    expect(finding.level).toBe("AAA");
    expect(finding.tieIn).toBeUndefined();
  });

  it("omits the tie-in note entirely when there's no color/background-color deviation to correct", () => {
    const el = element({ color: "rgb(255, 255, 255)", effectiveBackgroundColor: "rgb(238, 238, 238)" });
    const spacingDeviation: PropertyDeviation = {
      property: "spacing",
      rawValue: 10,
      nearestToken: "spacing:8",
      distance: 2,
      normalized: 0.5,
    };
    const finding = checkElementAccessibility(el, "page-1", [spacingDeviation], spec)!;
    expect(finding.tieIn).toBeUndefined();
  });
});
