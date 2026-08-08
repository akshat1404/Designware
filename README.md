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
  schema/tokenSpec.ts    token spec shape + validator (the diff target)
  color/convert.ts        sRGB -> Lab, CIEDE2000
  matchers/                color / scale / font matchers -> PropertyDeviation
  extractor/extract.ts    Playwright: getComputedStyle() per tagged element
  aggregator/aggregate.ts instance -> component -> page -> product rollup
  pipeline.ts              orchestrator: spec -> extract -> match -> aggregate
fixtures/                  synthetic compliant/deviant HTML + token spec
test/                      unit tests + end-to-end pipeline test
```

## Running

```
npm install
npx playwright install chromium
npm test
```

## Status

Core detection pipeline (schema, color/scale/font matchers, extractor,
aggregator) is built and validated against synthetic fixtures — a
compliant component set and a deviant one with known, hand-computed
injected deviations.

Deliberately unresolved for now (deployment/integration decisions, not
blocking the core math):

1. **Integration surface** — CI gate vs. periodic dashboard/monitoring.
2. **First render target** — Storybook instance vs. a live running app.
3. **Spec bootstrap** — hard-require a pre-existing token spec, or also
   support inferring one from a company's most consistent existing pages.
