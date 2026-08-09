import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { TokenSpec } from "../schema/tokenSpec.js";
import { validateTokenSpec } from "../schema/tokenSpec.js";

const require = createRequire(import.meta.url);
const PKG_ROOT = path.dirname(require.resolve("@primer/primitives/package.json"));
// The package ships no JS entry point (no "main"/"exports") — its real
// output is these pre-built, fully-resolved "docs" JSON files (one flat
// {tokenName: {value, type, ...}} map per category), not something you
// import. Raw dist/*.css exists too but still has var()-chained values;
// these are already resolved to final hex/rem values.
const DOCS = path.join(PKG_ROOT, "dist", "docs");

interface RawToken {
  value: string | number;
  type: string;
}

function readTokenFile(relativePath: string): Record<string, RawToken> {
  return JSON.parse(readFileSync(path.join(DOCS, relativePath), "utf-8"));
}

function remToPx(value: string): number {
  const match = value.match(/^([\d.]+)rem$/);
  if (!match) throw new Error(`expected a rem value, got "${value}"`);
  return Number(match[1]) * 16;
}

/**
 * Primer's muted/subtle color tokens use 8-digit hex (#rrggbbaa). Our
 * color matcher already treats alpha as informational — an opacity
 * variant of a token resolves back to that token rather than scoring as a
 * distinct color (see matchers/color.ts) — so collapsing to 6-digit here
 * just keeps ingestion consistent with a distance calculation that was
 * always going to ignore alpha anyway, rather than rejecting the token.
 */
function normalizeHex(hex: string): string {
  return hex.length === 9 ? hex.slice(0, 7) : hex;
}

function firstFamily(stack: string): string {
  return stack.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
}

function extractColors(theme: Record<string, RawToken>): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [key, token] of Object.entries(theme)) {
    if (token.type === "color") {
      colors[key] = normalizeHex(token.value as string);
    }
  }
  return colors;
}

/** Normalizes @primer/primitives (GitHub's design tokens) into the internal TokenSpec shape. */
export function primerAdapter(): TokenSpec {
  const light = readTokenFile("functional/themes/light.json");
  const dark = readTokenFile("functional/themes/dark.json");
  const space = readTokenFile("functional/spacing/space.json");
  const radius = readTokenFile("functional/size/radius.json");
  const baseTypography = readTokenFile("base/typography/typography.json");
  const functionalTypography = readTokenFile("functional/typography/typography.json");

  const spacing = Object.values(space)
    .filter((t) => t.type === "dimension")
    .map((t) => remToPx(t.value as string));

  const radiusScale = Object.values(radius)
    .filter((t) => t.type === "dimension")
    .map((t) => remToPx(t.value as string));

  const fontSize = Object.entries(baseTypography)
    .filter(([key, t]) => key.includes("text-size") && t.type === "dimension")
    .map(([, t]) => remToPx(t.value as string));

  const fontWeight = Object.entries(baseTypography)
    .filter(([key, t]) => key.includes("text-weight") && t.type === "fontWeight")
    .map(([, t]) => Number(t.value));

  const fontFamily = Object.values(functionalTypography)
    .filter((t) => t.type === "fontFamily")
    .map((t) => firstFamily(t.value as string));

  return validateTokenSpec({
    colors: extractColors(light),
    themes: { dark: extractColors(dark) },
    spacing: [...new Set(spacing)],
    radius: [...new Set(radiusScale)],
    fontSize: [...new Set(fontSize)],
    fontFamily: [...new Set(fontFamily)],
    fontWeight: [...new Set(fontWeight)],
  });
}
