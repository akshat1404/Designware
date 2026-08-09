import type { CrawlTarget } from "./types.js";
import type { TokenAdapter } from "../adapters/types.js";

export interface RegisteredTarget {
  target: CrawlTarget;
  adapter: TokenAdapter;
}

/**
 * Populated incrementally, one entry per company, as each adapter is
 * built and validated (see the build order in the project plan) — kept
 * empty here rather than pre-declaring targets whose adapters don't exist
 * yet.
 */
export const registry: RegisteredTarget[] = [];
