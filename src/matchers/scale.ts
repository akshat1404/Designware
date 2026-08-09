import type { PropertyDeviation, PropertyKind } from "./types.js";

const PX_RE = /^(-?[\d.]+)px$/;

export function parsePx(value: string): number {
  const match = value.trim().match(PX_RE);
  if (!match) {
    throw new Error(`expected a px value, got "${value}"`);
  }
  return Number(match[1]);
}

/**
 * Some computed values that are normally px aren't always — most notably
 * `border-radius` stays as a percentage (e.g. "50%" for a circular
 * avatar) when authored that way, since it's relative to the box's own
 * size rather than resolvable to an absolute length. A percentage isn't a
 * position on an absolute-px scale, so callers should skip scoring it
 * rather than crash or force a nonsensical comparison.
 */
export function isPxValue(value: string): boolean {
  return PX_RE.test(value.trim());
}

/**
 * Smallest gap between adjacent (sorted) scale values. Used as the
 * saturation reference for normalization: a deviation as large as the
 * scale's own step size is "fully off-scale", regardless of whether the
 * scale is coarse (spacing: 4/8/16/24/32) or fine (type: 12/13/14/16).
 * Falls back to 8 for a single-value scale, which has no gap to measure.
 */
function minGap(scale: number[]): number {
  if (scale.length < 2) return 8;
  let min = Infinity;
  for (let i = 1; i < scale.length; i++) {
    min = Math.min(min, scale[i] - scale[i - 1]);
  }
  return min > 0 ? min : 8;
}

/**
 * Matches a numeric px value (spacing, border-radius, font-size) against
 * the nearest value on the spec's defined scale. Distance is the raw px
 * gap to the nearest scale rung — this is what lets "20px" register as a
 * measurable deviation against a 4/8/16/24/32 scale even though 20 isn't
 * an arbitrary outlier, it's just off the grid.
 */
export function matchScale(cssValue: string, scale: number[], property: PropertyKind): PropertyDeviation {
  const value = parsePx(cssValue);

  // Zero is always "on scale": absence of spacing/radius is a deliberate
  // design choice, not drift from a scale that defines positive steps.
  if (value === 0) {
    return { property, rawValue: value, nearestToken: `${property}:0`, distance: 0, normalized: 0 };
  }

  const gap = minGap(scale);

  let nearest = scale[0];
  let distance = Math.abs(value - nearest);
  for (const candidate of scale) {
    const d = Math.abs(value - candidate);
    if (d < distance) {
      distance = d;
      nearest = candidate;
    }
  }

  return {
    property,
    rawValue: value,
    nearestToken: `${property}:${nearest}`,
    distance,
    normalized: Math.min(distance / gap, 1),
  };
}
