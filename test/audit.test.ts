import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, rmSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { main, slugify, deriveLabel, UsageError } from "../src/audit.js";
import { fileUrl } from "../src/extractor/extract.js";
import { TokenSpecError } from "../src/schema/tokenSpec.js";
import { registry } from "../src/targets/registry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(__dirname, "..", "fixtures");
const TOKEN_SPEC_PATH = path.join(FIXTURES, "token-spec.json");
const FIXTURE_HTML = path.join(FIXTURES, "audit-sample.html");
const FIXTURE_URL = fileUrl(FIXTURE_HTML);

const TARGET_KEY = "test-audit-target";
const ONSPEC_KEY = "test-audit-target-onspec";

function cleanup(key: string) {
  rmSync(path.resolve(process.cwd(), "reports", key), { recursive: true, force: true });
  rmSync(path.resolve(process.cwd(), "cache", key), { recursive: true, force: true });
}

afterAll(() => {
  cleanup(TARGET_KEY);
  cleanup(ONSPEC_KEY);
});

describe("slugify", () => {
  it("lowercases and hyphenates, stripping non-alphanumerics", () => {
    expect(slugify("My Company!")).toBe("my-company");
  });

  it("falls back to a generic slug when nothing alphanumeric survives", () => {
    expect(slugify("***")).toBe("site");
  });
});

describe("deriveLabel", () => {
  it("derives a label from a URL's hostname", () => {
    expect(deriveLabel("https://example.com/about")).toBe("example.com");
  });

  it("falls back to the raw URL for a file:// URL, which has no hostname", () => {
    expect(deriveLabel(FIXTURE_URL)).toBe(FIXTURE_URL);
  });
});

describe("audit entrypoint — usage errors", () => {
  it("rejects with UsageError, not a crash, when --spec is missing", async () => {
    await expect(main([`--urls=${FIXTURE_URL}`])).rejects.toThrow(UsageError);
    await expect(main([`--urls=${FIXTURE_URL}`])).rejects.toThrow(/--spec/);
  });

  it("rejects with UsageError when neither --urls nor --urls-file is given", async () => {
    await expect(main([`--spec=${TOKEN_SPEC_PATH}`])).rejects.toThrow(UsageError);
    await expect(main([`--spec=${TOKEN_SPEC_PATH}`])).rejects.toThrow(/--urls/);
  });

  it("rejects an invalid --kind value", async () => {
    await expect(main([`--spec=${TOKEN_SPEC_PATH}`, `--urls=${FIXTURE_URL}`, "--kind=bogus"])).rejects.toThrow(/--kind/);
  });

  it("names the failing path, not a raw ENOENT, when the spec file doesn't exist", async () => {
    const missingPath = path.join(FIXTURES, "does-not-exist.json");
    await expect(main([`--spec=${missingPath}`, `--urls=${FIXTURE_URL}`])).rejects.toThrow(missingPath);
  });

  it("surfaces TokenSpecError's own field-level message directly for a malformed spec, not a wrapped generic one", async () => {
    const tmpDir = mkdtempSync(path.join(os.tmpdir(), "audit-test-"));
    const badSpecPath = path.join(tmpDir, "bad-spec.json");
    writeFileSync(badSpecPath, JSON.stringify({ colors: {} }), "utf-8");

    await expect(main([`--spec=${badSpecPath}`, `--urls=${FIXTURE_URL}`])).rejects.toThrow(TokenSpecError);
    await expect(main([`--spec=${badSpecPath}`, `--urls=${FIXTURE_URL}`])).rejects.toThrow(/colors.*must define at least one color/);
  });
});

describe("audit entrypoint — end to end", () => {
  it("runs the full pipeline from an ad-hoc spec + URL, with zero registry involvement", async () => {
    expect(registry.some((e) => e.target.key === TARGET_KEY)).toBe(false);

    const report = await main([`--spec=${TOKEN_SPEC_PATH}`, `--urls=${FIXTURE_URL}`, "--label=Test Audit Target", `--key=${TARGET_KEY}`]);

    expect(report.pages.length).toBeGreaterThan(0);
    expect(report.score).toBeGreaterThanOrEqual(0);

    const reportJsonPath = path.resolve(process.cwd(), "reports", TARGET_KEY, "report.json");
    const parsed = JSON.parse(readFileSync(reportJsonPath, "utf-8"));
    expect(parsed.target.key).toBe(TARGET_KEY);
    expect(parsed.target.label).toBe("Test Audit Target");
    // No --kind given -> defaults to "real-app", not silently something else.
    expect(parsed.target.kind).toBe("real-app");
    expect(parsed.report.pages.length).toBeGreaterThan(0);

    // report.html/summary.md/overlay also get produced for free, same as any registered target.
    expect(() => readFileSync(path.resolve(process.cwd(), "reports", TARGET_KEY, "report.html"), "utf-8")).not.toThrow();
    expect(() => readFileSync(path.resolve(process.cwd(), "reports", TARGET_KEY, "summary.md"), "utf-8")).not.toThrow();
  }, 60_000);

  it("derives label/key from the URL and defaults kind to real-app when both are omitted", async () => {
    const report = await main([`--spec=${TOKEN_SPEC_PATH}`, `--urls=${FIXTURE_URL}`, `--key=${TARGET_KEY}`]);
    expect(report.product).toBe(deriveLabel(FIXTURE_URL));

    const parsed = JSON.parse(readFileSync(path.resolve(process.cwd(), "reports", TARGET_KEY, "report.json"), "utf-8"));
    expect(parsed.target.label).toBe(deriveLabel(FIXTURE_URL));
    expect(parsed.target.kind).toBe("real-app");
  }, 60_000);

  it("respects an explicit --kind=on-spec override", async () => {
    await main([`--spec=${TOKEN_SPEC_PATH}`, `--urls=${FIXTURE_URL}`, `--key=${ONSPEC_KEY}`, "--kind=on-spec"]);
    const parsed = JSON.parse(readFileSync(path.resolve(process.cwd(), "reports", ONSPEC_KEY, "report.json"), "utf-8"));
    expect(parsed.target.kind).toBe("on-spec");
  }, 60_000);
});
