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
| font-size | 0.04 | 327 |
| font-weight | 0.03 | 327 |
| border-radius | 0.01 | 326 |
| spacing | 0.00 | 2616 |
| background-color | 0.00 | 131 |
| color | 0.00 | 327 |
| font-family | 0.00 | 327 |
| border-color | 0.00 | 45 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| font size is 112px, should be 32px | https://atlassian.design/ | span/text | 4b52102e | font-size: 112 | font-size:32 | 1.00 |
| font size is 112px, should be 32px | https://atlassian.design/ | span/text | 16a6c381 | font-size: 112 | font-size:32 | 1.00 |
| top-left corner radius is 32px, should be 16px | https://atlassian.design/ | div | 15314f58 | border-radius (border-top-left-radius): 32 | border-radius:16 | 1.00 |
| top-left corner radius is 28px, should be 16px | https://atlassian.design/ | div/text | 032986b3 | border-radius (border-top-left-radius): 28 | border-radius:16 | 1.00 |
| top-left corner radius is 28px, should be 16px | https://atlassian.design/ | div/text | aaad04e2 | border-radius (border-top-left-radius): 28 | border-radius:16 | 1.00 |
| top-left corner radius is 27px, should be 16px | https://atlassian.design/ | div/text | 650bea16 | border-radius (border-top-left-radius): 27 | border-radius:16 | 1.00 |
| font size is 44px, should be 32px | https://atlassian.design/ | h3/text | 23c595ac | font-size: 44 | font-size:32 | 1.00 |
| margin-right is 89.5px, should be 80px | https://atlassian.design/ | p/text | 7df17535 | spacing (margin-right): 89.5 | spacing:80 | 1.00 |
| margin-left is 89.5px, should be 80px | https://atlassian.design/ | p/text | 7df17535 | spacing (margin-left): 89.5 | spacing:80 | 1.00 |
| font size is 40px, should be 32px | https://atlassian.design/ | p/text | 5fabe8d1 | font-size: 40 | font-size:32 | 1.00 |
| font size is 68px, should be 32px | https://atlassian.design/ | h2/text | 7b5a830c | font-size: 68 | font-size:32 | 1.00 |
| font size is 68px, should be 32px | https://atlassian.design/ | h2/text | bc63761d | font-size: 68 | font-size:32 | 1.00 |
| font size is 40px, should be 32px | https://atlassian.design/components/button/examples | h1/text | 465c82fa | font-size: 40 | font-size:32 | 1.00 |
| font size is 48px, should be 32px | https://atlassian.design/foundations/color | h1/text | 1811e4ab | font-size: 48 | font-size:32 | 1.00 |
| font size is 48px, should be 32px | https://atlassian.design/foundations/typography | h1/text | 1811e4ab | font-size: 48 | font-size:32 | 1.00 |
| font size is 40px, should be 32px | https://atlassian.design/components/badge/examples | h1/text | 465c82fa | font-size: 40 | font-size:32 | 1.00 |
| padding-top is 1px, should be 0px | https://atlassian.design/components/button/examples | button | c6aa420f | spacing (padding-top): 1 | spacing:0 | 0.50 |
| padding-bottom is 1px, should be 0px | https://atlassian.design/components/button/examples | button | c6aa420f | spacing (padding-bottom): 1 | spacing:0 | 0.50 |
| padding-top is 1px, should be 0px | https://atlassian.design/components/badge/examples | button | c6aa420f | spacing (padding-top): 1 | spacing:0 | 0.50 |
| padding-bottom is 1px, should be 0px | https://atlassian.design/components/badge/examples | button | c6aa420f | spacing (padding-bottom): 1 | spacing:0 | 0.50 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | span/text | 4b52102e | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | span/text | 16a6c381 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | h3/text | 23c595ac | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | h2/text | 7b5a830c | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/ | h2/text | bc63761d | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/components/button/examples | span/text | b837cc54 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/components/button/examples | h1/text | 465c82fa | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/foundations/color | h1/text | 1811e4ab | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/foundations/color | h2/text | 1b03ba90 | font-weight: 700 | font-weight:653 | 0.47 |
| font weight is 700, should be 653 (lighter than what's used) | https://atlassian.design/foundations/color | h3/text | ef6530fd | font-weight: 700 | font-weight:653 | 0.47 |

## Accessibility — WCAG contrast

_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._

Checked: 190, passing: 180, failing: 10

| finding | page | component | ratio | level | spec-token fix |
|---|---|---|---|---|---|
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://atlassian.design/components/button/examples | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.3:1, needs at least 3:1 for AA | https://atlassian.design/ | h3/text | 1.3:1 | fail | — |
| text here is barely readable against its background — 1.3:1, needs at least 4.5:1 for AA | https://atlassian.design/ | span/text | 1.3:1 | fail | — |
| text here is barely readable against its background — 1.3:1, needs at least 4.5:1 for AA | https://atlassian.design/ | span/text | 1.3:1 | fail | — |
| text here is barely readable against its background — 1.3:1, needs at least 4.5:1 for AA | https://atlassian.design/components/button/examples | code/text | 1.3:1 | fail | — |
| text here is barely readable against its background — 1.3:1, needs at least 4.5:1 for AA | https://atlassian.design/foundations/color | code/text | 1.3:1 | fail | — |
| text here is barely readable against its background — 1.3:1, needs at least 4.5:1 for AA | https://atlassian.design/foundations/color | code/text | 1.3:1 | fail | — |
| text here is barely readable against its background — 1.3:1, needs at least 4.5:1 for AA | https://atlassian.design/foundations/typography | code/text | 1.3:1 | fail | — |
| text here is barely readable against its background — 1.3:1, needs at least 4.5:1 for AA | https://atlassian.design/components/badge/examples | code/text | 1.3:1 | fail | — |
| text here is barely readable against its background — 2.4:1, needs at least 4.5:1 for AA | https://atlassian.design/ | span/text | 2.4:1 | fail | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/color | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/typography | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | span/text | 4.6:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | a/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | span/text | 4.8:1 | AA | — |
| text here passes AA at 4.8:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | span/text | 4.8:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/ | span/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | p/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | a/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | span/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/color | a/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/color | span/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/typography | a/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/typography | span/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | p/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | span/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | a/text | 5.1:1 | AA | — |
| text here passes AA at 5.1:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | span/text | 5.1:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | span/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/ | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/ | div/text | 5.2:1 | AA | — |
| text here passes AAA at 5.2:1 | https://atlassian.design/ | span/text | 5.2:1 | AAA | — |
| text here passes AAA at 5.2:1 | https://atlassian.design/ | p/text | 5.2:1 | AAA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/ | span/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | span/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/color | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/color | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/typography | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/foundations/typography | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | span/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | span/text | 5.2:1 | AA | — |
| text here passes AA at 5.6:1 but falls short of AAA (needs 7:1) | https://atlassian.design/ | div/text | 5.6:1 | AA | — |
| text here passes AA at 5.7:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/button/examples | span/text | 5.7:1 | AA | — |
| text here passes AA at 5.7:1 but falls short of AAA (needs 7:1) | https://atlassian.design/components/badge/examples | span/text | 5.7:1 | AA | — |
