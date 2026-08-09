import { describe, it, expect, afterEach } from "vitest";
import { rmSync } from "node:fs";
import path from "node:path";
import { readCache, writeCache } from "../src/cache/cache.js";
import type { ExtractedPage } from "../src/extractor/types.js";

const TEST_TARGET = "test-cache-target";

afterEach(() => {
  rmSync(path.resolve(process.cwd(), "cache", TEST_TARGET), { recursive: true, force: true });
});

const samplePage: ExtractedPage = {
  page: "https://example.com/",
  elements: [],
};

describe("cache", () => {
  it("returns undefined for a URL that hasn't been cached", () => {
    expect(readCache(TEST_TARGET, "https://example.com/never-cached")).toBeUndefined();
  });

  it("round-trips a written extraction", () => {
    writeCache(TEST_TARGET, "https://example.com/", samplePage);
    expect(readCache(TEST_TARGET, "https://example.com/")).toEqual(samplePage);
  });

  it("keys distinct URLs independently", () => {
    writeCache(TEST_TARGET, "https://example.com/a", { page: "a", elements: [] });
    writeCache(TEST_TARGET, "https://example.com/b", { page: "b", elements: [] });
    expect(readCache(TEST_TARGET, "https://example.com/a")?.page).toBe("a");
    expect(readCache(TEST_TARGET, "https://example.com/b")?.page).toBe("b");
  });
});
