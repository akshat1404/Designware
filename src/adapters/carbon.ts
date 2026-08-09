import * as themes from "@carbon/themes";
import * as colorsPkg from "@carbon/colors";
import * as layout from "@carbon/layout";
import type { TokenSpec } from "../schema/tokenSpec.js";
import { validateTokenSpec } from "../schema/tokenSpec.js";
import { parseCssColor } from "../color/convert.js";

/**
 * Carbon color tokens are mostly hex, but a handful of newer "AI" overlay
 * tokens are rgba() with alpha (e.g. glow/gradient effects). Both collapse
 * to plain 6-digit hex here, same rationale as the Primer adapter: our
 * color matcher already treats alpha as informational, not part of the
 * Delta-E distance.
 */
function toHex6(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{8}$/.test(value)) return value.slice(0, 7);
  if (/^rgba?\(/.test(value)) {
    try {
      const { r, g, b } = parseCssColor(value);
      return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function extractColors(theme: object): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    const hex = toHex6(value);
    if (hex) colors[key] = hex;
  }
  return colors;
}

function remToPx(value: string): number {
  const match = value.match(/^([\d.]+)rem$/);
  if (!match) throw new Error(`expected a rem value, got "${value}"`);
  return Number(match[1]) * 16;
}

interface TypeToken {
  fontSize: string;
  fontWeight: number;
}

function isTypeToken(value: unknown): value is TypeToken {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).fontSize === "string" &&
    typeof (value as Record<string, unknown>).fontWeight === "number"
  );
}

const SPACING_KEYS = [
  "spacing01", "spacing02", "spacing03", "spacing04", "spacing05", "spacing06",
  "spacing07", "spacing08", "spacing09", "spacing10", "spacing11", "spacing12", "spacing13",
  "layout01", "layout02", "layout03", "layout04", "layout05", "layout06", "layout07",
] as const;

/**
 * Normalizes @carbon/themes + @carbon/colors + @carbon/layout (IBM's
 * design tokens) into the internal TokenSpec shape. Color tokens are
 * theme-scoped (`themes.white`/`themes.g100`); typography composites
 * (fontSize+fontWeight objects like `bodyShort01`) live at the top level
 * of `@carbon/themes` since type doesn't vary by color theme.
 */
export function carbonAdapter(): TokenSpec {
  const lightColors = {
    ...extractColors(themes.white as object),
    ...extractColors(colorsPkg as object),
  };
  const darkColors = extractColors(themes.g100 as object);

  const layoutRecord = layout as unknown as Record<string, string>;
  const spacing = SPACING_KEYS.map((key) => remToPx(layoutRecord[key]));

  const fontSize: number[] = [];
  const fontWeight: number[] = [];
  for (const value of Object.values(themes)) {
    if (isTypeToken(value)) {
      fontSize.push(remToPx(value.fontSize));
      fontWeight.push(value.fontWeight);
    }
  }

  return validateTokenSpec({
    colors: lightColors,
    themes: { dark: darkColors },
    spacing: [...new Set(spacing)],
    // Carbon exposes no radius token in @carbon/themes/@carbon/colors/@carbon/layout.
    // 0 reflects Carbon's documented square-corner visual language (buttons, inputs,
    // and tiles ship with no border-radius by default) — a disclosed judgment call,
    // not a value pulled from an installed package like the rest of this adapter.
    radius: [0],
    fontSize: [...new Set(fontSize)],
    // IBM Plex Sans/Mono are Carbon's documented global font stacks (set via
    // @carbon/styles' CSS reset), not exposed as a token in these three packages —
    // same disclosed fallback treatment as radius above. Confirmed against a live
    // on-spec crawl (carbondesignsystem.com) that the shipped CSS actually names the
    // variable-font build "IBM Plex Sans Var" (not plain "IBM Plex Sans") for body
    // text, and "IBM Plex Mono" for code — both variants listed for each.
    fontFamily: ["IBM Plex Sans Var", "IBM Plex Sans", "IBM Plex Mono", "sans-serif"],
    fontWeight: [...new Set(fontWeight)],
  });
}
