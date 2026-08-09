import { describe, it, expect } from "vitest";
import { primerAdapter } from "../src/adapters/primer.js";

describe("primerAdapter", () => {
  it("produces a spec that satisfies the internal TokenSpec shape", () => {
    // primerAdapter() calls validateTokenSpec() internally — if the
    // installed @primer/primitives version changes its JSON shape in a
    // way we don't handle, this throws here rather than silently shipping
    // a broken spec.
    expect(() => primerAdapter()).not.toThrow();
  });

  it("includes a non-trivial color palette for both light and dark themes", () => {
    const spec = primerAdapter();
    expect(Object.keys(spec.colors).length).toBeGreaterThan(100);
    expect(spec.themes?.dark).toBeDefined();
    expect(Object.keys(spec.themes!.dark).length).toBeGreaterThan(100);
  });

  it("collapses 8-digit alpha hex colors to 6-digit", () => {
    const spec = primerAdapter();
    for (const hex of Object.values(spec.colors)) {
      expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("converts rem-based spacing and radius scales to px", () => {
    const spec = primerAdapter();
    // Primer's base spacing scale (0.125rem-1.5rem) — asserting the known
    // real values, not just "some numbers", so a silent unit-conversion
    // regression would fail this.
    expect(spec.spacing).toEqual(expect.arrayContaining([4, 8, 16, 24]));
    expect(spec.radius.length).toBeGreaterThan(0);
    for (const r of spec.radius) expect(r).toBeGreaterThan(0);
  });

  it("extracts the real GitHub sans-serif font stack's primary family", () => {
    const spec = primerAdapter();
    expect(spec.fontFamily).toContain("Mona Sans VF");
  });

  it("extracts a fontWeight scale from the base typography tokens", () => {
    const spec = primerAdapter();
    expect(spec.fontWeight).toEqual(expect.arrayContaining([400, 500]));
  });
});
