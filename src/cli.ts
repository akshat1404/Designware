import path from "node:path";
import { runPipeline } from "./pipeline.js";
import type { ProductReport } from "./aggregator/aggregate.js";

// Resolved against the working directory rather than this file's location,
// since the build's output depth (dist/src/cli.js) doesn't match the
// source layout (src/cli.ts) — this is meant to be run via `npm run report`
// from the repo root either way.
const FIXTURES = path.resolve(process.cwd(), "fixtures");

function printReport(label: string, report: ProductReport) {
  console.log(`\n=== ${label}: product score ${report.score.toFixed(1)} / 100 ===`);
  for (const page of report.pages) {
    console.log(`  page "${page.page}": ${page.score.toFixed(1)}`);
    for (const component of page.components) {
      console.log(`    ${component.component.padEnd(20)} ${component.score.toFixed(1)}`);
      for (const instance of component.instances) {
        const flagged = instance.deviations.filter((d) => d.normalized > 0.1);
        if (flagged.length === 0) continue;
        console.log(`      [${instance.instanceId}] instance score ${instance.score.toFixed(1)}`);
        for (const d of flagged) {
          const detail = d.detail ? ` (${d.detail})` : "";
          console.log(
            `        ${d.property}${detail}: "${d.rawValue}" -> nearest ${d.nearestToken}, distance ${d.distance.toFixed(2)}, normalized ${d.normalized.toFixed(2)}`
          );
        }
      }
    }
  }

  if (report.breakdown.length > 0) {
    console.log("  breakdown by property:");
    for (const b of report.breakdown) {
      console.log(`    ${b.property.padEnd(18)} mean ${b.meanNormalized.toFixed(2)} (n=${b.count})`);
    }
  }

  const topOffenders = report.worstOffenders.filter((o) => o.normalized > 0.1).slice(0, 5);
  if (topOffenders.length > 0) {
    console.log("  worst offenders:");
    for (const o of topOffenders) {
      const detail = o.detail ? ` (${o.detail})` : "";
      console.log(
        `    [${o.page}/${o.component}/${o.instanceId}] ${o.property}${detail}: "${o.rawValue}" -> ${o.nearestToken}, normalized ${o.normalized.toFixed(2)}`
      );
    }
  }
}

async function main() {
  const tokenSpecPath = path.join(FIXTURES, "token-spec.json");

  const compliant = await runPipeline({
    product: "fixture-product",
    tokenSpecPath,
    targets: [{ path: path.join(FIXTURES, "compliant.html"), pageId: "compliant" }],
  });
  printReport("compliant.html", compliant);

  const deviant = await runPipeline({
    product: "fixture-product",
    tokenSpecPath,
    targets: [{ path: path.join(FIXTURES, "deviant.html"), pageId: "deviant" }],
  });
  printReport("deviant.html", deviant);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
