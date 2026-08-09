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

/**
 * One measured DOM node. `component` groups instances for the
 * aggregator's instance -> component rollup; `instanceId` identifies the
 * specific node within that component (e.g. its state: default/hover/error).
 */
export interface ExtractedElement {
  component: string;
  instanceId: string;
  styles: CapturedStyles;
  /** number of DOM nodes deduped into this one instance (real-page sampling only — e.g. "40 buttons, 1 unique style"). Undefined/1 for tag-based fixture extraction. */
  count?: number;
}

export interface ExtractedPage {
  page: string;
  elements: ExtractedElement[];
  /** true if this page's capture looks incomplete/unstable (e.g. too few elements found) — callers should exclude it from scoring rather than blend in bad data. */
  unstable?: boolean;
}
