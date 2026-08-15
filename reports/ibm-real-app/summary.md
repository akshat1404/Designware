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
| font-size | 0.07 | 265 |
| border-radius | 0.04 | 265 |
| font-family | 0.04 | 265 |
| spacing | 0.03 | 2120 |
| font-weight | 0.00 | 265 |
| color | 0.00 | 265 |
| background-color | 0.00 | 96 |
| border-color | 0.00 | 16 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| font size is 47.2501px, should be 42px | https://www.ibm.com/ | li/text | 243dcc63 | font-size: 47.2501 | font-size:42 | 1.00 |
| padding-right is 10px, should be 8px | https://www.ibm.com/ | p/text | 0b894ff5 | spacing (padding-right): 10 | spacing:8 | 1.00 |
| top-left corner radius is 16px, should be 0px | https://www.ibm.com/ | span/text | 9011f910 | border-radius (border-top-left-radius): 16 | border-radius:0 | 1.00 |
| top-left corner radius is 16px, should be 0px | https://www.ibm.com/ | span/text | 17820a53 | border-radius (border-top-left-radius): 16 | border-radius:0 | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | span/text | f8a1b944 | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | button/text | 057cd0f5 | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| padding-top is 14px, should be 12px | https://www.ibm.com/ | button/text | 057cd0f5 | spacing (padding-top): 14 | spacing:12 | 1.00 |
| padding-bottom is 14px, should be 12px | https://www.ibm.com/ | button/text | 057cd0f5 | spacing (padding-bottom): 14 | spacing:12 | 1.00 |
| margin-top is 60.4764px, should be 64px | https://www.ibm.com/ | div | 93d0f297 | spacing (margin-top): 60.4764 | spacing:64 | 1.00 |
| padding-top is 360px, should be 160px | https://www.ibm.com/ | div | 0bcfc23d | spacing (padding-top): 360 | spacing:160 | 1.00 |
| padding-right is 192px, should be 160px | https://www.ibm.com/ | div | 0bcfc23d | spacing (padding-right): 192 | spacing:160 | 1.00 |
| padding-bottom is 360px, should be 160px | https://www.ibm.com/ | div | 0bcfc23d | spacing (padding-bottom): 360 | spacing:160 | 1.00 |
| padding-left is 192px, should be 160px | https://www.ibm.com/ | div | 0bcfc23d | spacing (padding-left): 192 | spacing:160 | 1.00 |
| font size is 47.2501px, should be 42px | https://www.ibm.com/ | h2/text | d486f260 | font-size: 47.2501 | font-size:42 | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | a/text | 148a93f2 | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| font size is 47.2501px, should be 42px | https://www.ibm.com/ | c4d-content-block-heading/text | 9e45a7a2 | font-size: 47.2501 | font-size:42 | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | input | 5071459e | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| using "Helvetica" instead of "IBM Plex Sans Var" | https://www.ibm.com/ | em/text | 97023a78 | font-family: Helvetica, Arial, sans-serif | font-family:IBM Plex Sans Var | 1.00 |
| font size is 59.2501px, should be 54px | https://www.ibm.com/products | h1/text | 8c5098e4 | font-size: 59.2501 | font-size:54 | 1.00 |
| margin-right is -16px, should be 2px | https://www.ibm.com/products | div | 3c4a9060 | spacing (margin-right): -16 | spacing:2 | 1.00 |
| margin-left is -16px, should be 2px | https://www.ibm.com/products | div | 3c4a9060 | spacing (margin-left): -16 | spacing:2 | 1.00 |
| top-left corner radius is 15px, should be 0px | https://www.ibm.com/products | div | bc115f37 | border-radius (border-top-left-radius): 15 | border-radius:0 | 1.00 |
| top-left corner radius is 15px, should be 0px | https://www.ibm.com/products | div | ac9217cb | border-radius (border-top-left-radius): 15 | border-radius:0 | 1.00 |
| margin-left is -16px, should be 2px | https://www.ibm.com/products | div | 474fbbc4 | spacing (margin-left): -16 | spacing:2 | 1.00 |
| padding-top is 360px, should be 160px | https://www.ibm.com/products | div | 0bcfc23d | spacing (padding-top): 360 | spacing:160 | 1.00 |
| padding-right is 192px, should be 160px | https://www.ibm.com/products | div | 0bcfc23d | spacing (padding-right): 192 | spacing:160 | 1.00 |
| padding-bottom is 360px, should be 160px | https://www.ibm.com/products | div | 0bcfc23d | spacing (padding-bottom): 360 | spacing:160 | 1.00 |
| padding-left is 192px, should be 160px | https://www.ibm.com/products | div | 0bcfc23d | spacing (padding-left): 192 | spacing:160 | 1.00 |
| font size is 47.2501px, should be 42px | https://www.ibm.com/products | h2/text | d486f260 | font-size: 47.2501 | font-size:42 | 1.00 |
| font size is 47.2501px, should be 42px | https://www.ibm.com/consulting | span/text | 22ebfeb9 | font-size: 47.2501 | font-size:42 | 1.00 |
