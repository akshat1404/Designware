import { readCache, writeCache } from "./cache/cache.js";
import { samplePages } from "./extractor/sample.js";
import { scoreProduct, type ProductReport } from "./aggregator/aggregate.js";
import { writeReport } from "./report/report.js";
import type { CrawlTarget } from "./targets/types.js";
import type { TokenSpec } from "./schema/tokenSpec.js";
import type { ExtractedPage } from "./extractor/types.js";

/** Between live (non-cached) requests within a target — politeness, not a rate-limit workaround. */
const REQUEST_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Crawls (or reuses the cache for) every URL in `target`, scores the result
 * against `spec`, and writes reports/<target.key>/. This is the one place
 * that actually drives samplePages -> scoreProduct -> writeReport — shared
 * by validate.ts (registry-driven targets, spec from an adapter) and
 * audit.ts (ad-hoc targets built from CLI flags, spec from a local file).
 * Neither caller needs to know or care where the target/spec came from.
 */
export async function runCrawlTarget(target: CrawlTarget, spec: TokenSpec, refresh: boolean, log: (msg: string) => void = console.log): Promise<ProductReport> {
  const pages: ExtractedPage[] = [];
  for (const url of target.urls) {
    const cached = refresh ? undefined : readCache(target.key, url);
    if (cached) {
      log(`  cached   ${url}`);
      pages.push(cached);
      continue;
    }
    log(`  fetching ${url}`);
    const [fetched] = await samplePages([{ url, pageId: url }], target.key, spec);
    writeCache(target.key, url, fetched);
    pages.push(fetched);
    await sleep(REQUEST_DELAY_MS);
  }

  const report = scoreProduct(target.label, pages, spec);
  writeReport(target, report, spec, pages);
  return report;
}
