# Carbon Design System (carbondesignsystem.com) (on-spec)

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
| font-size | 0.05 | 359 |
| border-radius | 0.03 | 359 |
| spacing | 0.03 | 2872 |
| font-family | 0.00 | 359 |
| color | 0.00 | 359 |
| background-color | 0.00 | 138 |
| font-weight | 0.00 | 359 |
| border-color | 0.00 | 15 |

## Worst offenders

| page | component | instance | property | value | nearest token | normalized |
|---|---|---|---|---|---|---|
| https://carbondesignsystem.com/ | div | 69ab8754 | spacing (padding-left) | 344 | spacing:160 | 1.00 |
| https://carbondesignsystem.com/ | div | 8be93874 | spacing (padding-right) | 73.4844 | spacing:80 | 1.00 |
| https://carbondesignsystem.com/ | div | 3e5dbe8d | spacing (padding-left) | 344 | spacing:160 | 1.00 |
| https://carbondesignsystem.com/ | a/text | 278c0769 | spacing (margin-top) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/ | a/text | 278c0769 | spacing (margin-right) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/ | a/text | 278c0769 | spacing (margin-bottom) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/ | a/text | 278c0769 | spacing (margin-left) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/ | a/text | dca78b22 | spacing (padding-top) | 6 | spacing:4 | 1.00 |
| https://carbondesignsystem.com/ | a/text | dca78b22 | spacing (padding-bottom) | 6 | spacing:4 | 1.00 |
| https://carbondesignsystem.com/ | a | 80583567 | spacing (padding-right) | 69.9844 | spacing:64 | 1.00 |
| https://carbondesignsystem.com/ | a | dd7a13c1 | spacing (padding-right) | 77.7344 | spacing:80 | 1.00 |
| https://carbondesignsystem.com/ | label/text | be00a591 | spacing (margin-top) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/ | label/text | be00a591 | spacing (margin-right) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/ | label/text | be00a591 | spacing (margin-bottom) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/ | label/text | be00a591 | spacing (margin-left) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | a/text | 278c0769 | spacing (margin-top) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | a/text | 278c0769 | spacing (margin-right) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | a/text | 278c0769 | spacing (margin-bottom) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | a/text | 278c0769 | spacing (margin-left) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | a/text | dca78b22 | spacing (padding-top) | 6 | spacing:4 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | a/text | dca78b22 | spacing (padding-bottom) | 6 | spacing:4 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | a | 352c4e64 | spacing (padding-right) | 77.6562 | spacing:80 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | div | c80a92c3 | border-radius (border-top-left-radius) | 16 | border-radius:0 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | div | dcbe9f01 | border-radius (border-top-left-radius) | 16 | border-radius:0 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | label/text | be00a591 | spacing (margin-top) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | label/text | be00a591 | spacing (margin-right) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | label/text | be00a591 | spacing (margin-bottom) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | label/text | be00a591 | spacing (margin-left) | -1 | spacing:2 | 1.00 |
| https://carbondesignsystem.com/components/button/usage/ | h1/text | f0a75c6d | font-size | 59.2501 | font-size:54 | 1.00 |
| https://carbondesignsystem.com/components/text-input/usage/ | a/text | 278c0769 | spacing (margin-top) | -1 | spacing:2 | 1.00 |
