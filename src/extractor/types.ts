/** Raw getComputedStyle() values pulled for one DOM node, keyed by CSS property. */
export interface CapturedStyles {
  color: string;
  backgroundColor: string;
  borderTopColor: string;
  borderTopWidth: string;
  borderTopStyle: string;
  borderTopLeftRadius: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
}

/** Page-relative bounding box (accounts for scroll offset at capture time), in CSS px. */
export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * One measured DOM node. `component` groups instances for the
 * aggregator's instance -> component rollup; `instanceId` identifies the
 * specific node within that component (e.g. its state: default/hover/error).
 */
export interface ExtractedElement {
  component: string;
  instanceId: string;
  styles: CapturedStyles;
  /** page-relative bounding box per occurrence deduped into this instance (real-page sampling only — empty/undefined for tag-based fixture extraction). */
  positions?: Position[];
  /** number of DOM nodes deduped into this one instance — equal to positions.length when positions is present. Undefined/1 for tag-based fixture extraction. */
  count?: number;
}

export interface ExtractedPage {
  page: string;
  elements: ExtractedElement[];
  /** true if this page's capture looks incomplete/unstable (e.g. too few elements found) — callers should exclude it from scoring rather than blend in bad data. */
  unstable?: boolean;
  /** path (relative to repo root) to a full-page screenshot taken at capture time, for later overlay/comparison work. Undefined for tag-based fixture extraction. */
  screenshotPath?: string;
}
