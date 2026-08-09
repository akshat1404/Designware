import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ExtractedPage } from "../extractor/types.js";

const CACHE_ROOT = path.resolve(process.cwd(), "cache");

function cachePath(targetKey: string, url: string): string {
  const hash = createHash("sha256").update(url).digest("hex");
  return path.join(CACHE_ROOT, targetKey, `${hash}.json`);
}

/**
 * Content-addressed extraction cache, keyed by target + URL. Real Level-2
 * targets are live production sites — this is what keeps repeat dev/test
 * runs from re-hitting them; only an explicit refresh bypasses it.
 */
export function readCache(targetKey: string, url: string): ExtractedPage | undefined {
  const file = cachePath(targetKey, url);
  if (!existsSync(file)) return undefined;
  return JSON.parse(readFileSync(file, "utf-8")) as ExtractedPage;
}

export function writeCache(targetKey: string, url: string, page: ExtractedPage): void {
  const file = cachePath(targetKey, url);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(page, null, 2), "utf-8");
}
