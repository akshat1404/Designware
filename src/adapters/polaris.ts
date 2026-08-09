import { themeDefault, themes } from "@shopify/polaris-tokens";
import type { TokenSpec } from "../schema/tokenSpec.js";
import { validateTokenSpec } from "../schema/tokenSpec.js";
import { parseCssColor } from "../color/convert.js";

type TokenGroup = Record<string, string>;

function toHex6(value: string): string | undefined {
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

function extractColors(color: TokenGroup): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [key, value] of Object.entries(color)) {
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

function firstFamily(stack: string): string {
  return stack.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
}

/**
 * Normalizes @shopify/polaris-tokens into the internal TokenSpec shape.
 * Every category is already a flat, fully-qualified map (e.g.
 * `text-heading-lg-font-size`), not nested composites like Carbon's
 * typography tokens — extraction is just filtering by key suffix/prefix.
 */
export function polarisAdapter(): TokenSpec {
  const t = themeDefault;
  const dark = themes["dark-experimental"];

  const spacing = Object.values(t.space).map(remToPx);

  const radius = Object.entries(t.border)
    .filter(([key]) => key.startsWith("border-radius-"))
    .map(([, value]) => remToPx(value));

  const fontSize = Object.entries(t.text)
    .filter(([key]) => key.endsWith("-font-size"))
    .map(([, value]) => remToPx(value));

  const fontWeight = Object.entries(t.text)
    .filter(([key]) => key.endsWith("-font-weight"))
    .map(([, value]) => Number(value));

  const fontFamily = Object.entries(t.text)
    .filter(([key]) => key.endsWith("-font-family"))
    .map(([, value]) => firstFamily(value));

  return validateTokenSpec({
    colors: extractColors(t.color as TokenGroup),
    themes: { dark: extractColors(dark.color as TokenGroup) },
    spacing: [...new Set(spacing)],
    radius: [...new Set(radius)],
    fontSize: [...new Set(fontSize)],
    fontFamily: [...new Set(fontFamily)],
    fontWeight: [...new Set(fontWeight)],
  });
}
