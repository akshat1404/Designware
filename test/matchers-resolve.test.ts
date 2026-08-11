import { describe, it, expect } from "vitest";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import { resolveToken } from "../src/matchers/resolve.js";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF", surface: "#FFFFFF" },
  themes: { dark: { "brand-primary": "#7A9CFF" } },
  spacing: [4, 8, 16, 24, 32],
  radius: [4, 8, 16],
  fontSize: [12, 14, 16, 20, 24],
  fontFamily: ["Arial", "Helvetica", "sans-serif"],
  fontWeight: [400, 500, 700],
});

describe("resolveToken", () => {
  it("resolves colors.<name> to the spec's hex value", () => {
    expect(resolveToken("colors.brand-primary", spec)).toBe("#3366FF");
  });

  it("resolves theme:<themeName>.<name> to the theme's hex value", () => {
    expect(resolveToken("theme:dark.brand-primary", spec)).toBe("#7A9CFF");
  });

  it("resolves spacing:<value> to the embedded number", () => {
    expect(resolveToken("spacing:16", spec)).toBe(16);
  });

  it("resolves border-radius:<value> to the embedded number", () => {
    expect(resolveToken("border-radius:8", spec)).toBe(8);
  });

  it("resolves font-size:<value> to the embedded number", () => {
    expect(resolveToken("font-size:20", spec)).toBe(20);
  });

  it("resolves font-weight:<value> to the embedded number", () => {
    expect(resolveToken("font-weight:700", spec)).toBe(700);
  });

  it("resolves font-family:<value> to the embedded family string", () => {
    expect(resolveToken("font-family:Helvetica", spec)).toBe("Helvetica");
  });

  it("throws a clear error for an unrecognized prefix", () => {
    expect(() => resolveToken("bogus:whatever", spec)).toThrow(/unrecognized token id/);
  });

  it("throws a clear error when a colors. reference no longer exists in the spec", () => {
    expect(() => resolveToken("colors.retired-color", spec)).toThrow(/no color named "retired-color"/);
  });

  it("throws a clear error when a theme: reference no longer exists in the spec", () => {
    expect(() => resolveToken("theme:dark.retired-color", spec)).toThrow(/no color named "retired-color" in theme "dark"/);
    expect(() => resolveToken("theme:light.brand-primary", spec)).toThrow(/no color named "brand-primary" in theme "light"/);
  });
});
