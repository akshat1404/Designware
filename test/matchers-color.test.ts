import { describe, it, expect } from "vitest";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import { matchColor } from "../src/matchers/color.js";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF", surface: "#FFFFFF" },
  themes: { dark: { "brand-primary": "#7A9CFF" } },
  spacing: [4, 8, 16, 24, 32],
  radius: [4, 8, 16],
  fontSize: [12, 14, 16, 20, 24],
  fontFamily: ["Arial", "Helvetica", "sans-serif"],
  fontWeight: [400, 500, 700],
});

describe("matchColor", () => {
  it("matches an exact token with zero distance", () => {
    const result = matchColor("rgb(51, 102, 255)", spec);
    expect(result.nearestToken).toBe("colors.brand-primary");
    expect(result.distance).toBeCloseTo(0, 3);
    expect(result.normalized).toBeCloseTo(0, 3);
  });

  it("resolves an opacity variant back to its base token with ~0 deviation", () => {
    const result = matchColor("rgba(51, 102, 255, 0.5)", spec);
    expect(result.nearestToken).toBe("colors.brand-primary");
    expect(result.distance).toBeCloseTo(0, 3);
    expect(result.variantMatch).toBe(true);
  });

  it("matches a dark-theme value against the theme's own token, not the light one", () => {
    const result = matchColor("rgb(122, 156, 255)", spec);
    expect(result.nearestToken).toBe("theme:dark.brand-primary");
    expect(result.distance).toBeCloseTo(0, 1);
    expect(result.variantMatch).toBe(true);
  });

  it("flags an off-brand color as deviant", () => {
    const result = matchColor("rgb(51, 204, 102)", spec);
    expect(result.distance).toBeGreaterThan(10);
    expect(result.normalized).toBeGreaterThan(0.5);
  });
});
