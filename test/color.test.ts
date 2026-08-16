import { describe, it, expect } from "vitest";
import { parseCssColor, rgbToLab, deltaE2000, deltaE2000Rgb, relativeLuminance, contrastRatio } from "../src/color/convert.js";

describe("parseCssColor", () => {
  it("parses hex 6-digit", () => {
    expect(parseCssColor("#3366FF")).toEqual({ r: 51, g: 102, b: 255, a: 1 });
  });
  it("parses hex 3-digit shorthand", () => {
    expect(parseCssColor("#0f0")).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });
  it("parses rgb()", () => {
    expect(parseCssColor("rgb(51, 102, 255)")).toEqual({ r: 51, g: 102, b: 255, a: 1 });
  });
  it("parses rgba() with alpha", () => {
    expect(parseCssColor("rgba(51, 102, 255, 0.5)")).toEqual({ r: 51, g: 102, b: 255, a: 0.5 });
  });
  it("parses transparent", () => {
    expect(parseCssColor("transparent")).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });
  it("throws on unrecognized format", () => {
    expect(() => parseCssColor("hsl(200, 50%, 50%)")).toThrow();
  });
});

describe("rgbToLab", () => {
  it("maps white to L=100, a=0, b=0", () => {
    const lab = rgbToLab({ r: 255, g: 255, b: 255, a: 1 });
    expect(lab.L).toBeCloseTo(100, 1);
    expect(lab.a).toBeCloseTo(0, 1);
    expect(lab.b).toBeCloseTo(0, 1);
  });
  it("maps black to L=0, a=0, b=0", () => {
    const lab = rgbToLab({ r: 0, g: 0, b: 0, a: 1 });
    expect(lab.L).toBeCloseTo(0, 1);
    expect(lab.a).toBeCloseTo(0, 1);
    expect(lab.b).toBeCloseTo(0, 1);
  });
});

describe("deltaE2000", () => {
  it("is 0 for identical colors", () => {
    const lab = rgbToLab({ r: 51, g: 102, b: 255, a: 1 });
    expect(deltaE2000(lab, lab)).toBeCloseTo(0, 6);
  });

  // Reference vectors from Sharma, Wu & Dalal (2005), "The CIEDE2000
  // Color-Difference Formula: Implementation Notes, Supplementary Test
  // Data, and Mathematical Observations" — the standard correctness check
  // for any CIEDE2000 implementation.
  it.each([
    [{ L: 50.0, a: 2.6772, b: -79.7751 }, { L: 50.0, a: 0.0, b: -82.7485 }, 2.0425],
    [{ L: 50.0, a: 3.1571, b: -77.2803 }, { L: 50.0, a: 0.0, b: -82.7485 }, 2.8615],
    [{ L: 50.0, a: 2.8361, b: -74.02 }, { L: 50.0, a: 0.0, b: -82.7485 }, 3.4412],
    [{ L: 50.0, a: 2.49, b: -0.001 }, { L: 50.0, a: -2.49, b: 0.0009 }, 7.1792],
    [{ L: 60.2574, a: -34.0099, b: 36.2677 }, { L: 60.4626, a: -34.1751, b: 39.4387 }, 1.2644],
    [{ L: 63.0109, a: -31.0961, b: -5.8663 }, { L: 62.8187, a: -29.7946, b: -4.0864 }, 1.263],
    [{ L: 61.2901, a: 3.7196, b: -5.3901 }, { L: 61.4292, a: 2.248, b: -4.962 }, 1.8731],
    [{ L: 35.0831, a: -44.1164, b: 3.7933 }, { L: 35.0232, a: -40.0716, b: 1.5901 }, 1.8645],
  ])("matches reference distance %#", (lab1, lab2, expected) => {
    expect(deltaE2000(lab1, lab2)).toBeCloseTo(expected, 3);
  });

  it("is symmetric", () => {
    const lab1 = rgbToLab({ r: 51, g: 102, b: 255, a: 1 });
    const lab2 = rgbToLab({ r: 200, g: 60, b: 20, a: 1 });
    expect(deltaE2000(lab1, lab2)).toBeCloseTo(deltaE2000(lab2, lab1), 9);
  });
});

describe("deltaE2000Rgb", () => {
  it("reports a large distance between clearly different hues", () => {
    const d = deltaE2000Rgb({ r: 51, g: 102, b: 255, a: 1 }, { r: 51, g: 204, b: 102, a: 1 });
    expect(d).toBeGreaterThan(10);
  });
  it("reports a near-zero distance for a subtle shift", () => {
    const d = deltaE2000Rgb({ r: 51, g: 102, b: 255, a: 1 }, { r: 52, g: 103, b: 255, a: 1 });
    expect(d).toBeLessThan(1);
  });
});

describe("relativeLuminance", () => {
  it("is 1 for white and 0 for black", () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(1, 6);
    expect(relativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBeCloseTo(0, 6);
  });
});

describe("contrastRatio", () => {
  it("is exactly 21:1 for black on white (WCAG's own worked example)", () => {
    expect(contrastRatio({ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(21, 6);
  });

  it("is order-independent", () => {
    const c1 = { r: 20, g: 90, b: 180, a: 1 };
    const c2 = { r: 240, g: 240, b: 230, a: 1 };
    expect(contrastRatio(c1, c2)).toBeCloseTo(contrastRatio(c2, c1), 10);
  });

  it("is 1:1 for identical colors", () => {
    const c = { r: 100, g: 150, b: 200, a: 1 };
    expect(contrastRatio(c, c)).toBeCloseTo(1, 6);
  });

  // #767676 on white is widely cited (WebAIM, and several published design
  // systems' own docs) as the standard "just clears 4.5:1 AA" gray-on-white
  // reference pair — a real published value, not a hand-computed guess.
  it("matches the published #767676-on-white reference ratio", () => {
    const gray = parseCssColor("#767676");
    const white = parseCssColor("#FFFFFF");
    expect(contrastRatio(gray, white)).toBeCloseTo(4.54, 2);
  });
});
