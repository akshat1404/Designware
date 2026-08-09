import { describe, it, expect } from "vitest";
import { polarisAdapter } from "../src/adapters/polaris.js";

describe("polarisAdapter", () => {
  it("produces a spec that satisfies the internal TokenSpec shape", () => {
    expect(() => polarisAdapter()).not.toThrow();
  });

  it("includes a non-trivial color palette for both light and dark themes", () => {
    const spec = polarisAdapter();
    expect(Object.keys(spec.colors).length).toBeGreaterThan(100);
    expect(spec.themes?.dark).toBeDefined();
    expect(Object.keys(spec.themes!.dark).length).toBeGreaterThan(100);
  });

  it("converts rgba() color tokens to 6-digit hex", () => {
    const spec = polarisAdapter();
    for (const hex of Object.values(spec.colors)) {
      expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("converts the rem-based spacing and radius scales to px", () => {
    const spec = polarisAdapter();
    expect(spec.spacing).toEqual(expect.arrayContaining([4, 8, 16, 24]));
    expect(spec.radius.length).toBeGreaterThan(0);
    for (const r of spec.radius) expect(r).toBeGreaterThanOrEqual(0);
  });

  it("extracts font-size/weight/family from the flat text-* token map", () => {
    const spec = polarisAdapter();
    expect(spec.fontSize.length).toBeGreaterThan(3);
    expect(spec.fontWeight.length).toBeGreaterThan(0);
    expect(spec.fontFamily).toContain("Inter");
  });
});
