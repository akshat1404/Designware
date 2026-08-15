# Shopify Polaris (shopify.dev) (on-spec)

[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.

**Score: 15.5 / 100** — 0 is fully on-spec, 100 is maximally deviant.

> ⚠️ **UNVERIFIED ON-SPEC BASELINE** — Could not confirm these pages render actual Polaris components — no "Polaris-" classes or Polaris custom elements found in the DOM, and no live-rendered Polaris page (Storybook, polaris-react.shopify.com) is publicly reachable. This is a docs-shell score, not a verified on-spec baseline.
> Do not compare this score against genuine on-spec targets.

Pages scored: 2

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://shopify.dev/docs/api/polaris — [overlay](./shopify-dev-docs-api-polaris-de614150-overlay.html) · [as it should have looked](./shopify-dev-docs-api-polaris-de614150-corrected.png)
- https://shopify.dev/docs/api/polaris/using-polaris-web-components — [overlay](./shopify-dev-docs-api-polaris-using-polaris-web-components-28469e82-overlay.html) · [as it should have looked](./shopify-dev-docs-api-polaris-using-polaris-web-components-28469e82-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-weight | 0.50 | 99 |
| font-size | 0.46 | 99 |
| border-color | 0.37 | 9 |
| color | 0.24 | 99 |
| font-family | 0.21 | 99 |
| background-color | 0.14 | 34 |
| spacing | 0.03 | 792 |
| border-radius | 0.01 | 99 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | a/text | e3b95ae0 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | a/text | d135a0b9 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | header | 1c1269c5 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | nav | e3747254 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | span/text | 3f6bd8fb | font-size: 16 | font-size:14 | 1.00 |
| margin-top is -1px, should be 0px | https://shopify.dev/docs/api/polaris | span/text | 3f6bd8fb | spacing (margin-top): -1 | spacing:0 | 1.00 |
| margin-right is -1px, should be 0px | https://shopify.dev/docs/api/polaris | span/text | 3f6bd8fb | spacing (margin-right): -1 | spacing:0 | 1.00 |
| margin-bottom is -1px, should be 0px | https://shopify.dev/docs/api/polaris | span/text | 3f6bd8fb | spacing (margin-bottom): -1 | spacing:0 | 1.00 |
| margin-left is -1px, should be 0px | https://shopify.dev/docs/api/polaris | span/text | 3f6bd8fb | spacing (margin-left): -1 | spacing:0 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | span/text | 604d0e92 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | span/text | c54d1ea1 | font-size: 16 | font-size:14 | 1.00 |
| using "JetBrains Mono" instead of "Inter" | https://shopify.dev/docs/api/polaris | kbd/text | bf6bd0af | font-family: "JetBrains Mono", Monaco, Consolas, "Lucida Console", monospace | font-family:Inter | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | li/text | f6a2b46b | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | 846c252f | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | f3bf3349 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | adb20d09 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | 09c47f82 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | 5dc62e01 | font-size: 16 | font-size:14 | 1.00 |
| font size is 32px, should be 30px | https://shopify.dev/docs/api/polaris | h1/text | 421a68f7 | font-size: 32 | font-size:30 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | p/text | 7ad329b1 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | footer | b0c27205 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | e3b95ae0 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | d135a0b9 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 5fbc4146 | font-size: 16 | font-size:14 | 1.00 |
| padding-right is 36px, should be 32px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 5fbc4146 | spacing (padding-right): 36 | spacing:32 | 1.00 |
| padding-left is 36px, should be 32px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 5fbc4146 | spacing (padding-left): 36 | spacing:32 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 863009fe | font-size: 16 | font-size:14 | 1.00 |
| padding-right is 36px, should be 32px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 863009fe | spacing (padding-right): 36 | spacing:32 | 1.00 |
| padding-left is 36px, should be 32px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 863009fe | spacing (padding-left): 36 | spacing:32 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | header | 1c1269c5 | font-size: 16 | font-size:14 | 1.00 |
