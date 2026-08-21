import { registry, type RegisteredTarget } from "./targets/registry.js";
import { runCrawlTarget } from "./runCrawlTarget.js";

function parseArgs(): { targetKey: string | undefined; refresh: boolean } {
  const args = process.argv.slice(2);
  const targetArg = args.find((a) => a.startsWith("--target="));
  return {
    targetKey: targetArg?.split("=")[1],
    refresh: args.includes("--refresh"),
  };
}

async function runTarget(entry: RegisteredTarget, refresh: boolean): Promise<void> {
  const { target, adapter } = entry;
  console.log(`\n=== ${target.label} (${target.key}) ===`);
  const spec = await adapter();
  const report = await runCrawlTarget(target, spec, refresh);
  console.log(`  score: ${report.score.toFixed(1)} / 100  ->  reports/${target.key}/summary.md`);
}

async function main(): Promise<void> {
  const { targetKey, refresh } = parseArgs();
  if (!targetKey) {
    console.error("usage: validate --target=<key>|all [--refresh]");
    console.error(`known targets: ${registry.map((e) => e.target.key).join(", ") || "(none registered yet)"}`);
    process.exit(1);
  }

  const entries = targetKey === "all" ? registry : registry.filter((e) => e.target.key === targetKey);
  if (entries.length === 0) {
    console.error(`no registered target matching "${targetKey}". known: ${registry.map((e) => e.target.key).join(", ") || "(none registered yet)"}`);
    process.exit(1);
  }

  for (const entry of entries) {
    await runTarget(entry, refresh);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
