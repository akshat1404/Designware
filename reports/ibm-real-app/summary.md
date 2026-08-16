# IBM (ibm.com) (real-app)

[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.

**Score: 2.0 / 100** — 0 is fully on-spec, 100 is maximally deviant.

Pages scored: 5

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://www.ibm.com/ — [overlay](./www-ibm-com-4db5772a-overlay.html) · [as it should have looked](./www-ibm-com-4db5772a-corrected.png)
- https://www.ibm.com/products — [overlay](./www-ibm-com-products-1869b492-overlay.html) · [as it should have looked](./www-ibm-com-products-1869b492-corrected.png)
- https://www.ibm.com/consulting — [overlay](./www-ibm-com-consulting-f1bb3b83-overlay.html) · [as it should have looked](./www-ibm-com-consulting-f1bb3b83-corrected.png)
- https://www.ibm.com/cloud — [overlay](./www-ibm-com-cloud-ee0ea7af-overlay.html) · [as it should have looked](./www-ibm-com-cloud-ee0ea7af-corrected.png)
- https://www.ibm.com/think — [overlay](./www-ibm-com-think-990b5c23-overlay.html) · [as it should have looked](./www-ibm-com-think-990b5c23-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-size | 0.06 | 290 |
| font-family | 0.05 | 290 |
| border-radius | 0.04 | 290 |
| spacing | 0.03 | 2320 |
| font-weight | 0.00 | 290 |
| color | 0.00 | 290 |
| background-color | 0.00 | 99 |
| border-color | 0.00 | 16 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| font size is 47.2501px, should be 42px | https://www.ibm.com/ | li/text | 926f4329 | font-size: 47.2501 | font-size:42 | 1.00 |
| padding-right is 10px, should be 8px | https://www.ibm.com/ | p/text | db22a682 | spacing (padding-right): 10 | spacing:8 | 1.00 |
| top-left corner radius is 16px, should be 0px | https://www.ibm.com/ | span/text | c929d5d6 | border-radius (border-top-left-radius): 16 | border-radius:0 | 1.00 |
| top-left corner radius is 16px, should be 0px | https://www.ibm.com/ | span/text | db48179b | border-radius (border-top-left-radius): 16 | border-radius:0 | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | span/text | 936cba4c | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | button/text | 1128d043 | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| padding-top is 14px, should be 12px | https://www.ibm.com/ | button/text | 1128d043 | spacing (padding-top): 14 | spacing:12 | 1.00 |
| padding-bottom is 14px, should be 12px | https://www.ibm.com/ | button/text | 1128d043 | spacing (padding-bottom): 14 | spacing:12 | 1.00 |
| margin-top is 60.4764px, should be 64px | https://www.ibm.com/ | div | 93d0f297 | spacing (margin-top): 60.4764 | spacing:64 | 1.00 |
| padding-top is 360px, should be 160px | https://www.ibm.com/ | div | 0bcfc23d | spacing (padding-top): 360 | spacing:160 | 1.00 |
| padding-right is 192px, should be 160px | https://www.ibm.com/ | div | 0bcfc23d | spacing (padding-right): 192 | spacing:160 | 1.00 |
| padding-bottom is 360px, should be 160px | https://www.ibm.com/ | div | 0bcfc23d | spacing (padding-bottom): 360 | spacing:160 | 1.00 |
| padding-left is 192px, should be 160px | https://www.ibm.com/ | div | 0bcfc23d | spacing (padding-left): 192 | spacing:160 | 1.00 |
| font size is 47.2501px, should be 42px | https://www.ibm.com/ | h2/text | 3ca59393 | font-size: 47.2501 | font-size:42 | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | a/text | f8a86ffd | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| font size is 47.2501px, should be 42px | https://www.ibm.com/ | c4d-content-block-heading/text | ccec071a | font-size: 47.2501 | font-size:42 | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | input | 5071459e | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | em/text | f252488a | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| font size is 59.2501px, should be 54px | https://www.ibm.com/products | h1/text | fff61258 | font-size: 59.2501 | font-size:54 | 1.00 |
| margin-right is -16px, should be 2px | https://www.ibm.com/products | div | 3c4a9060 | spacing (margin-right): -16 | spacing:2 | 1.00 |
| margin-left is -16px, should be 2px | https://www.ibm.com/products | div | 3c4a9060 | spacing (margin-left): -16 | spacing:2 | 1.00 |
| top-left corner radius is 15px, should be 0px | https://www.ibm.com/products | div | bc115f37 | border-radius (border-top-left-radius): 15 | border-radius:0 | 1.00 |
| top-left corner radius is 15px, should be 0px | https://www.ibm.com/products | div | ac9217cb | border-radius (border-top-left-radius): 15 | border-radius:0 | 1.00 |
| margin-left is -16px, should be 2px | https://www.ibm.com/products | div | 474fbbc4 | spacing (margin-left): -16 | spacing:2 | 1.00 |
| padding-top is 360px, should be 160px | https://www.ibm.com/products | div | 0bcfc23d | spacing (padding-top): 360 | spacing:160 | 1.00 |
| padding-right is 192px, should be 160px | https://www.ibm.com/products | div | 0bcfc23d | spacing (padding-right): 192 | spacing:160 | 1.00 |
| padding-bottom is 360px, should be 160px | https://www.ibm.com/products | div | 0bcfc23d | spacing (padding-bottom): 360 | spacing:160 | 1.00 |
| padding-left is 192px, should be 160px | https://www.ibm.com/products | div | 0bcfc23d | spacing (padding-left): 192 | spacing:160 | 1.00 |
| font size is 47.2501px, should be 42px | https://www.ibm.com/products | h2/text | 3ca59393 | font-size: 47.2501 | font-size:42 | 1.00 |
| font size is 47.2501px, should be 42px | https://www.ibm.com/consulting | span/text | 4022d6c4 | font-size: 47.2501 | font-size:42 | 1.00 |

## Accessibility — WCAG contrast

_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._

Checked: 189, passing: 182, failing: 7

| finding | page | component | ratio | level | spec-token fix |
|---|---|---|---|---|---|
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://www.ibm.com/ | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://www.ibm.com/cloud | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://www.ibm.com/think | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.0:1, needs at least 4.5:1 for AA | https://www.ibm.com/think | span/text | 1.0:1 | fail | — |
| text here is barely readable against its background — 1.1:1, needs at least 4.5:1 for AA | https://www.ibm.com/think | span/text | 1.1:1 | fail | — |
| text here is barely readable against its background — 1.9:1, needs at least 4.5:1 for AA | https://www.ibm.com/ | button/text | 1.9:1 | fail | — |
| text here is barely readable against its background — 1.9:1, needs at least 4.5:1 for AA | https://www.ibm.com/think | button/text | 1.9:1 | fail | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/consulting | span/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/cloud | span/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/cloud | span/text | 4.5:1 | AA | — |
| text here passes AA at 4.5:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | span/text | 4.5:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | p/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | a/text | 4.6:1 | AA | — |
| text here passes AA at 4.6:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | a/text | 4.6:1 | AA | — |
| text here passes AA at 4.9:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | a/text | 4.9:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/ | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/ | p/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/ | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/ | a/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/products | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/products | c4d-text-cta/text | 5.0:1 | AA | — |
| text here passes AAA at 5.0:1 | https://www.ibm.com/consulting | span/text | 5.0:1 | AAA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/consulting | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/consulting | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/cloud | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/cloud | a/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/cloud | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/cloud | a/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/cloud | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | span/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | a/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/ | c4d-text-cta/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/ | a/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/consulting | a/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/consulting | c4d-text-cta/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/cloud | a/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | c4d-text-cta/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | c4d-link-list-item-cta/text | 5.0:1 | AA | — |
| text here passes AA at 5.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | a/text | 5.0:1 | AA | — |
| text here passes AA at 6.0:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/think | span/text | 6.0:1 | AA | — |
| text here passes AA at 6.4:1 but falls short of AAA (needs 7:1) | https://www.ibm.com/consulting | span/text | 6.4:1 | AA | — |
| text here passes AAA at 7.1:1 | https://www.ibm.com/ | div/text | 7.1:1 | AAA | — |
| text here passes AAA at 7.1:1 | https://www.ibm.com/ | div/text | 7.1:1 | AAA | — |
| text here passes AAA at 7.1:1 | https://www.ibm.com/think | span/text | 7.1:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://www.ibm.com/ | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://www.ibm.com/products | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://www.ibm.com/consulting | span/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://www.ibm.com/cloud | h2/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://www.ibm.com/cloud | p/text | 7.8:1 | AAA | — |
