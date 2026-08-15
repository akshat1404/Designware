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
| padding-top is 10px, should be 8px | https://jira.atlassian.com/ | a/text | ca857af2 | spacing (padding-top): 10 | spacing:8 | 1.00 |
| padding-bottom is 10px, should be 8px | https://jira.atlassian.com/ | a/text | ca857af2 | spacing (padding-bottom): 10 | spacing:8 | 1.00 |
| top-left corner radius is 3px, should be 2px | https://jira.atlassian.com/ | a/text | 95733991 | border-radius (border-top-left-radius): 3 | border-radius:2 | 1.00 |
| top-left corner radius is 10000px, should be 9999px | https://jira.atlassian.com/ | a/text | fbf49916 | border-radius (border-top-left-radius): 10000 | border-radius:9999 | 1.00 |
| padding-right is 22px, should be 20px | https://jira.atlassian.com/ | a/text | fbf49916 | spacing (padding-right): 22 | spacing:20 | 1.00 |
| padding-left is 22px, should be 20px | https://jira.atlassian.com/ | a/text | fbf49916 | spacing (padding-left): 22 | spacing:20 | 1.00 |
| top-left corner radius is 10000px, should be 9999px | https://jira.atlassian.com/ | a/text | bd8671c7 | border-radius (border-top-left-radius): 10000 | border-radius:9999 | 1.00 |
| padding-right is 22px, should be 20px | https://jira.atlassian.com/ | a/text | bd8671c7 | spacing (padding-right): 22 | spacing:20 | 1.00 |
| padding-left is 22px, should be 20px | https://jira.atlassian.com/ | a/text | bd8671c7 | spacing (padding-left): 22 | spacing:20 | 1.00 |
| top-left corner radius is 40px, should be 16px | https://jira.atlassian.com/ | div | 3b70567f | border-radius (border-top-left-radius): 40 | border-radius:16 | 1.00 |
| padding-top is 10px, should be 8px | https://jira.atlassian.com/ | div | 3b70567f | spacing (padding-top): 10 | spacing:8 | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/ | div | 3b70567f | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-bottom is 10px, should be 8px | https://jira.atlassian.com/ | div | 3b70567f | spacing (padding-bottom): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/ | div | 3b70567f | spacing (padding-left): 10 | spacing:8 | 1.00 |
| margin-right is 60px, should be 64px | https://jira.atlassian.com/ | div | 37beefe6 | spacing (margin-right): 60 | spacing:64 | 1.00 |
| margin-left is 60px, should be 64px | https://jira.atlassian.com/ | div | 37beefe6 | spacing (margin-left): 60 | spacing:64 | 1.00 |
| font size is 48px, should be 32px | https://jira.atlassian.com/ | h1/text | 95842ab2 | font-size: 48 | font-size:32 | 1.00 |
| font weight is 800, should be 653 (lighter than what's used) | https://jira.atlassian.com/ | h1/text | 95842ab2 | font-weight: 800 | font-weight:653 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | nav | bef0ff3e | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | afb6f4cc | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 16ad459a | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | span/text | 00704847 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 14286593 | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 14286593 | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 6d9f8afa | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
| padding-right is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 6d9f8afa | spacing (padding-right): 10 | spacing:8 | 1.00 |
| padding-left is 10px, should be 8px | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 6d9f8afa | spacing (padding-left): 10 | spacing:8 | 1.00 |
| using "-apple-system" instead of "Atlassian Sans" | https://jira.atlassian.com/projects/JRACLOUD/summary | a/text | 5ba0963e | font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif | font-family:Atlassian Sans | 1.00 |
