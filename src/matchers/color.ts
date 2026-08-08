import type { TokenSpec } from "../schema/tokenSpec.js";
import { parseCssColor, rgbToLab, deltaE2000, type RGBA } from "../color/convert.js";
import type { PropertyDeviation, PropertyKind } from "./types.js";

/**
 * Delta-E2000 above this is treated as a fully "different" color for
 * normalization purposes (saturates normalized deviation at 1.0). ~10 is
 * well past "clearly a different color" for most human observers; values
 * below ~2 are close to imperceptible.
 */
const COLOR_SATURATION_DE = 20;

interface ColorCandidate {
  tokenId: string;
  rgba: RGBA;
}

function buildCandidates(spec: TokenSpec): ColorCandidate[] {
  const candidates: ColorCandidate[] = [];
  for (const [name, hex] of Object.entries(spec.colors)) {
    candidates.push({ tokenId: `colors.${name}`, rgba: parseCssColor(hex) });
  }
  if (spec.themes) {
    for (const [themeName, colors] of Object.entries(spec.themes)) {
      for (const [name, hex] of Object.entries(colors)) {
        candidates.push({ tokenId: `theme:${themeName}.${name}`, rgba: parseCssColor(hex) });
      }
    }
  }
  return candidates;
}

/**
 * Matches a captured CSS color against the nearest token (across the base
 * palette and all declared theme variants) using Delta-E2000 in Lab space.
 *
 * Alpha is intentionally ignored in the distance calculation: an opacity
 * variant of a base token (e.g. `rgba(51,102,255,0.5)` over
 * `colors.brand-primary: #3366FF`) must resolve back to that token rather
 * than scoring as an unrelated color, per the brief's explicit edge case.
 * Theme-switched values are handled the same way — a dark-mode resolved
 * color that matches a declared `themes.dark` entry scores as compliant.
 */
export function matchColor(cssValue: string, spec: TokenSpec, property: PropertyKind = "color"): PropertyDeviation {
  const captured = parseCssColor(cssValue);
  const capturedLab = rgbToLab(captured);
  const candidates = buildCandidates(spec);

  let best: { tokenId: string; distance: number } | null = null;
  for (const candidate of candidates) {
    const distance = deltaE2000(capturedLab, rgbToLab(candidate.rgba));
    if (best === null || distance < best.distance) {
      best = { tokenId: candidate.tokenId, distance };
    }
  }

  if (best === null) {
    throw new Error("token spec has no colors to match against");
  }

  return {
    property,
    rawValue: cssValue,
    nearestToken: best.tokenId,
    distance: best.distance,
    normalized: Math.min(best.distance / COLOR_SATURATION_DE, 1),
    variantMatch: captured.a < 1 || best.tokenId.startsWith("theme:"),
  };
}
