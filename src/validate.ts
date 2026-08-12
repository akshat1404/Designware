import { registry, type RegisteredTarget } from "./targets/registry.js";
import { readCache, writeCache } from "./cache/cache.js";
import { samplePages } from "./extractor/sample.js";
import { scoreProduct } from "./aggregator/aggregate.js";
import { writeReport } from "./report/report.js";
import type { ExtractedPage } from "./extractor/types.js";

/** Between live (non-cached) requests within a target — politeness, not a rate-limit workaround. */
const REQUEST_DELAY_MS = 500;

function parseArgs(): { targetKey: string | undefined; refresh: boolean } {
  const args = process.argv.slice(2);
  const targetArg = args.find((a) => a.startsWith("--target="));
  return {
    targetKey: targetArg?.split("=")[1],
    refresh: args.includes("--refresh"),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTarget(entry: RegisteredTarget, refresh: boolean): Promise<void> {
  const { target, adapter } = entry;
  console.log(`\n=== ${target.label} (${target.key}) ===`);
  const spec = await adapter();

  const pages: ExtractedPage[] = [];
  for (const url of target.urls) {
    const cached = refresh ? undefined : readCache(target.key, url);
    if (cached) {
      console.log(`  cached   ${url}`);
      pages.push(cached);
      continue;
    }
    console.log(`  fetching ${url}`);
    const [fetched] = await samplePages([{ url, pageId: url }], target.key, spec);
    writeCache(target.key, url, fetched);
    pages.push(fetched);
    await sleep(REQUEST_DELAY_MS);
  }

  const report = scoreProduct(target.label, pages, spec);
  writeReport(target, report, pages);
  console.log(`  score: ${report.score.toFixed(1)} / 100  ->  reports/${target.key}/summary.md`);
}

async function main(): Promise<void> {
  const { targetKey, refresh } = parseArgs();
  if (!targetKey) {
    console.error("usage: validate --target=<key>|all [--refresh]");
    console.error(`known targets: ${registry.map((e) => e.target.key).join(", ") || "(none registered yet)"}`);
    process.exit(1);
  }

  const entries = targetKey === "all" ? registry : registry.filter((e) => e.target.key === targetKey);
  if (entries.length === 0) {
    console.error(`no registered target matching "${targetKey}". known: ${registry.map((e) => e.target.key).join(", ") || "(none registered yet)"}`);
    process.exit(1);
  }

  for (const entry of entries) {
    await runTarget(entry, refresh);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
