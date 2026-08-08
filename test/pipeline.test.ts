import { describe, it, expect, beforeAll } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runPipeline } from "../src/pipeline.js";
import type { ProductReport, ComponentReport } from "../src/aggregator/aggregate.js";
import type { PropertyDeviation } from "../src/matchers/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(__dirname, "..", "fixtures");
const TOKEN_SPEC = path.join(FIXTURES, "token-spec.json");

function findComponent(report: ProductReport, name: string): ComponentReport {
  const component = report.pages[0].components.find((c) => c.component === name);
  if (!component) throw new Error(`component "${name}" not found in report`);
  return component;
}

function findDeviation(deviations: PropertyDeviation[], property: string, detail?: string): PropertyDeviation {
  const found = deviations.find((d) => d.property === property && (detail === undefined || d.detail === detail));
  if (!found) throw new Error(`no deviation found for property=${property} detail=${detail}`);
  return found;
}

describe("pipeline against synthetic fixtures", () => {
  let compliant: ProductReport;
  let deviant: ProductReport;

  beforeAll(async () => {
    compliant = await runPipeline({
      product: "fixture-product",
      tokenSpecPath: TOKEN_SPEC,
      targets: [{ path: path.join(FIXTURES, "compliant.html"), pageId: "compliant" }],
    });
    deviant = await runPipeline({
      product: "fixture-product",
      tokenSpecPath: TOKEN_SPEC,
      targets: [{ path: path.join(FIXTURES, "deviant.html"), pageId: "deviant" }],
    });
  }, 60_000);

  it("scores a fully on-spec page near zero", () => {
    expect(compliant.score).toBeLessThan(1);
    for (const component of compliant.pages[0].components) {
      expect(component.score).toBeLessThan(1);
    }
  });

  it("resolves the compliant page's opacity-variant hover state to ~0 deviation", () => {
    const button = findComponent(compliant, "Button/primary");
    const hover = button.instances.find((i) => i.instanceId === "hover");
    expect(hover).toBeDefined();
    const bg = findDeviation(hover!.deviations, "background-color");
    expect(bg.variantMatch).toBe(true);
    expect(bg.normalized).toBeLessThan(0.05);
  });

  it("resolves the compliant page's dark badge against theme tokens, not light ones", () => {
    const badge = findComponent(compliant, "Badge/dark");
    const bg = findDeviation(badge.instances[0].deviations, "background-color");
    const fg = findDeviation(badge.instances[0].deviations, "color");
    expect(bg.nearestToken).toBe("theme:dark.surface");
    expect(fg.nearestToken).toBe("theme:dark.brand-primary");
    expect(badge.score).toBeLessThan(1);
  });

  it("flags the deliberately deviant Button/primary instance on every injected property", () => {
    const button = findComponent(deviant, "Button/primary");
    const instance = button.instances[0];

    const paddingTop = findDeviation(instance.deviations, "spacing", "padding-top");
    expect(paddingTop.distance).toBe(2);
    expect(paddingTop.normalized).toBeCloseTo(0.5, 6);

    const paddingLeft = findDeviation(instance.deviations, "spacing", "padding-left");
    expect(paddingLeft.distance).toBe(4);
    expect(paddingLeft.normalized).toBeCloseTo(1, 6);

    const radius = findDeviation(instance.deviations, "border-radius");
    expect(radius.distance).toBe(2);
    expect(radius.normalized).toBeCloseTo(0.5, 6);

    const fontSize = findDeviation(instance.deviations, "font-size");
    expect(fontSize.distance).toBe(2);
    expect(fontSize.normalized).toBe(1);

    const family = findDeviation(instance.deviations, "font-family");
    expect(family.distance).toBe(1);

    const weight = findDeviation(instance.deviations, "font-weight");
    expect(weight.distance).toBe(100);
    expect(weight.normalized).toBe(1);

    const bg = findDeviation(instance.deviations, "background-color");
    const fg = findDeviation(instance.deviations, "color");
    expect(bg.normalized).toBeGreaterThan(0.5);
    expect(fg.normalized).toBeGreaterThan(0.5);

    expect(button.score).toBeGreaterThan(60);
  });

  it("leaves untouched components on the deviant page scoring at ~0", () => {
    expect(findComponent(deviant, "Card").score).toBeCloseTo(0, 6);
    expect(findComponent(deviant, "Badge/dark").score).toBeCloseTo(0, 6);
  });

  it("rolls component scores up into a page score between the extremes", () => {
    const button = findComponent(deviant, "Button/primary").score;
    const card = findComponent(deviant, "Card").score;
    const badge = findComponent(deviant, "Badge/dark").score;
    expect(deviant.pages[0].score).toBeCloseTo((button + card + badge) / 3, 6);
    expect(deviant.score).toBeGreaterThan(compliant.score);
  });
});
