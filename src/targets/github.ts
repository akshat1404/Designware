import type { CrawlTarget } from "./types.js";
import type { RegisteredTarget } from "./registry.js";
import { primerAdapter } from "../adapters/primer.js";

// robots.txt (github.com) disallows only /*/*/pulse and /*/*/projects for
// User-agent: * — none of these URLs match either pattern. No dedicated
// "on-spec" target for GitHub per the brief's table (github.com is the
// only listed crawl target for Primer).
const target: CrawlTarget = {
  key: "github",
  label: "GitHub (github.com)",
  kind: "real-app",
  urls: [
    "https://github.com/",
    "https://github.com/about",
    "https://github.com/torvalds/linux",
    "https://github.com/torvalds/linux/issues",
    "https://github.com/torvalds/linux/pulls",
    "https://github.com/torvalds",
  ],
};

export const githubTargets: RegisteredTarget[] = [{ target, adapter: primerAdapter }];
