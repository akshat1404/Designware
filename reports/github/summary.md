# GitHub (github.com) (real-app)

**Score: 7.1 / 100** — 0 is fully on-spec, 100 is maximally deviant.

Pages scored: 6

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://github.com/ — [overlay](./github-com-09a8b930-overlay.html) · [as it should have looked](./github-com-09a8b930-corrected.png)
- https://github.com/about — [overlay](./github-com-about-2d940023-overlay.html) · [as it should have looked](./github-com-about-2d940023-corrected.png)
- https://github.com/torvalds/linux — [overlay](./github-com-torvalds-linux-de967671-overlay.html) · [as it should have looked](./github-com-torvalds-linux-de967671-corrected.png)
- https://github.com/torvalds/linux/issues — [overlay](./github-com-torvalds-linux-issues-7cd892cb-overlay.html) · [as it should have looked](./github-com-torvalds-linux-issues-7cd892cb-corrected.png)
- https://github.com/torvalds/linux/pulls — [overlay](./github-com-torvalds-linux-pulls-12c68532-overlay.html) · [as it should have looked](./github-com-torvalds-linux-pulls-12c68532-corrected.png)
- https://github.com/torvalds — [overlay](./github-com-torvalds-8f7010b5-overlay.html) · [as it should have looked](./github-com-torvalds-8f7010b5-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-family | 0.24 | 372 |
| border-radius | 0.11 | 361 |
| font-size | 0.10 | 372 |
| border-color | 0.10 | 94 |
| background-color | 0.05 | 118 |
| color | 0.04 | 372 |
| spacing | 0.03 | 2976 |
| font-weight | 0.01 | 372 |

## Worst offenders

| page | component | instance | property | value | nearest token | normalized |
|---|---|---|---|---|---|---|
| https://github.com/ | a/text | f4b727af | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | a/text | 3d74cc57 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | a/text | 4078d039 | font-family | "Mona Sans Mono", monospace | font-family:ui-monospace | 1.00 |
| https://github.com/ | h2/text | cd6a62ad | font-size | 24 | font-size:20 | 1.00 |
| https://github.com/ | h2/text | f999644f | font-family | "Mona Sans Mono", monospace | font-family:ui-monospace | 1.00 |
| https://github.com/ | h2/text | 9c141e11 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | h2/text | 6b9efd59 | font-size | 48 | font-size:40 | 1.00 |
| https://github.com/ | h2/text | 6b9efd59 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | h2/text | 3fcace53 | font-size | 24 | font-size:20 | 1.00 |
| https://github.com/ | h2/text | 3fcace53 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | button/text | 2caba805 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | button/text | df0af6f3 | font-family | "Mona Sans Mono", monospace | font-family:ui-monospace | 1.00 |
| https://github.com/ | button | c0862669 | spacing (padding-top) | 6 | spacing:4 | 1.00 |
| https://github.com/ | button | c0862669 | spacing (padding-bottom) | 6 | spacing:4 | 1.00 |
| https://github.com/ | button | 7e815292 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | button | 7e815292 | spacing (padding-top) | 6 | spacing:4 | 1.00 |
| https://github.com/ | button | 7e815292 | spacing (padding-right) | 20 | spacing:16 | 1.00 |
| https://github.com/ | button | 7e815292 | spacing (padding-bottom) | 6 | spacing:4 | 1.00 |
| https://github.com/ | button | 7e815292 | spacing (padding-left) | 20 | spacing:16 | 1.00 |
| https://github.com/ | button | 7882110f | border-radius (border-top-left-radius) | 60 | border-radius:12 | 1.00 |
| https://github.com/ | button | 176b915e | border-radius (border-top-left-radius) | 60 | border-radius:12 | 1.00 |
| https://github.com/ | button | b1797ee2 | border-radius (border-top-left-radius) | 48 | border-radius:12 | 1.00 |
| https://github.com/ | button | 64ff766d | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | span/text | ff8d5650 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | span/text | 6c66a0a6 | font-size | 22 | font-size:20 | 1.00 |
| https://github.com/ | span/text | 6c66a0a6 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | span/text | 4843603b | font-size | 22 | font-size:20 | 1.00 |
| https://github.com/ | span/text | 4843603b | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
| https://github.com/ | span/text | db41f809 | font-size | 22 | font-size:20 | 1.00 |
| https://github.com/ | span/text | db41f809 | font-family | "Mona Sans", MonaSansFallback, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" | font-family:ui-monospace | 1.00 |
