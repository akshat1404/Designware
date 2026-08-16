# Jira (jira.atlassian.com) (real-app)

[**View the full report**](./report.html) — one self-contained file with the score, plain-English breakdown, and screenshots; opens directly in a browser from anywhere, no other files needed.

**Score: 18.3 / 100** — 0 is fully on-spec, 100 is maximally deviant.

Pages scored: 4

## Visual diagnostics

Per page: an overlay of the captured screenshot with flagged deviations boxed and color-coded by category, and a corrected render — the same page with every color/background-color/border-color/border-radius/font-family deviation patched to its nearest spec value in place (spacing, font-size, and font-weight are left alone since correcting them can reflow the layout).

- https://jira.atlassian.com/ — [overlay](./jira-atlassian-com-fce3a307-overlay.html) · [as it should have looked](./jira-atlassian-com-fce3a307-corrected.png)
- https://jira.atlassian.com/projects/JRACLOUD/summary — [overlay](./jira-atlassian-com-projects-JRACLOUD-summary-41375c9b-overlay.html) · [as it should have looked](./jira-atlassian-com-projects-JRACLOUD-summary-41375c9b-corrected.png)
- https://jira.atlassian.com/projects/CONFCLOUD/summary — [overlay](./jira-atlassian-com-projects-CONFCLOUD-summary-17d837f4-overlay.html) · [as it should have looked](./jira-atlassian-com-projects-CONFCLOUD-summary-17d837f4-corrected.png)
- https://jira.atlassian.com/projects/JSWCLOUD/summary — [overlay](./jira-atlassian-com-projects-JSWCLOUD-summary-0e9f5c04-overlay.html) · [as it should have looked](./jira-atlassian-com-projects-JSWCLOUD-summary-0e9f5c04-corrected.png)

## Breakdown by property

| property | mean deviation | n |
|---|---|---|
| font-family | 0.74 | 101 |
| border-radius | 0.16 | 101 |
| color | 0.14 | 101 |
| border-color | 0.13 | 6 |
| spacing | 0.09 | 808 |
| font-weight | 0.04 | 101 |
| background-color | 0.02 | 24 |
| font-size | 0.01 | 101 |

## Worst offenders

| what's wrong | page | component | instance | raw value | nearest token | normalized |
|---|---|---|---|---|---|---|
| padding-top is 10px, should be 8px | https://jira.atlassian.com/ | a/text | afd0aa5e | spacing (padding-top): 10 | spacing:8 | 1.00 |
| padding-bottom is 10px, should be 8px | https://jira.atlassian.com/ | a/text | afd0aa5e | spacing (padding-bottom): 10 | spacing:8 | 1.00 |
| top-left corner radius is 3px, should be 2px | https://jira.atlassian.com/ | a/text | 685bebda | border-radius (border-top-left-radius): 3 | border-radius:2 | 1.00 |
| top-left corner radius is 10000px, should be 9999px | https://jira.atlassian.com/ | a/text | 9968dcf8 | border-radius (border-top-left-radius): 10000 | border-radius:9999 | 1.00 |
| padding-right is 22px, should be 20px | https://jira.atlassian.com/ | a/text | 9968dcf8 | spacing (padding-right): 22 | spacing:20 | 1.00 |
| padding-left is 22px, should be 20px | https://jira.atlassian.com/ | a/text | 9968dcf8 | spacing (padding-left): 22 | spacing:20 | 1.00 |
| top-left corner radius is 10000px, should be 9999px | https://jira.atlassian.com/ | a/text | 6959469d | border-radius (border-top-left-radius): 10000 | border-radius:9999 | 1.00 |
| padding-right is 22px, should be 20px | https://jira.atlassian.com/ | a/text | 6959469d | spacing (padding-right): 22 | spacing:20 | 1.00 |
| padding-left is 22px, should be 20px | https://jira.atlassian.com/ | a/text | 6959469d | spacing (padding-left): 22 | spacing:20 | 1.00 |
| top-left corner radius is 40px, should be 16px | https://jira.atlassian.com/ | div | 3b70567f | border-radius (border-top-left-radius): 40 | border-radius:16 | 1.00 |
| padding-top is 10px, should be 8px | https://jira.atlassian.com/ | div | 3b70567f | spacing (padding-top): 10 | spacing:8 | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/ | div | 3b70567f | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-bottom is 10px, should be 8px | https://jira.atlassian.com/ | div | 3b70567f | spacing (padding-bottom): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/ | div | 3b70567f | spacing (padding-left): 10 | spacing:8 | 1.00 |
| margin-right is 60px, should be 64px | https://jira.atlassian.com/ | div | 37beefe6 | spacing (margin-right): 60 | spacing:64 | 1.00 |
| margin-left is 60px, should be 64px | https://jira.atlassian.com/ | div | 37beefe6 | spacing (margin-left): 60 | spacing:64 | 1.00 |
| font size is 48px, should be 32px | https://jira.atlassian.com/ | h1/text | bba02d7f | font-size: 48 | font-size:32 | 1.00 |
| font weight is 800, should be 653 (lighter than what's used) | https://jira.atlassian.com/ | h1/text | bba02d7f | font-weight: 800 | font-weight:653 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 7e0e6678 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 715483ea | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 144f366f | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 9438a088 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 9438a088 | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | a23c9f94 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | a23c9f94 | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | a23c9f94 | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | bf8bfb8e | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |

## Accessibility — WCAG contrast

_Separate from the deviation score above: this checks captured text against WCAG 2.1's own contrast thresholds, independent of the brand spec — an element can be on-spec and still fail contrast, or off-spec and still pass._

Checked: 73, passing: 73, failing: 0

| finding | page | component | ratio | level | spec-token fix |
|---|---|---|---|---|---|
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/ | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/ | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/ | span/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/ | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | button/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | button/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JSWCLOUD/summary | button/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AA at 5.2:1 but falls short of AAA (needs 7:1) | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 5.2:1 | AA | — |
| text here passes AAA at 7.2:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 7.2:1 | AAA | — |
| text here passes AAA at 7.2:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | span/text | 7.2:1 | AAA | — |
| text here passes AAA at 7.2:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | span/text | 7.2:1 | AAA | — |
| text here passes AAA at 7.7:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | li/text | 7.7:1 | AAA | — |
| text here passes AAA at 7.7:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | li/text | 7.7:1 | AAA | — |
| text here passes AAA at 7.7:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | li/text | 7.7:1 | AAA | — |
| text here passes AAA at 7.8:1 | https://jira.atlassian.com/ | div/text | 7.8:1 | AAA | — |
| text here passes AAA at 7.9:1 | https://jira.atlassian.com/ | div/text | 7.9:1 | AAA | — |
| text here passes AAA at 7.9:1 | https://jira.atlassian.com/ | div/text | 7.9:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | span/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | span/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 8.5:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 8.5:1 | AAA | — |
| text here passes AAA at 13.3:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 13.3:1 | AAA | — |
| text here passes AAA at 13.3:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | a/text | 13.3:1 | AAA | — |
| text here passes AAA at 13.3:1 | https://jira.atlassian.com/projects/JSWCLOUD/summary | a/text | 13.3:1 | AAA | — |
| text here passes AAA at 13.4:1 | https://jira.atlassian.com/ | span/text | 13.4:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | section/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | iframe/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | dt/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | dt/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/JRACLOUD/summary | dd/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | section/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | span/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | h3/text | 14.1:1 | AAA | — |
| text here passes AAA at 14.1:1 | https://jira.atlassian.com/projects/CONFCLOUD/summary | p/text | 14.1:1 | AAA | — |
