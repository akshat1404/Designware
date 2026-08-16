# Carbon Design System (carbondesignsystem.com) (on-spec)

[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.

**Score: 1.8 / 100** — 0 is fully on-spec, 100 is maximally deviant.

_This is the company's own design-system site — it should score near zero. If it doesn't, treat that as a matcher bug, not real drift._

Pages scored: 5

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://carbondesignsystem.com/ — [overlay](./carbondesignsystem-com-b990fd16-overlay.html) · [as it should have looked](./carbondesignsystem-com-b990fd16-corrected.png)
- https://carbondesignsystem.com/components/button/usage/ — [overlay](./carbondesignsystem-com-components-button-usage-da9ab5d4-overlay.html) · [as it should have looked](./carbondesignsystem-com-components-button-usage-da9ab5d4-corrected.png)
- https://carbondesignsystem.com/components/text-input/usage/ — [overlay](./carbondesignsystem-com-components-text-input-usage-60546dcd-overlay.html) · [as it should have looked](./carbondesignsystem-com-components-text-input-usage-60546dcd-corrected.png)
- https://carbondesignsystem.com/elements/color/overview/ — [overlay](./carbondesignsystem-com-elements-color-overview-06a456ad-overlay.html) · [as it should have looked](./carbondesignsystem-com-elements-color-overview-06a456ad-corrected.png)
- https://carbondesignsystem.com/elements/typography/overview/ — [overlay](./carbondesignsystem-com-elements-typography-overview-12a50531-overlay.html) · [as it should have looked](./carbondesignsystem-com-elements-typography-overview-12a50531-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-size | 0.05 | 370 |
| border-radius | 0.03 | 370 |
| spacing | 0.03 | 2960 |
| font-family | 0.00 | 370 |
| color | 0.00 | 370 |
| background-color | 0.00 | 138 |
| font-weight | 0.00 | 370 |
| border-color | 0.00 | 15 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| padding-left is 344px, should be 160px | https://carbondesignsystem.com/ | div | 69ab8754 | spacing (padding-left): 344 | spacing:160 | 1.00 |
| padding-right is 73.4844px, should be 80px | https://carbondesignsystem.com/ | div | 8be93874 | spacing (padding-right): 73.4844 | spacing:80 | 1.00 |
| padding-left is 344px, should be 160px | https://carbondesignsystem.com/ | div | 3e5dbe8d | spacing (padding-left): 344 | spacing:160 | 1.00 |
| margin-top is -1px, should be 2px | https://carbondesignsystem.com/ | a/text | 91f06406 | spacing (margin-top): -1 | spacing:2 | 1.00 |
| margin-right is -1px, should be 2px | https://carbondesignsystem.com/ | a/text | 91f06406 | spacing (margin-right): -1 | spacing:2 | 1.00 |
| margin-bottom is -1px, should be 2px | https://carbondesignsystem.com/ | a/text | 91f06406 | spacing (margin-bottom): -1 | spacing:2 | 1.00 |
| margin-left is -1px, should be 2px | https://carbondesignsystem.com/ | a/text | 91f06406 | spacing (margin-left): -1 | spacing:2 | 1.00 |
| padding-top is 6px, should be 4px | https://carbondesignsystem.com/ | a/text | 872b6daf | spacing (padding-top): 6 | spacing:4 | 1.00 |
| padding-bottom is 6px, should be 4px | https://carbondesignsystem.com/ | a/text | 872b6daf | spacing (padding-bottom): 6 | spacing:4 | 1.00 |
| padding-right is 69.9844px, should be 64px | https://carbondesignsystem.com/ | a | 80583567 | spacing (padding-right): 69.9844 | spacing:64 | 1.00 |
| padding-right is 77.7344px, should be 80px | https://carbondesignsystem.com/ | a | dd7a13c1 | spacing (padding-right): 77.7344 | spacing:80 | 1.00 |
| margin-top is -1px, should be 2px | https://carbondesignsystem.com/ | label/text | 65a09ee6 | spacing (margin-top): -1 | spacing:2 | 1.00 |
| margin-right is -1px, should be 2px | https://carbondesignsystem.com/ | label/text | 65a09ee6 | spacing (margin-right): -1 | spacing:2 | 1.00 |
| margin-bottom is -1px, should be 2px | https://carbondesignsystem.com/ | label/text | 65a09ee6 | spacing (margin-bottom): -1 | spacing:2 | 1.00 |
| margin-left is -1px, should be 2px | https://carbondesignsystem.com/ | label/text | 65a09ee6 | spacing (margin-left): -1 | spacing:2 | 1.00 |
| margin-top is -1px, should be 2px | https://carbondesignsystem.com/components/button/usage/ | a/text | 91f06406 | spacing (margin-top): -1 | spacing:2 | 1.00 |
| margin-right is -1px, should be 2px | https://carbondesignsystem.com/components/button/usage/ | a/text | 91f06406 | spacing (margin-right): -1 | spacing:2 | 1.00 |
| margin-bottom is -1px, should be 2px | https://carbondesignsystem.com/components/button/usage/ | a/text | 91f06406 | spacing (margin-bottom): -1 | spacing:2 | 1.00 |
| margin-left is -1px, should be 2px | https://carbondesignsystem.com/components/button/usage/ | a/text | 91f06406 | spacing (margin-left): -1 | spacing:2 | 1.00 |
| padding-top is 6px, should be 4px | https://carbondesignsystem.com/components/button/usage/ | a/text | 872b6daf | spacing (padding-top): 6 | spacing:4 | 1.00 |
| padding-bottom is 6px, should be 4px | https://carbondesignsystem.com/components/button/usage/ | a/text | 872b6daf | spacing (padding-bottom): 6 | spacing:4 | 1.00 |
| padding-right is 77.6562px, should be 80px | https://carbondesignsystem.com/components/button/usage/ | a | 352c4e64 | spacing (padding-right): 77.6562 | spacing:80 | 1.00 |
| top-left corner radius is 16px, should be 0px | https://carbondesignsystem.com/components/button/usage/ | div | c80a92c3 | border-radius (border-top-left-radius): 16 | border-radius:0 | 1.00 |
| top-left corner radius is 16px, should be 0px | https://carbondesignsystem.com/components/button/usage/ | div | dcbe9f01 | border-radius (border-top-left-radius): 16 | border-radius:0 | 1.00 |
| margin-top is -1px, should be 2px | https://carbondesignsystem.com/components/button/usage/ | label/text | 65a09ee6 | spacing (margin-top): -1 | spacing:2 | 1.00 |
| margin-right is -1px, should be 2px | https://carbondesignsystem.com/components/button/usage/ | label/text | 65a09ee6 | spacing (margin-right): -1 | spacing:2 | 1.00 |
| margin-bottom is -1px, should be 2px | https://carbondesignsystem.com/components/button/usage/ | label/text | 65a09ee6 | spacing (margin-bottom): -1 | spacing:2 | 1.00 |
| margin-left is -1px, should be 2px | https://carbondesignsystem.com/components/button/usage/ | label/text | 65a09ee6 | spacing (margin-left): -1 | spacing:2 | 1.00 |
| font size is 59.2501px, should be 54px | https://carbondesignsystem.com/components/button/usage/ | h1/text | d5ba5dc2 | font-size: 59.2501 | font-size:54 | 1.00 |
| margin-top is -1px, should be 2px | https://carbondesignsystem.com/components/text-input/usage/ | a/text | 91f06406 | spacing (margin-top): -1 | spacing:2 | 1.00 |

## Accessibility — WCAG contrast

_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._

Checked: 233, passing: 233, failing: 0

| finding | page | component | ratio | level | spec-token fix |
|---|---|---|---|---|---|
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/button/usage/ | a/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/button/usage/ | a/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/button/usage/ | em/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/text-input/usage/ | a/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/text-input/usage/ | a/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/elements/color/overview/ | a/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/elements/typography/overview/ | a/text | 4.5:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/text-input/usage/ | a/text | 4.6:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/ | strong/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/ | a/text | 5.0:1 | AA | — |
| text here passes AA at 5.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/button/usage/ | span/text | 5.5:1 | AA | — |
| text here passes AA at 5.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/text-input/usage/ | span/text | 5.5:1 | AA | — |
| text here passes AA at 5.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/elements/color/overview/ | span/text | 5.5:1 | AA | — |
| text here passes AA at 5.5:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/elements/typography/overview/ | span/text | 5.5:1 | AA | — |
| text here passes AA at 5.8:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/button/usage/ | span/text | 5.8:1 | AA | — |
| text here passes AA at 5.8:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/text-input/usage/ | span/text | 5.8:1 | AA | — |
| text here passes AA at 5.9:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/text-input/usage/ | span/text | 5.9:1 | AA | — |
| text here passes AA at 5.9:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/button/usage/ | span/text | 5.9:1 | AA | — |
| text here passes AA at 5.9:1 but falls short of AAA (needs 7:1) | https://carbondesignsystem.com/components/text-input/usage/ | span/text | 5.9:1 | AA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/ | p/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/components/button/usage/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/components/button/usage/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/components/button/usage/ | label/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/components/text-input/usage/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/components/text-input/usage/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/components/text-input/usage/ | label/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/elements/color/overview/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/elements/color/overview/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/elements/typography/overview/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/elements/typography/overview/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://carbondesignsystem.com/elements/typography/overview/ | th/text | 7.8:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/ | span/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/ | a/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/components/button/usage/ | span/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/components/button/usage/ | a/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/components/text-input/usage/ | span/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/components/text-input/usage/ | a/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/elements/color/overview/ | span/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/elements/color/overview/ | a/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/elements/typography/overview/ | span/text | 10.6:1 | AAA | — |
| text here passes AAA at 10.6:1 | https://carbondesignsystem.com/elements/typography/overview/ | a/text | 10.6:1 | AAA | — |
| text here passes AAA at 11.5:1 | https://carbondesignsystem.com/components/button/usage/ | a/text | 11.5:1 | AAA | — |
| text here passes AAA at 11.5:1 | https://carbondesignsystem.com/components/text-input/usage/ | a/text | 11.5:1 | AAA | — |
| text here passes AAA at 11.5:1 | https://carbondesignsystem.com/elements/color/overview/ | a/text | 11.5:1 | AAA | — |
| text here passes AAA at 11.5:1 | https://carbondesignsystem.com/elements/typography/overview/ | a/text | 11.5:1 | AAA | — |
| text here passes AAA at 13.7:1 | https://carbondesignsystem.com/ | p/text | 13.7:1 | AAA | — |
| text here passes AAA at 13.7:1 | https://carbondesignsystem.com/ | p/text | 13.7:1 | AAA | — |
| text here passes AAA at 13.7:1 | https://carbondesignsystem.com/ | a/text | 13.7:1 | AAA | — |
| text here passes AAA at 13.7:1 | https://carbondesignsystem.com/components/button/usage/ | code/text | 13.7:1 | AAA | — |
