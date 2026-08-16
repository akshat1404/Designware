import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { samplePages } from "../src/extractor/sample.js";
import { fileUrl } from "../src/extractor/extract.js";
import { validateTokenSpec, type TokenSpec } from "../src/schema/tokenSpec.js";
import type { ExtractedPage } from "../src/extractor/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.resolve(__dirname, "..", "fixtures", "accessibility.html");
const TARGET_KEY = "test-accessibility-sample";

const spec: TokenSpec = validateTokenSpec({
  colors: { "brand-primary": "#3366FF" },
  spacing: [4, 8, 16],
  radius: [4, 8],
  fontSize: [12, 16, 24],
  fontFamily: ["Arial", "sans-serif"],
  fontWeight: [400, 700],
});

describe("sample.ts effective background resolution (real page sampling)", () => {
  let page: ExtractedPage;

  beforeAll(async () => {
    [page] = await samplePages([{ url: fileUrl(FIXTURE), pageId: "accessibility" }], TARGET_KEY, spec);
  }, 60_000);

  afterAll(() => {
    rmSync(path.resolve(process.cwd(), "cache", TARGET_KEY), { recursive: true, force: true });
  });

  it("resolves a transparent element's background to a colored ancestor two levels up, not white", () => {
    const el = page.elements.find((e) => e.styles.color === "rgb(255, 255, 255)");
    expect(el).toBeDefined();
    expect(el!.styles.effectiveBackgroundColor).toBe("rgb(32, 64, 96)");
    expect(el!.styles.effectiveBackgroundResolved).toBe(true);
  });

  it("falls back to white with resolved:false when nothing in the ancestor chain has a background", () => {
    const el = page.elements.find((e) => e.styles.color === "rgb(51, 51, 51)");
    expect(el).toBeDefined();
    expect(el!.styles.effectiveBackgroundColor).toBe("rgb(255, 255, 255)");
    expect(el!.styles.effectiveBackgroundResolved).toBe(false);
  });

  it("leaves non-text elements without an effective background", () => {
    const wrapper = page.elements.find((e) => e.component === "div" && e.styles.backgroundColor === "rgb(32, 64, 96)");
    expect(wrapper).toBeDefined();
    expect(wrapper!.styles.effectiveBackgroundColor).toBeUndefined();
  });
});
