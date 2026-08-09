import type { CrawlTarget } from "./types.js";
import type { TokenAdapter } from "../adapters/types.js";
import { githubTargets } from "./github.js";

export interface RegisteredTarget {
  target: CrawlTarget;
  adapter: TokenAdapter;
}

/**
 * Populated incrementally, one entry per company, as each adapter is
 * built and validated (see the build order in the project plan).
 */
export const registry: RegisteredTarget[] = [...githubTargets];
