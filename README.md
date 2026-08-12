# Brand Deviation Detection Engine

Deviation-detection engine for software products: diffs a running app's
*resolved* styles against a company's own brand token spec, and reports how
far they've drifted. Closer in spirit to Lighthouse/Sentry/a linter-as-a-
service than to a design tool — see
[brand-deviation-engine-brief.md](brand-deviation-engine-brief.md) for the
full problem statement and design rationale.

## Approach

Headlessly drives the real app (Playwright) and reads `getComputedStyle()`
per element — the exact value the rendering engine used to paint the pixel,
after cascade/inheritance/theming/runtime JS have resolved. Not pixel
estimation (CV is parked as a fallback for the canvas/SVG/raster long tail).

- **Color** — Delta-E (CIEDE2000) in Lab space against the spec's palette,
  alpha- and theme-variant aware (an opacity or dark-mode variant of a token
  resolves back to that token instead of scoring as unrelated drift).
- **Spacing / radius / font-size** — distance to the nearest value on the
  spec's defined scale.
- **Font family / weight** — categorical family match, weight as a
  secondary numeric check.
- **Aggregation** — instance → component → page → product rollup into a
  0–100 deviation score.

## Project layout

```
src/
  schema/tokenSpec.ts       token spec shape + validator (the diff target)
  color/convert.ts          sRGB -> Lab, CIEDE2000
  matchers/                 color / scale / font matchers -> PropertyDeviation
  extractor/
    extract.ts               tag-based extraction (data-component), used by fixtures
    sample.ts                 generic visible-element sampling for real pages
    stabilize.ts               animation-disable, cookie-banner dismissal, lazy-load trigger
  aggregator/aggregate.ts    instance -> component -> page -> product rollup, worst-offenders, breakdown
  adapters/                  per-company token-package -> TokenSpec normalizers (Level 2)
  targets/                   per-company crawl target definitions + registry (Level 2)
  cache/cache.ts             content-addressed extraction cache (Level 2, gitignored)
  report/report.ts           JSON + markdown report writer (Level 2, gitignored output)
  pipeline.ts                Level 1 orchestrator: spec -> extract -> match -> aggregate
  validate.ts                Level 2 CLI: spec (via adapter) -> crawl -> match -> aggregate -> report
  cli.ts                     Level 1 CLI: runs pipeline against the synthetic fixtures
fixtures/                    synthetic compliant/deviant HTML + token spec
test/                        unit tests + end-to-end pipeline test
```

## Running

```
npm install
npx playwright install chromium
npm test
npm run report                          # Level 1: run against synthetic fixtures
npm run validate -- --target=github     # Level 2: run against a real company (see targets/registry.ts)
npm run validate -- --target=all        # Level 2: run against every registered target
```

## Status

**Level 1 (core pipeline)** — schema, color/scale/font matchers, extractor,
aggregator — built and validated against synthetic fixtures (a compliant
component set and a deviant one with known, hand-computed injected
deviations).

**Level 2 (public design-system validation)** — one token adapter + crawl
target per company, validated against real, publicly reachable pages
(URL lists checked against each site's robots.txt, cached locally, capped
at a handful of pages per site):

| Target | Kind | Score | Notable finding |
|---|---|---|---|
| GitHub (github.com) | real-app | 7.1/100 | Font-family is the largest contributor — resolves to `"Mona Sans"` in places, not the token's `"Mona Sans VF"` — a marketing-vs-app font naming inconsistency |
| Carbon (carbondesignsystem.com) | on-spec | 1.8/100 | Residual noise is doc-site-shell CSS resets, not component drift |
| IBM (ibm.com) | real-app | 2.0/100 | Helvetica fallback where Plex is expected; marketing-hero type/spacing/radius beyond the core component scale |
| Atlassian Design (atlassian.design) | on-spec | 1.9/100 | Near-zero; residual noise is oversized marketing headings |
| Jira (jira.atlassian.com) | real-app | 18.3/100 | Legacy `/projects/<KEY>/summary` pages resolve to a generic OS font stack, not `"Atlassian Sans"` — drift concentrates in older, unmigrated UI, not the homepage |
| Shopify Polaris (shopify.dev) | on-spec, **unverified** | 15.5/100 | Not a matcher bug, but not a trustworthy baseline either: confirmed via DOM inspection that neither page (nor any other publicly reachable shopify.dev/polaris.shopify.com/storybook URL) renders actual Polaris components — no `Polaris-` classes, no Polaris custom elements. This is a generic docs-shell score, not comparable to the other three companies' on-spec numbers |

Two real bugs were found and fixed during this validation (not synthetic
fixtures — genuinely surfaced by messy real-world pages):

1. `border-radius` can resolve to a percentage (e.g. `50%` on a circular
   avatar) instead of px — the scale matcher now skips non-px values
   rather than crashing.
2. Heavy real sites often never reach Playwright's `networkidle` state
   (persistent analytics/chat-widget connections) — navigation now uses
   `domcontentloaded` with a best-effort, non-fatal `networkidle` attempt
   afterward, rather than a hard timeout that silently marked every page
   unstable.

A third, more structural bug was caught by comparing on-spec vs. real-app
scores against each other: the instance score was a flat mean across every
pushed property, and spacing structurally contributes far more entries
(8: four padding + four margin sides) than any other category, so it
diluted color/typography deviations almost to invisibility. Fixed by
averaging *category* means (color, spacing, typography, radius) instead of
a flat per-property mean — confirmed by the on-spec/real-app score
ordering becoming directionally correct (real-app now scores at or above
its own on-spec baseline, not below it).

Each target's `reports/<key>/` also has an HTML overlay (captured
screenshot with flagged deviations boxed, color-coded by category) and a
corrected-render PNG (same page, layout-safe properties — color,
background-color, border-color, border-radius, font-family — patched to
their nearest token in the same live session, before the page closes) per
crawled page, linked from that target's `summary.md`.

Deliberately unresolved for now (deployment/integration decisions, not
blocking the core math):

1. **Integration surface** — CI gate vs. periodic dashboard/monitoring.
2. **First render target** — Storybook instance vs. a live running app.
3. **Spec bootstrap** — hard-require a pre-existing token spec, or also
   support inferring one from a company's most consistent existing pages.
