import type { PropertyDeviation } from "./types.js";

/** First font name in a CSS font-family stack, unquoted and lowercased. */
function firstFamily(stack: string): string {
  const first = stack.split(",")[0] ?? "";
  return first.trim().replace(/^["']|["']$/g, "").toLowerCase();
}

/**
 * Font family is categorical, not a distance metric: either the resolved
 * stack's primary family is one the spec allows, or it isn't. Weight is
 * checked separately (matchFontWeight) since a right-family/wrong-weight
 * value is a materially different problem from a wrong family entirely.
 */
export function matchFontFamily(cssValue: string, allowedFamilies: string[]): PropertyDeviation {
  const captured = firstFamily(cssValue);
  const allowedFirsts = allowedFamilies.map(firstFamily);
  const isAllowed = allowedFirsts.includes(captured);
  const matchIndex = allowedFirsts.indexOf(captured);

  return {
    property: "font-family",
    rawValue: cssValue,
    nearestToken: isAllowed ? `font-family:${allowedFamilies[matchIndex]}` : `font-family:${allowedFamilies[0]}`,
    distance: isAllowed ? 0 : 1,
    normalized: isAllowed ? 0 : 1,
  };
}

/**
 * Font weight is numeric but only meaningful at the scale's own steps
 * (usually multiples of 100), so distance is normalized against a fixed
 * 100-unit step rather than the spec's min-gap like matchScale — weight
 * scales are conventional, not brand-specific.
 */
export function matchFontWeight(cssValue: string, allowedWeights: number[]): PropertyDeviation {
  const value = Number(cssValue.trim());
  if (!Number.isFinite(value)) {
    throw new Error(`expected a numeric font-weight, got "${cssValue}"`);
  }

  let nearest = allowedWeights[0];
  let distance = Math.abs(value - nearest);
  for (const candidate of allowedWeights) {
    const d = Math.abs(value - candidate);
    if (d < distance) {
      distance = d;
      nearest = candidate;
    }
  }

  return {
    property: "font-weight",
    rawValue: value,
    nearestToken: `font-weight:${nearest}`,
    distance,
    normalized: Math.min(distance / 100, 1),
  };
}
