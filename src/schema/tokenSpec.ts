/**
 * Canonical brand token spec: the diff target. Supplied by the integrating
 * company (JSON today; YAML can be added at the ingestion boundary without
 * touching this shape).
 */
export interface TokenSpec {
  /** token name -> hex color, e.g. { "brand-primary": "#3366FF" } */
  colors: Record<string, string>;
  /**
   * Optional per-theme color overrides, e.g. { dark: { "brand-primary":
   * "#7A9CFF" } }. A resolved color matching a theme variant should score
   * as compliant, not as an unrelated deviation from the light-mode value.
   */
  themes?: Record<string, Record<string, string>>;
  /** allowed spacing scale in px, e.g. [4, 8, 16, 24, 32] */
  spacing: number[];
  /** allowed border-radius scale in px */
  radius: number[];
  /** allowed font-size scale in px */
  fontSize: number[];
  /** allowed font-family stacks, categorical (exact string match) */
  fontFamily: string[];
  /** allowed font-weight values, e.g. [400, 500, 700] */
  fontWeight: number[];
}

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export class TokenSpecError extends Error {}

function assertNumberArray(value: unknown, field: string): asserts value is number[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TokenSpecError(`token spec field "${field}" must be a non-empty array`);
  }
  for (const v of value) {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new TokenSpecError(`token spec field "${field}" must contain only finite numbers, got ${JSON.stringify(v)}`);
    }
  }
}

/**
 * Validates a raw parsed object against the TokenSpec shape. Throws
 * TokenSpecError with a specific field-level message on the first problem
 * found — a malformed spec should fail loudly at ingestion, not silently
 * produce a diff engine that scores everything as deviant.
 */
export function validateTokenSpec(raw: unknown): TokenSpec {
  if (typeof raw !== "object" || raw === null) {
    throw new TokenSpecError("token spec must be a JSON object");
  }
  const spec = raw as Record<string, unknown>;

  if (typeof spec.colors !== "object" || spec.colors === null || Array.isArray(spec.colors)) {
    throw new TokenSpecError('token spec field "colors" must be an object of name -> hex string');
  }
  const colors = spec.colors as Record<string, unknown>;
  if (Object.keys(colors).length === 0) {
    throw new TokenSpecError('token spec field "colors" must define at least one color');
  }
  for (const [name, value] of Object.entries(colors)) {
    if (typeof value !== "string" || !HEX_RE.test(value)) {
      throw new TokenSpecError(`token spec color "${name}" must be a hex string (#rgb or #rrggbb), got ${JSON.stringify(value)}`);
    }
  }

  let themes: Record<string, Record<string, string>> | undefined;
  if (spec.themes !== undefined) {
    if (typeof spec.themes !== "object" || spec.themes === null || Array.isArray(spec.themes)) {
      throw new TokenSpecError('token spec field "themes" must be an object of theme name -> color map');
    }
    themes = {};
    for (const [themeName, themeColors] of Object.entries(spec.themes as Record<string, unknown>)) {
      if (typeof themeColors !== "object" || themeColors === null || Array.isArray(themeColors)) {
        throw new TokenSpecError(`token spec theme "${themeName}" must be an object of name -> hex string`);
      }
      for (const [name, value] of Object.entries(themeColors as Record<string, unknown>)) {
        if (typeof value !== "string" || !HEX_RE.test(value)) {
          throw new TokenSpecError(`token spec theme "${themeName}" color "${name}" must be a hex string, got ${JSON.stringify(value)}`);
        }
      }
      themes[themeName] = { ...(themeColors as Record<string, string>) };
    }
  }

  assertNumberArray(spec.spacing, "spacing");
  assertNumberArray(spec.radius, "radius");
  assertNumberArray(spec.fontSize, "fontSize");
  assertNumberArray(spec.fontWeight, "fontWeight");

  if (!Array.isArray(spec.fontFamily) || spec.fontFamily.length === 0) {
    throw new TokenSpecError('token spec field "fontFamily" must be a non-empty array of strings');
  }
  for (const v of spec.fontFamily) {
    if (typeof v !== "string" || v.trim() === "") {
      throw new TokenSpecError(`token spec field "fontFamily" must contain only non-empty strings, got ${JSON.stringify(v)}`);
    }
  }

  return {
    colors: { ...colors } as Record<string, string>,
    ...(themes ? { themes } : {}),
    spacing: [...(spec.spacing as number[])].sort((a, b) => a - b),
    radius: [...(spec.radius as number[])].sort((a, b) => a - b),
    fontSize: [...(spec.fontSize as number[])].sort((a, b) => a - b),
    fontFamily: [...(spec.fontFamily as string[])],
    fontWeight: [...(spec.fontWeight as number[])].sort((a, b) => a - b),
  };
}

export function loadTokenSpec(json: string): TokenSpec {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (e) {
    throw new TokenSpecError(`token spec is not valid JSON: ${(e as Error).message}`);
  }
  return validateTokenSpec(raw);
}
