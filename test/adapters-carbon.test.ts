import { describe, it, expect } from "vitest";
import { carbonAdapter } from "../src/adapters/carbon.js";

describe("carbonAdapter", () => {
  it("produces a spec that satisfies the internal TokenSpec shape", () => {
    expect(() => carbonAdapter()).not.toThrow();
  });

  it("includes a non-trivial color palette for both the white and g100 (dark) themes", () => {
    const spec = carbonAdapter();
    expect(Object.keys(spec.colors).length).toBeGreaterThan(100);
    expect(spec.themes?.dark).toBeDefined();
    expect(Object.keys(spec.themes!.dark).length).toBeGreaterThan(100);
  });

  it("collapses rgba() AI-overlay tokens and 8-digit hex to 6-digit hex", () => {
    const spec = carbonAdapter();
    for (const hex of Object.values(spec.colors)) {
      expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("converts the real spacing/layout scale from rem to px", () => {
    const spec = carbonAdapter();
    // @carbon/layout's documented spacing01-13 scale (0.125rem-10rem) -> px.
    expect(spec.spacing).toEqual(expect.arrayContaining([2, 4, 8, 16, 24, 32]));
  });

  it("extracts a fontSize and fontWeight scale from the theme-independent typography tokens", () => {
    const spec = carbonAdapter();
    expect(spec.fontSize.length).toBeGreaterThan(3);
    expect(spec.fontWeight).toEqual(expect.arrayContaining([400]));
  });

  it("falls back to a disclosed [0] radius scale (no radius token in the installed packages)", () => {
    const spec = carbonAdapter();
    expect(spec.radius).toEqual([0]);
  });

  it("falls back to a disclosed IBM Plex Sans font family (not exposed by the installed packages)", () => {
    const spec = carbonAdapter();
    expect(spec.fontFamily).toContain("IBM Plex Sans");
  });
});
