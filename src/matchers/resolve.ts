import type { TokenSpec } from "../schema/tokenSpec.js";

const NUMERIC_PREFIXES = ["spacing:", "border-radius:", "font-size:", "font-weight:"] as const;

/**
 * Inverse of the matchers: given a `nearestToken` id (as produced by
 * matchColor/matchScale/matchFontFamily/matchFontWeight) and the spec it
 * was matched against, returns the actual injectable CSS value.
 *
 * Color token ids are *references* (a name into `spec.colors`/`spec.themes`)
 * because colors are stored as a name -> hex map, so resolving them needs a
 * spec lookup. Every other category's token id already embeds its own
 * resolved value (the number/string after the colon came directly from
 * snapping to `spec.spacing`/`spec.radius`/etc. or from the allowed
 * font-family list), so resolving those is just parsing, not a lookup.
 */
export function resolveToken(nearestToken: string, spec: TokenSpec): string | number {
  if (nearestToken.startsWith("colors.")) {
    const name = nearestToken.slice("colors.".length);
    const hex = spec.colors[name];
    if (hex === undefined) {
      throw new Error(`resolveToken: no color named "${name}" in token spec`);
    }
    return hex;
  }

  if (nearestToken.startsWith("theme:")) {
    const rest = nearestToken.slice("theme:".length);
    const dotIndex = rest.indexOf(".");
    if (dotIndex === -1) {
      throw new Error(`resolveToken: malformed theme token id "${nearestToken}"`);
    }
    const themeName = rest.slice(0, dotIndex);
    const name = rest.slice(dotIndex + 1);
    const hex = spec.themes?.[themeName]?.[name];
    if (hex === undefined) {
      throw new Error(`resolveToken: no color named "${name}" in theme "${themeName}"`);
    }
    return hex;
  }

  for (const prefix of NUMERIC_PREFIXES) {
    if (nearestToken.startsWith(prefix)) {
      const raw = nearestToken.slice(prefix.length);
      const value = Number(raw);
      if (!Number.isFinite(value)) {
        throw new Error(`resolveToken: expected a numeric value after "${prefix}", got "${raw}"`);
      }
      return value;
    }
  }

  if (nearestToken.startsWith("font-family:")) {
    return nearestToken.slice("font-family:".length);
  }

  throw new Error(`resolveToken: unrecognized token id "${nearestToken}"`);
}
