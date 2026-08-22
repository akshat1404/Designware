# A Lint Check For Design

Deviation-detection engine for software products: diffs a running app's
*resolved* styles against a company's own brand token spec, and reports how
far they've drifted. Closer in spirit to Lighthouse/Sentry/a linter-as-a-
service than to a design tool: see
[brand-deviation-engine-brief.md](brand-deviation-engine-brief.md) for the
full problem statement and design rationale.

## Approach

Headlessly drives the real app (Playwright) and reads `getComputedStyle()`
per element: the exact value the rendering engine used to paint the pixel,
after cascade/inheritance/theming/runtime JS have resolved. Not pixel
estimation (CV is parked as a fallback for the canvas/SVG/raster long tail).

- **Color**: Delta-E (CIEDE2000) in Lab space against the spec's palette,
  alpha- and theme-variant aware (an opacity or dark-mode variant of a token
  resolves back to that token instead of scoring as unrelated drift).
- **Spacing / radius / font-size**: distance to the nearest value on the
  spec's defined scale.
- **Font family / weight**: categorical family match, weight as a
  secondary numeric check.
- **Aggregation**: instance → component → page → product rollup into a
  0–100 deviation score.
- **Accessibility (WCAG contrast)**: a second, separate finding category,
  not blended into the score above: for every text-containing sampled
  element, walks up the DOM to resolve the actual (non-transparent)
  background it renders against, then checks the color/background pair
  against WCAG 2.1's own AA/AAA contrast thresholds. An element can be
  perfectly on-spec and still fail contrast, or off-spec and still pass;
  these are answering different questions, so they're reported side by
  side rather than folded together. Failing/borderline findings that are
  also a flagged color deviation get a tie-in note: what the contrast ratio
  would be if corrected to the nearest spec token, when that correction
  would actually cross a pass threshold.

Two real bugs were found and fixed during this validation (not synthetic
fixtures, genuinely surfaced by messy real-world pages):

1. `border-radius` can resolve to a percentage (e.g. `50%` on a circular
   avatar) instead of px: the scale matcher now skips non-px values
   rather than crashing.
2. Heavy real sites often never reach Playwright's `networkidle` state
   (persistent analytics/chat-widget connections): navigation now uses
   `domcontentloaded` with a best-effort, non-fatal `networkidle` attempt
   afterward, rather than a hard timeout that silently marked every page
   unstable.

A third, more structural bug was caught by comparing on-spec vs. real-app
scores against each other: the instance score was a flat mean across every
pushed property, and spacing structurally contributes far more entries
(8: four padding + four margin sides) than any other category, so it
diluted color/typography deviations almost to invisibility. Fixed by
averaging *category* means (color, spacing, typography, radius) instead of
a flat per-property mean, confirmed by the on-spec/real-app score
ordering becoming directionally correct (real-app now scores at or above
its own on-spec baseline, not below it).

Each target's `reports/<key>/` also has an HTML overlay (captured
screenshot with flagged deviations boxed and color-coded by category, plus
failing WCAG contrast findings boxed in a fifth, distinct amber) and a
corrected-render PNG (same page, layout-safe properties: color,
background-color, border-color, border-radius, font-family, patched to
their nearest token in the same live session, before the page closes) per
crawled page, linked from that target's `summary.md` and embedded directly
in `report.html`. Box tooltips are plain-English sentences (the same
humanizer used for the worst-offenders table), not raw property/value/token
dumps: hover any box for "top-left corner radius is 3px, should be 2px"
rather than a distance number.

Contrast counts are independent of the Score column (see Approach): e.g.
Jira scores worst on deviation (18.3) but has zero contrast failures, while
Atlassian's own on-spec site scores near-zero on deviation but still has 10
real contrast failures. Most captured failures are near-1:1 (e.g. white text
over a translucent white overlay): the effective-background resolver takes
the first non-transparent ancestor color as-is, so a semi-transparent
overlay's own faint color is used rather than what visually composites
underneath it or through a `backdrop-filter`; worth keeping in mind when
reading ratios near 1:1 on frosted-glass/overlay UI.

Every target above is hardwired into `targets/registry.ts`, but the pipeline itself
doesn't need a registry entry: that machinery only exists to translate a specific
company's npm token package into a `TokenSpec`.

**Level 1 (core pipeline)**: schema, color/scale/font matchers, extractor,
aggregator; built and validated against synthetic fixtures (a compliant
component set and a deviant one with known, hand-computed injected
deviations).

**Level 2 (public design-system validation)**: one token adapter + crawl
target per company, validated against real, publicly reachable pages
(URL lists checked against each site's robots.txt, cached locally, capped
at a handful of pages per site):

Font-family is the largest contributor, resolving to "Mona Sans" in places instead of the token's "Mona Sans VF", a marketing-vs-app font naming inconsistency.

Legacy /projects/<KEY>/summary pages resolve to a generic OS font stack, not "Atlassian Sans"; drift concentrates in older, unmigrated UI, not the homepage.

Not a matcher bug, but not a trustworthy baseline either: confirmed via DOM inspection that neither page (nor any other publicly reachable shopify.dev/polaris.shopify.com/storybook URL) renders actual Polaris components (no Polaris- classes, no Polaris custom elements). This is a generic docs-shell score, not comparable to the other three companies' on-spec numbers.