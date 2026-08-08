import { describe, it, expect } from "vitest";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import { matchFontFamily, matchFontWeight } from "../src/matchers/font.js";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF", surface: "#FFFFFF" },
  spacing: [4, 8, 16, 24, 32],
  radius: [4, 8, 16],
  fontSize: [12, 14, 16, 20, 24],
  fontFamily: ["Arial", "Helvetica", "sans-serif"],
  fontWeight: [400, 500, 700],
});

describe("matchFontFamily", () => {
  it("accepts a stack whose primary family is allowed", () => {
    const result = matchFontFamily("Arial, sans-serif", spec.fontFamily);
    expect(result.distance).toBe(0);
  });

  it("flags a disallowed primary family", () => {
    const result = matchFontFamily('"Comic Sans MS", cursive', spec.fontFamily);
    expect(result.distance).toBe(1);
    expect(result.normalized).toBe(1);
  });
});

describe("matchFontWeight", () => {
  it("gives zero distance for an allowed weight", () => {
    const result = matchFontWeight("700", spec.fontWeight);
    expect(result.distance).toBe(0);
  });

  it("computes distance to the nearest allowed weight", () => {
    const result = matchFontWeight("600", spec.fontWeight);
    expect(result.nearestToken).toBe("font-weight:500");
    expect(result.distance).toBe(100);
    expect(result.normalized).toBe(1);
  });
});
