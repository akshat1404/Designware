import type { PropertyDeviation } from "../matchers/types.js";
import { parseCssColor } from "../color/convert.js";

/** First font name in a CSS font-family stack, quotes stripped, original case kept (unlike matchFontFamily's lowercased comparison copy — this one is for display). */
function firstFamilyDisplay(stack: string): string {
  const first = stack.split(",")[0] ?? stack;
  return first.trim().replace(/^["']|["']$/g, "");
}

/** Coarse, human-recognizable hue bucket for a captured/resolved color — not a precision tool, just enough to say "shade of X" the way a person would. */
function hueBucket({ r, g, b }: { r: number; g: number; b: number }): string {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  const s = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));

  if (s < 0.12) {
    if (l > 0.92) return "white";
    if (l < 0.08) return "black";
    return "gray";
  }

  let h: number;
  if (max === min) h = 0;
  else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
  else if (max === g) h = 60 * ((b - r) / (max - min)) + 120;
  else h = 60 * ((r - g) / (max - min)) + 240;

  if (h < 15 || h >= 345) return "red";
  if (h < 45) return "orange";
  if (h < 70) return "yellow";
  if (h < 170) return "green";
  if (h < 200) return "cyan";
  if (h < 255) return "blue";
  if (h < 290) return "purple";
  return "pink";
}

/** "border-top-left-radius" -> "top-left corner radius"; anything else falls back to a generic label, keeping which side/corner is affected rather than losing it. */
function radiusLabel(detail: string | undefined): string {
  const match = detail?.match(/^border-(top|bottom)-(left|right)-radius$/);
  return match ? `${match[1]}-${match[2]} corner radius` : "corner radius";
}

function pxSentence(label: string, rawValue: string | number, resolvedValue: string | number): string {
  return `${label} is ${rawValue}px, should be ${resolvedValue}px`;
}

function colorSentence(deviation: PropertyDeviation, resolvedValue: string): string {
  const label = deviation.property === "color" ? "color" : deviation.property === "background-color" ? "background color" : "border color";
  const targetHue = hueBucket(parseCssColor(resolvedValue));
  return `${label} is a different shade than the brand palette — closest match is ${deviation.nearestToken}, a ${targetHue} (${resolvedValue})`;
}

function fontFamilySentence(deviation: PropertyDeviation, resolvedValue: string): string {
  const used = firstFamilyDisplay(String(deviation.rawValue));
  return `using "${used}" instead of "${resolvedValue}"`;
}

function fontWeightSentence(deviation: PropertyDeviation, resolvedValue: number): string {
  const raw = Number(deviation.rawValue);
  const cmp = resolvedValue > raw ? "heavier" : resolvedValue < raw ? "lighter" : "different";
  return `font weight is ${raw}, should be ${resolvedValue} (${cmp} than what's used)`;
}

/**
 * Plain-English sentence describing one deviation, for humans skimming the
 * worst-offenders table — the raw fields (rawValue/nearestToken/distance)
 * stay on the entry too, this is additive. `resolvedValue` is the actual
 * spec value the token resolves to (get it via `resolveToken(deviation.nearestToken,
 * spec)` — don't re-parse `nearestToken` here, that's exactly what the
 * resolver already does).
 */
export function humanizeDeviation(deviation: PropertyDeviation, resolvedValue: string | number): string {
  switch (deviation.property) {
    case "spacing":
      return pxSentence(deviation.detail ?? "spacing", deviation.rawValue, resolvedValue);
    case "border-radius":
      return pxSentence(radiusLabel(deviation.detail), deviation.rawValue, resolvedValue);
    case "font-size":
      return pxSentence("font size", deviation.rawValue, resolvedValue);
    case "font-weight":
      return fontWeightSentence(deviation, resolvedValue as number);
    case "font-family":
      return fontFamilySentence(deviation, resolvedValue as string);
    case "color":
    case "background-color":
    case "border-color":
      return colorSentence(deviation, resolvedValue as string);
  }
}
