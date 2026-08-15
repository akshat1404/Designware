# Atlassian Design (atlassian.design) (on-spec)

[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.

**Score: 1.9 / 100** — 0 is fully on-spec, 100 is maximally deviant.

_This is the company's own design-system site — it should score near zero. If it doesn't, treat that as a matcher bug, not real drift._

Pages scored: 5

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://atlassian.design/ — [overlay](./atlassian-design-70803a41-overlay.html) · [as it should have looked](./atlassian-design-70803a41-corrected.png)
- https://atlassian.design/components/button/examples — [overlay](./atlassian-design-components-button-examples-249ae442-overlay.html) · [as it should have looked](./atlassian-design-components-button-examples-249ae442-corrected.png)
- https://atlassian.design/foundations/color — [overlay](./atlassian-design-foundations-color-ad6f37ea-overlay.html) · [as it should have looked](./atlassian-design-foundations-color-ad6f37ea-corrected.png)
- https://atlassian.design/foundations/typography — [overlay](./atlassian-design-foundations-typography-b0c1066f-overlay.html) · [as it should have looked](./atlassian-design-foundations-typography-b0c1066f-corrected.png)
- https://atlassian.design/components/badge/examples — [overlay](./atlassian-design-components-badge-examples-a336aa86-overlay.html) · [as it should have looked](./atlassian-design-components-badge-examples-a336aa86-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-size | 0.04 | 307 |
| font-weight | 0.03 | 307 |
| border-radius | 0.01 | 306 |
| spacing | 0.00 | 2456 |
| background-color | 0.00 | 131 |
| color | 0.00 | 307 |
| font-family | 0.00 | 307 |
| border-color | 0.00 | 45 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| font size is 112px, should be 32px | https://atlassian.design/ | span/text | 0a92fe7f | font-size: 112 | font-size:32 | 1.00 |
| font size is 112px, should be 32px | https://atlassian.design/ | span/text | e8ec63b9 | font-size: 112 | font-size:32 | 1.00 |
| top-left corner radius is 32px, should be 16px | https://atlassian.design/ | div | 15314f58 | border-radius (border-top-left-radius): 32 | border-radius:16 | 1.00 |
| top-left corner radius is 28px, should be 16px | https://atlassian.design/ | div/text | c528e946 | border-radius (border-top-left-radius): 28 | border-radius:16 | 1.00 |
| top-left corner radius is 28px, should be 16px | https://atlassian.design/ | div/text | cf4fd402 | border-radius (border-top-left-radius): 28 | border-radius:16 | 1.00 |
| top-left corner radius is 27px, should be 16px | https://atlassian.design/ | div/text | 1a864d8d | border-radius (border-top-left-radius): 27 | border-radius:16 | 1.00 |
| font size is 44px, should be 32px | https://atlassian.design/ | h3/text | 8b9a61d4 | font-size: 44 | font-size:32 | 1.00 |
| margin-right is 89.5px, should be 80px | https://atlassian.design/ | p/text | c1f21b5d | spacing (margin-right): 89.5 | spacing:80 | 1.00 |
| margin-left is 89.5px, should be 80px | https://atlassian.design/ | p/text | c1f21b5d | spacing (margin-left): 89.5 | spacing:80 | 1.00 |
| font size is 40px, should be 32px | https://atlassian.design/ | p/text | 8a3e7ba1 | font-size: 40 | font-size:32 | 1.00 |
| font size is 68px, should be 32px | https://atlassian.design/ | h2/text | 39246406 | font-size: 68 | font-size:32 | 1.00 |
| font size is 40px, should be 32px | https://atlassian.design/components/button/examples | h1/text | 7e938959 | font-size: 40 | font-size:32 | 1.00 |
| font size is 48px, should be 32px | https://atlassian.design/foundations/color | h1/text | e7ab137a | font-size: 48 | font-size:32 | 1.00 |
| font size is 48px, should be 32px | https://atlassian.design/foundations/typography | h1/text | e7ab137a | font-size: 48 | font-size:32 | 1.00 |
| font size is 40px, should be 32px | https://atlassian.design/components/badge/examples | h1/text | 7e938959 | font-size: 40 | font-size:32 | 1.00 |
| padding-top is 1px, should be 0px | https://atlassian.design/components/button/examples | button | c6aa420f | spacing (padding-top): 1 | spacing:0 | 0.50 |
| padding-bottom is 1px, should be 0px | https://atlassian.design/components/button/examples | button | c6aa420f | spacing (padding-bottom): 1 | spacing:0 | 0.50 |
| padding-top is 1px, should be 0px | https://atlassian.design/components/badge/examples | button | c6aa420f | spacing (padding-top): 1 | spacing:0 | 0.50 |
| padding-bottom is 1px, should be 0px | https://atlassian.design/components/badge/examples | button | c6aa420f | spacing (padding-bottom): 1 | spacing:0 | 0.50 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | span/text | 0a92fe7f | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | span/text | e8ec63b9 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | h3/text | 8b9a61d4 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | h2/text | 39246406 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/components/button/examples | span/text | 07fe2825 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/components/button/examples | h1/text | 7e938959 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/foundations/color | h1/text | e7ab137a | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/foundations/color | h2/text | 1ba36f96 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/foundations/color | h3/text | 1a0a60b5 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/foundations/color | th/text | b8e8320f | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/foundations/color | th/text | 1fa8c6ca | font-weight: 700 | font-weight:653 | 0.47 |
