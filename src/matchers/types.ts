export type PropertyKind =
  | "color"
  | "background-color"
  | "border-color"
  | "spacing"
  | "border-radius"
  | "font-size"
  | "font-family"
  | "font-weight";

/**
 * Result of matching one captured style value against the token spec.
 * `normalized` is always in [0, 1] so heterogeneous properties (Delta-E vs.
 * px distance vs. categorical) can be summed/averaged by the aggregator on
 * a common scale.
 */
export interface PropertyDeviation {
  property: PropertyKind;
  rawValue: string | number;
  /** human-readable id of the nearest spec token, e.g. "colors.brand-primary" or "spacing:16" or "theme:dark.brand-primary" */
  nearestToken: string;
  /** raw distance in the property's native unit (Delta-E, px, or 0/1) */
  distance: number;
  /** distance normalized to [0, 1] for cross-property aggregation */
  normalized: number;
  /** true if this value only deviates due to an alpha/opacity or theme variant already accounted for — informational, does not affect scoring */
  variantMatch?: boolean;
  /** exact CSS property this was extracted from, e.g. "padding-left" or "border-top-left-radius" */
  detail?: string;
}
