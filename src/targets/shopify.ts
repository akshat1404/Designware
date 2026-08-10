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
// Checked directly (headless-browser DOM inspection, not assumed): neither
// of these two pages, nor polaris.shopify.com, polaris-react.shopify.com,
// or storybook.polaris.shopify.com (DNS dead), render any element with a
// "Polaris-" class or a Polaris custom element — all roads lead to this
// same generic shopify.dev docs shell. No live-rendered Polaris page is
// reachable without auth, so this target can't serve as a genuine on-spec
// baseline the way carbon-onspec/atlassian-onspec do. Kept (not dropped)
// per your call, but flagged `unverified` so reports don't present it next
// to the real baselines as if it were a fourth.
const onSpec: CrawlTarget = {
  key: "polaris-onspec",
  label: "Shopify Polaris (shopify.dev)",
  kind: "on-spec",
  urls: [
    "https://shopify.dev/docs/api/polaris",
    "https://shopify.dev/docs/api/polaris/using-polaris-web-components",
  ],
  unverified:
    "Could not confirm these pages render actual Polaris components — " +
    "no \"Polaris-\" classes or Polaris custom elements found in the DOM, " +
    "and no live-rendered Polaris page (Storybook, polaris-react.shopify.com) " +
    "is publicly reachable. This is a docs-shell score, not a verified on-spec baseline.",
};

export const shopifyTargets: RegisteredTarget[] = [{ target: onSpec, adapter: polarisAdapter }];
