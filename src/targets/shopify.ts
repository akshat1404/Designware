import type { CrawlTarget } from "./types.js";
import type { RegisteredTarget } from "./registry.js";
import { polarisAdapter } from "../adapters/polaris.js";

// polaris.shopify.com now redirects to shopify.dev/docs/api/polaris, a
// much thinner "Polaris web components" doc than the classic multi-page
// style guide the brief assumed — it links to exactly one sub-page. Used
// as-is per your call: on-spec target for @shopify/polaris-tokens with a
// smaller sample than the other three companies, not padded out with
// unrelated general shopify.dev docs. admin.shopify.com (the real
// production app) is skipped entirely — behind login, per the brief.
// shopify.dev robots.txt only disallows shipping-partner-platform/
// shop-partners/shop-users API docs, neither of these paths.
const onSpec: CrawlTarget = {
  key: "polaris-onspec",
  label: "Shopify Polaris (shopify.dev)",
  kind: "on-spec",
  urls: [
    "https://shopify.dev/docs/api/polaris",
    "https://shopify.dev/docs/api/polaris/using-polaris-web-components",
  ],
};

export const shopifyTargets: RegisteredTarget[] = [{ target: onSpec, adapter: polarisAdapter }];
