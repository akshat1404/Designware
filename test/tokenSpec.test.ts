import { describe, it, expect } from "vitest";
import { validateTokenSpec, loadTokenSpec, TokenSpecError } from "../src/schema/tokenSpec.js";

const VALID = {
  colors: { "brand-primary": "#3366FF", surface: "#FFFFFF" },
  themes: { dark: { "brand-primary": "#7A9CFF" } },
  spacing: [16, 4, 8],
  radius: [8, 4],
  fontSize: [16, 12],
  fontFamily: ["Arial", "sans-serif"],
  fontWeight: [700, 400],
};

describe("validateTokenSpec", () => {
  it("accepts a well-formed spec and sorts numeric scales ascending", () => {
    const spec = validateTokenSpec(VALID);
    expect(spec.spacing).toEqual([4, 8, 16]);
    expect(spec.radius).toEqual([4, 8]);
    expect(spec.fontSize).toEqual([12, 16]);
    expect(spec.fontWeight).toEqual([400, 700]);
    expect(spec.colors).toEqual(VALID.colors);
    expect(spec.themes).toEqual(VALID.themes);
  });

  it("rejects a non-object", () => {
    expect(() => validateTokenSpec(null)).toThrow(TokenSpecError);
    expect(() => validateTokenSpec("nope")).toThrow(TokenSpecError);
  });

  it("rejects missing colors", () => {
    const { colors, ...rest } = VALID;
    expect(() => validateTokenSpec(rest)).toThrow(/colors/);
  });

  it("rejects an invalid hex value", () => {
    expect(() => validateTokenSpec({ ...VALID, colors: { primary: "blue" } })).toThrow(/hex/);
  });

  it("rejects a non-array spacing field", () => {
    expect(() => validateTokenSpec({ ...VALID, spacing: 16 })).toThrow(/spacing/);
  });

  it("rejects an empty fontFamily array", () => {
    expect(() => validateTokenSpec({ ...VALID, fontFamily: [] })).toThrow(/fontFamily/);
  });

  it("rejects a malformed theme entry", () => {
    expect(() => validateTokenSpec({ ...VALID, themes: { dark: { primary: "not-a-hex" } } })).toThrow(/theme/);
  });
});

describe("loadTokenSpec", () => {
  it("parses valid JSON text", () => {
    const spec = loadTokenSpec(JSON.stringify(VALID));
    expect(spec.colors["brand-primary"]).toBe("#3366FF");
  });

  it("throws a TokenSpecError on invalid JSON", () => {
    expect(() => loadTokenSpec("{not json")).toThrow(TokenSpecError);
  });
});
