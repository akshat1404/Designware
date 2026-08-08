# Project Brief: Brand Deviation Detection Engine

## Problem Statement

Companies (and individuals) produce multiple products, tools, and pieces of content that
often fail to visually signal they belong to the same origin. This usually isn't random —
it's independent teams, no shared design-system ownership, or organic growth without a
central visual authority. The result: a user can't tell two products are from the same
company just by looking at them.

## What This Project Is (and Isn't)

**This is not a brand-identity builder.** It does not create palettes, logos, or design
systems. It assumes those already exist somewhere (a token spec, a style guide, a design
system) and treats that as an external input it doesn't control.

**This is a deviation-detection engine** — infrastructure that plugs into *other*
companies' software and reports how far their shipped product has drifted from their own
stated brand spec. Closer in spirit to Lighthouse, Sentry, or a linter-as-a-service than to
a design tool. The "user" is a developer or design-systems team at another company, not an
end consumer.

## Current Scope (deliberately narrowed)

- **Layer**: Deterministic only — color, spacing, typography, border-radius. Voice/tone/
  content-shape (the "generative layer") is explicitly out of scope for now.
- **Target**: Software products only. Blogs, posts, and other published content are
  excluded from this phase.

## Core Approach: Runtime Resolved-Style Extraction ("Route B")

Two possible techniques were considered:

- **Route A — Pixel-based computer vision**: screenshot the UI, infer color/spacing/font
  from raw pixels (k-means clustering, edge detection, OCR + font matching). Inherently an
  *estimation* problem — fights anti-aliasing, compression artifacts, and font-matching
  ambiguity. Adds a confidence/error margin to every value.
- **Route B — Resolved-style extraction (chosen approach)**: drive the real, running app
  headlessly (e.g. Playwright) and query the browser directly via `getComputedStyle()` for
  every visible element, after the CSS cascade, inheritance, theming, and any runtime JS
  have all resolved. This is not a guess — it's the exact value the rendering engine used
  to paint the pixel. Also uniquely catches drift that static source analysis can't see:
  third-party component defaults, cascade wins, inherited values nobody explicitly set.

**Route A is parked as a fallback**, only necessary for the narrow category with no DOM
style to query: `<canvas>` drawings, SVG gradients baked into files, raster image/logo
assets.

## Deviation Math

- **Color**: Delta-E (CIEDE2000) in Lab color space, not raw RGB distance — matches human
  perceptual difference rather than naive numeric distance.
- **Spacing / radius / font-size**: distance from the nearest value on the defined scale
  (e.g. spec scale is 4/8/16/24/32px — a used value of 20 has a measurable deviation).
- **Font family**: largely categorical (right/wrong), weight as a secondary check.
- **Aggregation**: roll instance-level deviations up to component → page → product, so the
  output is a reportable score, not just a wall of individual flags.
- **Edge cases to handle explicitly**: opacity/alpha variants of a token color, and
  dark-mode/theme-switched values, should resolve back to their base token rather than
  scoring as unrelated deviations. Getting this wrong makes the tool cry wolf and erodes
  trust fast.

## Pipeline (draft shape)

1. **Token spec ingestion** — the integrating company supplies their canonical scale
   (colors, spacing, type, radius) in a structured format (JSON/YAML). This is a hard
   dependency: no spec, no diff target.
2. **Crawl/route selection** — fixed route list, sitemap/router-config discovery, or (better
   for MVP) a Storybook instance if one exists, since it isolates components in every state
   without needing auth/seeded data.
3. **Headless render** — Playwright loads each target.
4. **Stabilization** — disable animations, wait for network idle, seed fixed data (avatars,
   timestamps). Without this, captures are non-deterministic and the score becomes noise.
5. **Capture, per element**:
   - `getComputedStyle()` → feeds the deterministic diff engine
   - Screenshot → human review record + fallback for the canvas/SVG long tail
6. **State-space expansion** — same component across hover/focus/disabled/error states, and
   across breakpoints. Most real brand drift hides in states teams forget (error states
   especially), not just the default view.
7. **Matcher** — nearest-token distance per extracted value (Delta-E for color, scale
   distance for spacing/type/radius).
8. **Aggregator + report** — composite deviation score per component/page/product, ideally
   trackable over time (drift dashboard).

## Open Decisions (unresolved — pick up next)

1. **Integration surface**: CI gate that fails a PR past a deviation threshold, vs. a
   periodic dashboard/monitoring service, vs. something else. This decides whether the
   product is fundamentally build-time or observational.
2. **First render target**: Storybook instance (easier MVP — isolated components, all
   states enumerable) vs. a live running app with real routes (matches what most
   integrating companies will actually have available).
3. **Spec bootstrap mode**: does the tool require a pre-existing structured token spec as a
   hard precondition, or does it also need a fallback mode that infers a plausible spec from
   a company's *most consistent* existing pages, for teams who've never formalized one?

## Explicitly Out of Scope (for now)

- Building or authoring brand identities/design systems themselves
- Voice/tone/linguistic consistency (the "generative layer")
- Content mediums outside software products (blog posts, social content, etc.)
- Pixel-based CV as a primary mechanism (fallback only)
