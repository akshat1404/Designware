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
| font-weight | 0.50 | 101 |
| font-size | 0.46 | 101 |
| border-color | 0.37 | 9 |
| color | 0.25 | 101 |
| font-family | 0.21 | 101 |
| background-color | 0.14 | 34 |
| spacing | 0.03 | 808 |
| border-radius | 0.01 | 101 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | a/text | 4f16eaa0 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | a/text | 107cf6bf | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | header | 1c1269c5 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | nav | e3747254 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | span/text | e4c2d8fe | font-size: 16 | font-size:14 | 1.00 |
| margin-top is -1px, should be 0px | https://shopify.dev/docs/api/polaris | span/text | e4c2d8fe | spacing (margin-top): -1 | spacing:0 | 1.00 |
| margin-right is -1px, should be 0px | https://shopify.dev/docs/api/polaris | span/text | e4c2d8fe | spacing (margin-right): -1 | spacing:0 | 1.00 |
| margin-bottom is -1px, should be 0px | https://shopify.dev/docs/api/polaris | span/text | e4c2d8fe | spacing (margin-bottom): -1 | spacing:0 | 1.00 |
| margin-left is -1px, should be 0px | https://shopify.dev/docs/api/polaris | span/text | e4c2d8fe | spacing (margin-left): -1 | spacing:0 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | span/text | 95184ef3 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | span/text | 4fdb2281 | font-size: 16 | font-size:14 | 1.00 |
| using "JetBrains Mono" instead of "Inter" | https://shopify.dev/docs/api/polaris | kbd/text | cc1348ea | font-family: "JetBrains Mono", Monaco, Consolas, "Lucida Console", monospace | font-family:Inter | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | li/text | ad1895b0 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | 846c252f | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | f3bf3349 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | adb20d09 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | 09c47f82 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | div | 5dc62e01 | font-size: 16 | font-size:14 | 1.00 |
| font size is 32px, should be 30px | https://shopify.dev/docs/api/polaris | h1/text | 3f8254dd | font-size: 32 | font-size:30 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | p/text | b7a25426 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris | footer | b0c27205 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 4f16eaa0 | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 107cf6bf | font-size: 16 | font-size:14 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 753f0985 | font-size: 16 | font-size:14 | 1.00 |
| padding-right is 36px, should be 32px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 753f0985 | spacing (padding-right): 36 | spacing:32 | 1.00 |
| padding-left is 36px, should be 32px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 753f0985 | spacing (padding-left): 36 | spacing:32 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 1ba78d67 | font-size: 16 | font-size:14 | 1.00 |
| padding-right is 36px, should be 32px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 1ba78d67 | spacing (padding-right): 36 | spacing:32 | 1.00 |
| padding-left is 36px, should be 32px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 1ba78d67 | spacing (padding-left): 36 | spacing:32 | 1.00 |
| font size is 16px, should be 14px | https://shopify.dev/docs/api/polaris/using-polaris-web-components | header | 1c1269c5 | font-size: 16 | font-size:14 | 1.00 |

## Accessibility — WCAG contrast

_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._

Checked: 71, passing: 68, failing: 3

| finding | page | component | ratio | level | spec-token fix |
|---|---|---|---|---|---|
| text here is barely readable against its background — 1.5:1, needs at least 4.5:1 for AA | https://shopify.dev/docs/api/polaris | li/text | 1.5:1 | fail | — |
| text here is barely readable against its background — 1.5:1, needs at least 4.5:1 for AA | https://shopify.dev/docs/api/polaris/using-polaris-web-components | li/text | 1.5:1 | fail | — |
| text here is barely readable against its background — 3.9:1, needs at least 4.5:1 for AA | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 3.9:1 | fail | currently 3.9:1 (fails AA) — the spec token would give you 5.6:1 (passes AA) |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | button/text | 4.6:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | div/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | div/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | div/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | div/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris | span/text | 4.7:1 | AA | — |
| text here passes AA at 4.7:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 4.7:1 | AA | — |
| text here passes AAA at 4.9:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 4.9:1 | AAA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 4.9:1 | AA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 4.9:1 | AA | — |
| text here passes AA at 6.1:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris | span/text | 6.1:1 | AA | — |
| text here passes AA at 6.1:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.1:1 | AA | — |
| text here passes AA at 6.1:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | button/text | 6.1:1 | AA | currently 6.1:1 (passes AA) — the spec token would give you 7.3:1 (passes AAA) |
| text here passes AA at 6.3:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris | a/text | 6.3:1 | AA | — |
| text here passes AA at 6.3:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris | span/text | 6.3:1 | AA | — |
| text here passes AA at 6.3:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris | a/text | 6.3:1 | AA | — |
| text here passes AA at 6.3:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 6.3:1 | AA | — |
| text here passes AA at 6.3:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.3:1 | AA | — |
| text here passes AA at 6.3:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 6.3:1 | AA | — |
| text here passes AA at 6.3:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.3:1 | AA | — |
| text here passes AA at 6.3:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.3:1 | AA | — |
| text here passes AA at 6.5:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.5:1 | AA | — |
| text here passes AA at 6.5:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | div/text | 6.5:1 | AA | — |
| text here passes AA at 6.5:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.5:1 | AA | — |
| text here passes AA at 6.5:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.5:1 | AA | currently 6.5:1 (passes AA) — the spec token would give you 7.2:1 (passes AAA) |
| text here passes AA at 6.5:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.5:1 | AA | — |
| text here passes AA at 6.5:1 but falls short of AAA (needs 7:1) | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 6.5:1 | AA | — |
| text here passes AAA at 8.2:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 8.2:1 | AAA | — |
| text here passes AAA at 8.4:1 | https://shopify.dev/docs/api/polaris | span/text | 8.4:1 | AAA | — |
| text here passes AAA at 8.4:1 | https://shopify.dev/docs/api/polaris | kbd/text | 8.4:1 | AAA | — |
| text here passes AAA at 8.4:1 | https://shopify.dev/docs/api/polaris | span/text | 8.4:1 | AAA | — |
| text here passes AAA at 8.4:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 8.4:1 | AAA | — |
| text here passes AAA at 8.4:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | kbd/text | 8.4:1 | AAA | — |
| text here passes AAA at 8.4:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 8.4:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | h2/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.7:1 | https://shopify.dev/docs/api/polaris | span/text | 8.7:1 | AAA | — |
| text here passes AAA at 8.7:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | span/text | 8.7:1 | AAA | — |
| text here passes AAA at 8.7:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | div/text | 8.7:1 | AAA | — |
| text here passes AAA at 9.0:1 | https://shopify.dev/docs/api/polaris | p/text | 9.0:1 | AAA | — |
| text here passes AAA at 9.0:1 | https://shopify.dev/docs/api/polaris | a/text | 9.0:1 | AAA | — |
| text here passes AAA at 9.0:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | div/text | 9.0:1 | AAA | — |
| text here passes AAA at 9.0:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | p/text | 9.0:1 | AAA | — |
| text here passes AAA at 9.0:1 | https://shopify.dev/docs/api/polaris/using-polaris-web-components | a/text | 9.0:1 | AAA | — |
