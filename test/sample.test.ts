import { describe, it, expect } from "vitest";
import { dedupe, type RawSample } from "../src/extractor/sample.js";
import type { CapturedStyles } from "../src/extractor/types.js";

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

function sample(overrides: Partial<RawSample> = {}): RawSample {
  return { tag: "button", isText: false, styles: BUTTON_STYLES, ...overrides };
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
});
