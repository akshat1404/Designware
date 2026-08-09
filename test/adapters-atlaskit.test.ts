import { describe, it, expect } from "vitest";
import { atlaskitAdapter } from "../src/adapters/atlaskit.js";

describe("atlaskitAdapter", () => {
  it("produces a spec that satisfies the internal TokenSpec shape", () => {
    expect(() => atlaskitAdapter()).not.toThrow();
  });

  it("includes a non-trivial color palette for both light and dark themes", () => {
    const spec = atlaskitAdapter();
    expect(Object.keys(spec.colors).length).toBeGreaterThan(100);
    expect(spec.themes?.dark).toBeDefined();
    expect(Object.keys(spec.themes!.dark).length).toBeGreaterThan(100);
  });

  it("collapses 8-digit alpha hex colors to 6-digit", () => {
    const spec = atlaskitAdapter();
    for (const hex of Object.values(spec.colors)) {
      expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("includes negative spacing tokens (Atlaskit ships them as real design tokens)", () => {
    const spec = atlaskitAdapter();
    expect(spec.spacing.some((v) => v < 0)).toBe(true);
    expect(spec.spacing).toEqual(expect.arrayContaining([4, 8, 16]));
  });

  it("parses font-size out of Atlaskit's CSS font-shorthand typography tokens", () => {
    const spec = atlaskitAdapter();
    expect(spec.fontSize).toEqual(expect.arrayContaining([12, 14, 16, 20]));
  });

  it("extracts font-family from font.family.* tokens and font-weight from font.weight.* tokens", () => {
    const spec = atlaskitAdapter();
    expect(spec.fontFamily).toContain("Atlassian Sans");
    expect(spec.fontWeight).toEqual(expect.arrayContaining([400, 500, 600]));
  });
});
