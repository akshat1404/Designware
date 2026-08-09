import type { TokenSpec } from "../schema/tokenSpec.js";
import type { ExtractedElement, ExtractedPage } from "../extractor/types.js";
import type { PropertyDeviation, PropertyKind } from "../matchers/types.js";
import { matchColor } from "../matchers/color.js";
import { matchScale, parsePx } from "../matchers/scale.js";
import { matchFontFamily, matchFontWeight } from "../matchers/font.js";
import { parseCssColor } from "../color/convert.js";

export interface InstanceReport {
  component: string;
  instanceId: string;
  deviations: PropertyDeviation[];
  /** 0 (fully compliant) - 100 (maximally deviant): mean of this instance's property deviations, scaled. */
  score: number;
}

export interface ComponentReport {
  component: string;
  instances: InstanceReport[];
  score: number;
}

export interface PageReport {
  page: string;
  components: ComponentReport[];
  score: number;
  /** mean normalized deviation per property kind, for "which category is worst" reporting. */
  breakdown: PropertyBreakdown[];
}

export interface ProductReport {
  product: string;
  pages: PageReport[];
  score: number;
  breakdown: PropertyBreakdown[];
  /** every flagged deviation across the product, worst first, capped — enough context to manually verify each one. */
  worstOffenders: Offender[];
  /** pages excluded from scoring because their capture looked incomplete/unstable, listed rather than silently blended in. */
  unstablePages: string[];
}

export interface PropertyBreakdown {
  property: PropertyKind;
  /** mean normalized deviation (0-1) across every instance of this property kind. */
  meanNormalized: number;
  count: number;
}

export interface Offender {
  page: string;
  component: string;
  instanceId: string;
  property: PropertyKind;
  detail?: string;
  rawValue: string | number;
  nearestToken: string;
  distance: number;
  normalized: number;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Runs every applicable matcher against one extracted element's captured
 * styles. `background-color` is skipped when fully transparent — most
 * elements never set one explicitly, and scoring the inherited
 * `rgba(0,0,0,0)` default against the palette would just be noise.
 */
export function scoreElement(el: ExtractedElement, spec: TokenSpec): InstanceReport {
  const deviations: PropertyDeviation[] = [];
  const s = el.styles;

  deviations.push(matchColor(s.color, spec, "color"));

  const bg = parseCssColor(s.backgroundColor);
  if (bg.a > 0) {
    deviations.push(matchColor(s.backgroundColor, spec, "background-color"));
  }

  // A 0-width or `border-style: none` border isn't rendered, so its color
  // (often an unset browser default) isn't a real deviation to flag.
  const borderColor = parseCssColor(s.borderTopColor);
  if (s.borderTopStyle !== "none" && parsePx(s.borderTopWidth) > 0 && borderColor.a > 0) {
    deviations.push({ ...matchColor(s.borderTopColor, spec, "border-color"), detail: "border-top-color" });
  }

  deviations.push({ ...matchScale(s.borderTopLeftRadius, spec.radius, "border-radius"), detail: "border-top-left-radius" });
  deviations.push(matchScale(s.fontSize, spec.fontSize, "font-size"));
  deviations.push(matchFontFamily(s.fontFamily, spec.fontFamily));
  deviations.push(matchFontWeight(s.fontWeight, spec.fontWeight));

  const spacingSides: Array<[keyof typeof s, string]> = [
    ["paddingTop", "padding-top"],
    ["paddingRight", "padding-right"],
    ["paddingBottom", "padding-bottom"],
    ["paddingLeft", "padding-left"],
    ["marginTop", "margin-top"],
    ["marginRight", "margin-right"],
    ["marginBottom", "margin-bottom"],
    ["marginLeft", "margin-left"],
  ];
  for (const [key, detail] of spacingSides) {
    deviations.push({ ...matchScale(s[key], spec.spacing, "spacing"), detail });
  }

  const score = mean(deviations.map((d) => d.normalized)) * 100;
  return { component: el.component, instanceId: el.instanceId, deviations, score };
}

function aggregateComponent(component: string, instances: InstanceReport[]): ComponentReport {
  return { component, instances, score: mean(instances.map((i) => i.score)) };
}

function propertyBreakdown(deviations: PropertyDeviation[]): PropertyBreakdown[] {
  const byProperty = new Map<PropertyKind, number[]>();
  for (const d of deviations) {
    const list = byProperty.get(d.property) ?? [];
    list.push(d.normalized);
    byProperty.set(d.property, list);
  }
  return Array.from(byProperty.entries())
    .map(([property, values]) => ({ property, meanNormalized: mean(values), count: values.length }))
    .sort((a, b) => b.meanNormalized - a.meanNormalized);
}

function flattenDeviations(components: ComponentReport[]): PropertyDeviation[] {
  return components.flatMap((c) => c.instances.flatMap((i) => i.deviations));
}

export function scorePage(extracted: ExtractedPage, spec: TokenSpec): PageReport {
  const instances = extracted.elements.map((el) => scoreElement(el, spec));

  const byComponent = new Map<string, InstanceReport[]>();
  for (const instance of instances) {
    const list = byComponent.get(instance.component) ?? [];
    list.push(instance);
    byComponent.set(instance.component, list);
  }

  const components = Array.from(byComponent.entries()).map(([name, list]) => aggregateComponent(name, list));
  return {
    page: extracted.page,
    components,
    score: mean(components.map((c) => c.score)),
    breakdown: propertyBreakdown(flattenDeviations(components)),
  };
}

/**
 * Flattens every deviation across every page/component/instance into a
 * sorted "worst offenders" list — enough context (page, component,
 * instance, property, raw value, nearest token) to manually pull up the
 * flagged element and confirm it's a real deviation, not a false positive
 * from an unhandled edge case.
 */
function worstOffenders(pages: PageReport[], limit: number): Offender[] {
  const offenders: Offender[] = [];
  for (const page of pages) {
    for (const component of page.components) {
      for (const instance of component.instances) {
        for (const d of instance.deviations) {
          offenders.push({
            page: page.page,
            component: component.component,
            instanceId: instance.instanceId,
            property: d.property,
            detail: d.detail,
            rawValue: d.rawValue,
            nearestToken: d.nearestToken,
            distance: d.distance,
            normalized: d.normalized,
          });
        }
      }
    }
  }
  return offenders.sort((a, b) => b.normalized - a.normalized).slice(0, limit);
}

export function scoreProduct(product: string, extractedPages: ExtractedPage[], spec: TokenSpec, worstOffendersLimit = 50): ProductReport {
  const unstablePages = extractedPages.filter((p) => p.unstable).map((p) => p.page);
  const pages = extractedPages.filter((p) => !p.unstable).map((p) => scorePage(p, spec));
  return {
    product,
    pages,
    score: mean(pages.map((p) => p.score)),
    breakdown: propertyBreakdown(pages.flatMap((p) => flattenDeviations(p.components))),
    worstOffenders: worstOffenders(pages, worstOffendersLimit),
    unstablePages,
  };
}
