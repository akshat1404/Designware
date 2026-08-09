import type { CrawlTarget } from "./types.js";
import type { RegisteredTarget } from "./registry.js";
import { carbonAdapter } from "../adapters/carbon.js";

// carbondesignsystem.com robots.txt is "Allow: /" — fully open.
const onSpec: CrawlTarget = {
  key: "carbon-onspec",
  label: "Carbon Design System (carbondesignsystem.com)",
  kind: "on-spec",
  urls: [
    "https://carbondesignsystem.com/",
    "https://carbondesignsystem.com/components/button/usage/",
    "https://carbondesignsystem.com/components/text-input/usage/",
    "https://carbondesignsystem.com/elements/color/overview/",
    "https://carbondesignsystem.com/elements/typography/overview/",
  ],
};

// www.ibm.com robots.txt disallows admin/search/data endpoints — none of
// these marketing pages match any disallowed pattern.
const realApp: CrawlTarget = {
  key: "ibm-real-app",
  label: "IBM (ibm.com)",
  kind: "real-app",
  urls: [
    "https://www.ibm.com/",
    "https://www.ibm.com/products",
    "https://www.ibm.com/consulting",
    "https://www.ibm.com/cloud",
    "https://www.ibm.com/think",
  ],
};

export const carbonTargets: RegisteredTarget[] = [
  { target: onSpec, adapter: carbonAdapter },
  { target: realApp, adapter: carbonAdapter },
];
