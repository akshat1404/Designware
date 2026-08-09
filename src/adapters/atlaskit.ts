import { createRequire } from "node:module";
import type { TokenSpec } from "../schema/tokenSpec.js";
import { validateTokenSpec } from "../schema/tokenSpec.js";

interface RawToken {
  name: string;
  value: unknown;
}

interface TokensRawModule {
  light: readonly RawToken[];
  dark: readonly RawToken[];
  spacing: readonly RawToken[];
  shape: readonly RawToken[];
  typography: readonly RawToken[];
}

// The "@atlaskit/tokens/tokens-raw" subpath is a directory package (its own
// nested package.json "main"), which Node's strict ESM resolver won't
// follow without an "exports" map in the root package.json — @atlaskit/tokens
// doesn't declare one. require() follows Node's classic CJS resolution
// algorithm instead, which does honor it, same workaround as the Primer
// adapter's non-standard package layout.
const require = createRequire(import.meta.url);
const { light, dark, spacing, shape, typography } = require("@atlaskit/tokens/tokens-raw") as TokensRawModule;

/** 8-digit alpha hex collapses to 6-digit — same rationale as the other adapters. */
function normalizeHex(hex: string): string {
  return hex.length === 9 ? hex.slice(0, 7) : hex;
}

function extractColors(theme: readonly RawToken[]): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const token of theme) {
    if (typeof token.value === "string" && /^#[0-9a-fA-F]{3,8}$/.test(token.value)) {
      colors[token.name] = normalizeHex(token.value);
    }
  }
  return colors;
}

function extractPxScale(tokens: readonly RawToken[]): number[] {
  const values: number[] = [];
  for (const token of tokens) {
    if (typeof token.value === "string") {
      const match = token.value.match(/^(-?[\d.]+)px$/);
      if (match) values.push(Number(match[1]));
    }
  }
  return values;
}

function firstFamily(stack: string): string {
  return stack.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
}

/**
 * Atlaskit's heading/body/metric/code typography tokens are full CSS font
 * shorthand strings, e.g. `normal 653 32px/36px "Atlassian Sans", ...`.
 * Pulls just the size out of the `<size>/<lineHeight>` segment; the one
 * code token uses `em` (relative to a 16px base) instead of `px`.
 */
function parseShorthandFontSizePx(value: string): number | undefined {
  const match = value.match(/(\d+(?:\.\d+)?)(px|em)\/[\d.]+(?:px|em)/);
  if (!match) return undefined;
  const size = Number(match[1]);
  return match[2] === "em" ? size * 16 : size;
}

/** Normalizes @atlaskit/tokens (Atlassian's design tokens) into the internal TokenSpec shape. */
export function atlaskitAdapter(): TokenSpec {
  const fontFamily: string[] = [];
  const fontWeight: number[] = [];
  const fontSize: number[] = [];

  for (const token of typography) {
    if (typeof token.value !== "string") continue;
    if (token.name.startsWith("font.family.")) {
      fontFamily.push(firstFamily(token.value));
    } else if (token.name.startsWith("font.weight.")) {
      fontWeight.push(Number(token.value));
    } else {
      const size = parseShorthandFontSizePx(token.value);
      if (size !== undefined) fontSize.push(size);
    }
  }

  return validateTokenSpec({
    colors: extractColors(light),
    themes: { dark: extractColors(dark) },
    spacing: [...new Set(extractPxScale(spacing))],
    radius: [...new Set(extractPxScale(shape))],
    fontSize: [...new Set(fontSize)],
    fontFamily: [...new Set(fontFamily)],
    fontWeight: [...new Set(fontWeight)],
  });
}
