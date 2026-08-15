import { describe, it, expect } from "vitest";
import { humanizeDeviation } from "../src/report/humanize.js";
import type { PropertyDeviation } from "../src/matchers/types.js";

function deviation(overrides: Partial<PropertyDeviation>): PropertyDeviation {
  return {
    property: "spacing",
    rawValue: 10,
    nearestToken: "spacing:8",
    distance: 2,
    normalized: 0.5,
    ...overrides,
  };
}

describe("humanizeDeviation", () => {
  it("spacing: names the raw and resolved px values", () => {
    const sentence = humanizeDeviation(deviation({ property: "spacing", detail: "padding-top", rawValue: 10, nearestToken: "spacing:8" }), 8);
    expect(sentence).toContain("10px");
    expect(sentence).toContain("8px");
    expect(sentence).toContain("padding-top");
  });

  it("border-radius: names the raw/resolved px values and keeps which corner", () => {
    const sentence = humanizeDeviation(
      deviation({ property: "border-radius", detail: "border-top-left-radius", rawValue: 12, nearestToken: "border-radius:8" }),
      8
    );
    expect(sentence).toContain("12px");
    expect(sentence).toContain("8px");
    expect(sentence).toMatch(/top-left/);
  });

  it("font-size: names the raw and resolved px values", () => {
    const sentence = humanizeDeviation(deviation({ property: "font-size", rawValue: 15, nearestToken: "font-size:16" }), 16);
    expect(sentence).toContain("15px");
    expect(sentence).toContain("16px");
  });

  it("font-weight: names the raw and resolved numeric weights", () => {
    const sentence = humanizeDeviation(deviation({ property: "font-weight", rawValue: 500, nearestToken: "font-weight:700" }), 700);
    expect(sentence).toContain("500");
    expect(sentence).toContain("700");
  });

  it("font-family: names both the used stack and the resolved family", () => {
    const sentence = humanizeDeviation(
      deviation({ property: "font-family", rawValue: "-apple-system, sans-serif", nearestToken: "font-family:Atlassian Sans" }),
      "Atlassian Sans"
    );
    expect(sentence).toContain("-apple-system");
    expect(sentence).toContain("Atlassian Sans");
  });

  it("color: names the matched token, not just a hex code", () => {
    const sentence = humanizeDeviation(
      deviation({ property: "color", rawValue: "rgb(0, 200, 80)", nearestToken: "colors.brand-primary", distance: 40, normalized: 0.9 }),
      "#3366FF"
    );
    expect(sentence).toContain("colors.brand-primary");
    expect(sentence).toContain("#3366FF");
  });

  it("background-color: labels it as background, distinct from plain color", () => {
    const sentence = humanizeDeviation(deviation({ property: "background-color", rawValue: "rgb(0, 0, 0)", nearestToken: "colors.surface" }), "#FFFFFF");
    expect(sentence).toMatch(/background/i);
    expect(sentence).toContain("colors.surface");
  });

  it("border-color: labels it as border, distinct from plain color", () => {
    const sentence = humanizeDeviation(
      deviation({ property: "border-color", detail: "border-top-color", rawValue: "rgb(0, 200, 80)", nearestToken: "colors.brand-primary" }),
      "#3366FF"
    );
    expect(sentence).toMatch(/border/i);
    expect(sentence).toContain("colors.brand-primary");
  });
});
