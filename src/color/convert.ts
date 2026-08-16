/** RGBA in 0-255 (rgb) / 0-1 (alpha) space, as returned by getComputedStyle. */
export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Lab {
  L: number;
  a: number;
  b: number;
}

const CSS_RGB_RE = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;
const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Parses the two color formats we actually need to handle: hex (from a
 * token spec) and rgb()/rgba() (what getComputedStyle always resolves to,
 * regardless of how the source CSS was authored).
 */
export function parseCssColor(input: string): RGBA {
  const trimmed = input.trim();

  const rgbMatch = trimmed.match(CSS_RGB_RE);
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? Number(rgbMatch[4]) : 1,
    };
  }

  const hexMatch = trimmed.match(HEX_RE);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b, a: 1 };
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }

  if (trimmed === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  throw new Error(`unrecognized CSS color format: "${input}"`);
}

export function srgbChannelToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * WCAG 2.1 relative luminance (https://www.w3.org/TR/WCAG21/#dfn-relative-luminance):
 * same sRGB gamma-decode as the Lab pipeline above (srgbChannelToLinear),
 * weighted by the standard's own (rounded) luminosity coefficients rather
 * than the unrounded XYZ Y-row used for Lab — WCAG's published formula and
 * conformance tools (e.g. WebAIM) use these exact constants, so matching
 * them here is what makes computed ratios line up with published examples.
 */
export function relativeLuminance({ r, g, b }: RGBA): number {
  const rl = srgbChannelToLinear(r);
  const gl = srgbChannelToLinear(g);
  const bl = srgbChannelToLinear(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** WCAG contrast ratio (https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio) between two sRGB colors, ignoring alpha — always >= 1, order-independent. */
export function contrastRatio(c1: RGBA, c2: RGBA): number {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// D65 reference white, sRGB primaries.
const XN = 95.047;
const YN = 100.0;
const ZN = 108.883;

function labF(t: number): number {
  const delta = 6 / 29;
  return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}

/** sRGB (0-255 per channel) -> CIE Lab (D65), ignoring alpha. */
export function rgbToLab({ r, g, b }: RGBA): Lab {
  const rl = srgbChannelToLinear(r);
  const gl = srgbChannelToLinear(g);
  const bl = srgbChannelToLinear(b);

  // linear sRGB -> XYZ
  const x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) * 100;
  const y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175) * 100;
  const z = (rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041) * 100;

  const fx = labF(x / XN);
  const fy = labF(y / YN);
  const fz = labF(z / ZN);

  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}
function rad2deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * CIEDE2000 color difference between two Lab colors. Standard formula
 * (Sharma, Wu, Dalal 2005) — chosen over CIE76/94 because it corrects known
 * perceptual non-uniformities in blue and gray regions that raw Lab
 * Euclidean distance gets wrong.
 */
export function deltaE2000(lab1: Lab, lab2: Lab): number {
  const { L: L1, a: a1, b: b1 } = lab1;
  const { L: L2, a: a2, b: b2 } = lab2;

  const kL = 1;
  const kC = 1;
  const kH = 1;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const CBar = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(CBar, 7) / (Math.pow(CBar, 7) + Math.pow(25, 7))));

  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  const h1p = a1p === 0 && b1 === 0 ? 0 : (rad2deg(Math.atan2(b1, a1p)) + 360) % 360;
  const h2p = a2p === 0 && b2 === 0 ? 0 : (rad2deg(Math.atan2(b2, a2p)) + 360) % 360;

  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp: number;
  if (C1p * C2p === 0) {
    dhp = 0;
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p;
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360;
  } else {
    dhp = h2p - h1p + 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deg2rad(dhp) / 2);

  const LBarp = (L1 + L2) / 2;
  const CBarp = (C1p + C2p) / 2;

  let HBarp: number;
  if (C1p * C2p === 0) {
    HBarp = h1p + h2p;
  } else if (Math.abs(h1p - h2p) <= 180) {
    HBarp = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    HBarp = (h1p + h2p + 360) / 2;
  } else {
    HBarp = (h1p + h2p - 360) / 2;
  }

  const T =
    1 -
    0.17 * Math.cos(deg2rad(HBarp - 30)) +
    0.24 * Math.cos(deg2rad(2 * HBarp)) +
    0.32 * Math.cos(deg2rad(3 * HBarp + 6)) -
    0.2 * Math.cos(deg2rad(4 * HBarp - 63));

  const dTheta = 30 * Math.exp(-Math.pow((HBarp - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(CBarp, 7) / (Math.pow(CBarp, 7) + Math.pow(25, 7)));
  const SL = 1 + (0.015 * Math.pow(LBarp - 50, 2)) / Math.sqrt(20 + Math.pow(LBarp - 50, 2));
  const SC = 1 + 0.045 * CBarp;
  const SH = 1 + 0.015 * CBarp * T;
  const RT = -Math.sin(deg2rad(2 * dTheta)) * RC;

  const termL = dLp / (kL * SL);
  const termC = dCp / (kC * SC);
  const termH = dHp / (kH * SH);

  return Math.sqrt(termL * termL + termC * termC + termH * termH + RT * termC * termH);
}

/** Convenience: Delta-E2000 directly between two sRGB colors, ignoring alpha. */
export function deltaE2000Rgb(c1: RGBA, c2: RGBA): number {
  return deltaE2000(rgbToLab(c1), rgbToLab(c2));
}
