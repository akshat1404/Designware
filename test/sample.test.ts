import { describe, it, expect } from "vitest";
import { dedupe, type RawSample } from "../src/extractor/sample.js";
import type { CapturedStyles, Position } from "../src/extractor/types.js";

const BUTTON_STYLES: CapturedStyles = {
  color: "rgb(255, 255, 255)",
  backgroundColor: "rgb(51, 102, 255)",
  borderTopColor: "rgba(0, 0, 0, 0)",
  borderTopWidth: "0px",
  borderTopStyle: "none",
  borderTopLeftRadius: "8px",
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "700",
  paddingTop: "8px",
  paddingRight: "16px",
  paddingBottom: "8px",
  paddingLeft: "16px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
};

const DEFAULT_POSITION: Position = { x: 0, y: 0, width: 100, height: 40 };

function sample(overrides: Partial<RawSample> = {}): RawSample {
  return { tag: "button", isText: false, styles: BUTTON_STYLES, position: DEFAULT_POSITION, ...overrides };
}

describe("dedupe", () => {
  it("collapses identical style signatures into one instance with a count", () => {
    const result = dedupe([sample(), sample(), sample()]);
    expect(result).toHaveLength(1);
    expect(result[0].component).toBe("button");
    expect(result[0].count).toBe(3);
  });

  it("keeps distinct style signatures as separate instances", () => {
    const result = dedupe([sample(), sample({ styles: { ...BUTTON_STYLES, fontWeight: "400" } })]);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.count)).toEqual([1, 1]);
  });

  it('suffixes the component with "/text" for text-leaf samples', () => {
    const result = dedupe([sample({ tag: "p", isText: true })]);
    expect(result[0].component).toBe("p/text");
  });

  it("assigns a stable instanceId derived from the style signature", () => {
    const a = dedupe([sample()]);
    const b = dedupe([sample()]);
    expect(a[0].instanceId).toBe(b[0].instanceId);
  });

  it("gives different components the same styles distinct instances", () => {
    const result = dedupe([sample({ tag: "button" }), sample({ tag: "a" })]);
    expect(result).toHaveLength(2);
    expect(new Set(result.map((r) => r.component))).toEqual(new Set(["button", "a"]));
  });

  describe("position capture", () => {
    it("carries one position per occurrence when styles are identical", () => {
      const positions: Position[] = [
        { x: 0, y: 0, width: 100, height: 40 },
        { x: 0, y: 200, width: 100, height: 40 },
        { x: 0, y: 400, width: 100, height: 40 },
      ];
      const result = dedupe(positions.map((position) => sample({ position })));
      expect(result).toHaveLength(1);
      expect(result[0].positions).toEqual(positions);
      expect(result[0].count).toBe(3);
    });

    it("does not lose or duplicate positions when distinct styles interleave with duplicates", () => {
      const posA1: Position = { x: 0, y: 0, width: 100, height: 40 };
      const posA2: Position = { x: 0, y: 300, width: 100, height: 40 };
      const posB1: Position = { x: 50, y: 100, width: 60, height: 20 };

      const result = dedupe([
        sample({ position: posA1 }),
        sample({ styles: { ...BUTTON_STYLES, fontWeight: "400" }, position: posB1 }),
        sample({ position: posA2 }),
      ]);

      expect(result).toHaveLength(2);
      const a = result.find((r) => r.count === 2)!;
      const b = result.find((r) => r.count === 1)!;
      expect(a.positions).toEqual([posA1, posA2]);
      expect(b.positions).toEqual([posB1]);
    });

    it("keeps count equal to positions.length", () => {
      const result = dedupe([sample(), sample(), sample(), sample()]);
      expect(result[0].positions).toHaveLength(4);
      expect(result[0].count).toBe(result[0].positions!.length);
    });
  });
});
