import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadTokenSpec, TokenSpecError, type TokenSpec } from "./schema/tokenSpec.js";
import { runCrawlTarget } from "./runCrawlTarget.js";
import type { CrawlTarget, TargetKind } from "./targets/types.js";
import type { ProductReport } from "./aggregator/aggregate.js";

const USAGE =
  'usage: audit --spec=<path to TokenSpec JSON> --urls=<url1,url2,...> [--urls-file=<path, one URL per line>] [--label=<name>] [--key=<slug>] [--kind=real-app|on-spec] [--refresh]';

/**
 * Thrown for bad CLI input (missing/invalid flags) — distinct from
 * TokenSpecError (a malformed *spec*) and any other runtime failure, so the
 * top-level catch can print each kind of failure in its own voice instead
 * of one generic "something went wrong".
 */
export class UsageError extends Error {}

function fail(message: string): never {
  throw new UsageError(`${message}\n${USAGE}`);
}

function flagValue(args: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  const arg = args.find((a) => a.startsWith(prefix));
  return arg?.slice(prefix.length);
}

/** "My Company!" -> "my-company"; falls back to "site" if nothing alphanumeric survives. */
export function slugify(s: string): string {
  return s.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "site";
}

/** Falls back to the first URL's hostname when --label is omitted — file:// URLs have no host, so those fall back to the raw URL rather than an empty string. */
export function deriveLabel(firstUrl: string): string {
  try {
    const hostname = new URL(firstUrl).hostname;
    return hostname || firstUrl;
  } catch {
    return firstUrl;
  }
}

function readUrlsFile(filePath: string): string[] {
  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    fail(`could not read --urls-file "${filePath}": ${code === "ENOENT" ? "file not found" : (e as Error).message}`);
  }
  return content!
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

interface AuditArgs {
  specPath: string;
  urls: string[];
  label: string;
  key: string;
  kind: TargetKind;
  refresh: boolean;
}

function parseArgs(argv: string[]): AuditArgs {
  const specPath = flagValue(argv, "spec");
  if (!specPath) fail("missing required --spec=<path to TokenSpec JSON>");

  const urlsFlag = flagValue(argv, "urls");
  const urlsFileFlag = flagValue(argv, "urls-file");
  const urls = [
    ...(urlsFlag ? urlsFlag.split(",").map((u) => u.trim()).filter((u) => u.length > 0) : []),
    ...(urlsFileFlag ? readUrlsFile(urlsFileFlag) : []),
  ];
  if (urls.length === 0) fail("missing required --urls=<comma-separated URLs> (or --urls-file=<path>)");

  const kindFlag = flagValue(argv, "kind");
  if (kindFlag !== undefined && kindFlag !== "real-app" && kindFlag !== "on-spec") {
    fail(`--kind must be "real-app" or "on-spec", got "${kindFlag}"`);
  }
  // An arbitrary user-supplied site has no guarantee of being a clean
  // baseline the way this project's four hand-verified on-spec targets are
  // (see TargetKind's own doc comment) — default to "real-app" (drift is
  // expected/measured, not treated as a matcher bug) unless the caller
  // explicitly knows this *is* their own design-system site and opts in
  // via --kind=on-spec.
  const kind: TargetKind = (kindFlag as TargetKind | undefined) ?? "real-app";

  const label = flagValue(argv, "label") ?? deriveLabel(urls[0]);
  const key = flagValue(argv, "key") ?? slugify(label);

  return { specPath, urls, label, key, kind, refresh: argv.includes("--refresh") };
}

function loadSpec(specPath: string): TokenSpec {
  let raw: string;
  try {
    raw = readFileSync(specPath, "utf-8");
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    fail(`could not read spec file "${specPath}": ${code === "ENOENT" ? "file not found" : (e as Error).message}`);
  }
  // loadTokenSpec already throws TokenSpecError with specific, field-level
  // messages for both bad-JSON and malformed-shape — let those surface as
  // written rather than wrapping them in something vaguer here.
  return loadTokenSpec(raw!);
}

/**
 * The generic entrypoint: builds a CrawlTarget ad hoc from CLI flags
 * (rather than looking one up in targets/registry.ts) and runs it through
 * the exact same runCrawlTarget pipeline validate.ts uses for registered
 * targets — report.html, the overlay, accessibility checks, and the
 * corrected render all come for free, since none of that logic knows or
 * cares whether a target came from the registry.
 *
 * Takes `argv` explicitly (defaulting to real process.argv) so tests can
 * drive it directly without spawning a subprocess.
 */
export async function main(argv: string[] = process.argv.slice(2)): Promise<ProductReport> {
  const { specPath, urls, label, key, kind, refresh } = parseArgs(argv);
  const spec = loadSpec(specPath);
  const target: CrawlTarget = { key, label, kind, urls };

  console.log(`\n=== ${label} (${key}) ===`);
  const report = await runCrawlTarget(target, spec, refresh);
  console.log(`  score: ${report.pages.length > 0 ? report.score.toFixed(1) + " / 100" : "N/A"}  ->  reports/${key}/summary.md`);
  return report;
}

// Only auto-run when this module is the actual entrypoint (`node dist/src/audit.js`),
// not when a test imports { main } to drive it directly.
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    if (err instanceof UsageError || err instanceof TokenSpecError) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}
