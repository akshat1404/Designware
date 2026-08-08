import type { TokenSpec } from "../schema/tokenSpec.js";
import type { ExtractedElement, ExtractedPage } from "../extractor/types.js";
import type { PropertyDeviation } from "../matchers/types.js";
import { matchColor } from "../matchers/color.js";
import { matchScale } from "../matchers/scale.js";
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
}

export interface ProductReport {
  product: string;
  pages: PageReport[];
  score: number;
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

export function scorePage(extracted: ExtractedPage, spec: TokenSpec): PageReport {
  const instances = extracted.elements.map((el) => scoreElement(el, spec));

  const byComponent = new Map<string, InstanceReport[]>();
  for (const instance of instances) {
    const list = byComponent.get(instance.component) ?? [];
    list.push(instance);
    byComponent.set(instance.component, list);
  }

  const components = Array.from(byComponent.entries()).map(([name, list]) => aggregateComponent(name, list));
  return { page: extracted.page, components, score: mean(components.map((c) => c.score)) };
}

export function scoreProduct(product: string, extractedPages: ExtractedPage[], spec: TokenSpec): ProductReport {
  const pages = extractedPages.map((p) => scorePage(p, spec));
  return { product, pages, score: mean(pages.map((p) => p.score)) };
}
