import { readFileSync } from "node:fs";
import { loadTokenSpec, type TokenSpec } from "./schema/tokenSpec.js";
import { extractPages, fileUrl } from "./extractor/extract.js";
import { scoreProduct, type ProductReport } from "./aggregator/aggregate.js";

export interface PipelineTarget {
  /** Local fixture/HTML file path, or a full URL if driving a live app/Storybook. */
  path: string;
  /** Identifier for this page in the report, e.g. "components/button". */
  pageId: string;
}

export interface RunPipelineOptions {
  product: string;
  tokenSpecPath: string;
  targets: PipelineTarget[];
}

function toNavigableUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : fileUrl(path);
}

/**
 * End-to-end run: load spec -> headless-render each target -> extract
 * resolved styles -> match against spec -> aggregate into a product report.
 * This is the whole "Route B" pipeline from the brief, minus crawl/route
 * discovery (targets are supplied explicitly — see the unresolved
 * Storybook-vs-live-app decision).
 */
export async function runPipeline(opts: RunPipelineOptions): Promise<ProductReport> {
  const spec: TokenSpec = loadTokenSpec(readFileSync(opts.tokenSpecPath, "utf-8"));

  const extracted = await extractPages(
    opts.targets.map((t) => ({ url: toNavigableUrl(t.path), pageId: t.pageId }))
  );

  return scoreProduct(opts.product, extracted, spec);
}
