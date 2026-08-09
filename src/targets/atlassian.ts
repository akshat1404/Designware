import type { CrawlTarget } from "./types.js";
import type { RegisteredTarget } from "./registry.js";
import { atlaskitAdapter } from "../adapters/atlaskit.js";

// atlassian.design has no robots.txt (404) — no crawl restrictions declared.
const onSpec: CrawlTarget = {
  key: "atlassian-onspec",
  label: "Atlassian Design (atlassian.design)",
  kind: "on-spec",
  urls: [
    "https://atlassian.design/",
    "https://atlassian.design/components/button/examples",
    "https://atlassian.design/foundations/color",
    "https://atlassian.design/foundations/typography",
    "https://atlassian.design/components/badge/examples",
  ],
};

// jira.atlassian.com robots.txt disallows /secure/Dashboard.jspa, /secure/admin/,
// /issues/?jql=*, /login.jsp among others. "/" does not redirect to the
// disallowed Dashboard.jspa for anonymous users (confirmed live); project
// summary pages are public and not covered by any disallow rule.
// /browse/<KEY> redirects to /issues/?filter=... which is close enough to
// the disallowed jql pattern that it's skipped in favor of /projects/<KEY>/summary.
const realApp: CrawlTarget = {
  key: "jira-real-app",
  label: "Jira (jira.atlassian.com)",
  kind: "real-app",
  urls: [
    "https://jira.atlassian.com/",
    "https://jira.atlassian.com/projects/JRACLOUD/summary",
    "https://jira.atlassian.com/projects/CONFCLOUD/summary",
    "https://jira.atlassian.com/projects/JSWCLOUD/summary",
  ],
};

export const atlassianTargets: RegisteredTarget[] = [
  { target: onSpec, adapter: atlaskitAdapter },
  { target: realApp, adapter: atlaskitAdapter },
];
