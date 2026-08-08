import { describe, it, expect } from "vitest";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import { matchScale, parsePx } from "../src/matchers/scale.js";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF", surface: "#FFFFFF" },
  spacing: [4, 8, 16, 24, 32],
  radius: [4, 8, 16],
  fontSize: [12, 14, 16, 20, 24],
  fontFamily: ["Arial", "Helvetica", "sans-serif"],
  fontWeight: [400, 500, 700],
});

describe("matchScale", () => {
  it("treats zero as always compliant", () => {
    const result = matchScale("0px", spec.spacing, "spacing");
    expect(result.distance).toBe(0);
    expect(result.normalized).toBe(0);
  });

  it("gives zero distance for an exact scale value", () => {
    const result = matchScale("16px", spec.spacing, "spacing");
    expect(result.distance).toBe(0);
    expect(result.nearestToken).toBe("spacing:16");
  });

  it("computes distance to the nearest rung for an off-scale value", () => {
    // spacing scale [4,8,16,24,32], min gap = 4
    const result = matchScale("20px", spec.spacing, "spacing");
    expect(result.nearestToken).toBe("spacing:16");
    expect(result.distance).toBe(4);
    expect(result.normalized).toBeCloseTo(1, 6);
  });

  it("saturates normalized deviation at 1 beyond the scale's min gap", () => {
    const result = matchScale("100px", spec.spacing, "spacing");
    expect(result.normalized).toBe(1);
  });

  it("parsePx rejects non-px values", () => {
    expect(() => parsePx("1em")).toThrow();
  });
});
