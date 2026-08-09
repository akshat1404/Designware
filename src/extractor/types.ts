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
}

export interface ExtractedPage {
  page: string;
  elements: ExtractedElement[];
}
