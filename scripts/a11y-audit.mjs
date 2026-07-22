// Automated accessibility audit for NjiaYangu.
// Runs axe-core against the landing page and the header shell across
// key routes, and prints violations grouped by impact. Exits non-zero on
// any serious or critical finding so CI fails fast.
//
// Usage:
//   node scripts/a11y-audit.mjs                     # audit default routes
//   node scripts/a11y-audit.mjs /programmes /heslb  # audit specific routes

import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.A11Y_BASE_URL ?? "http://localhost:8080";
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/programmes", "/heslb", "/auth", "/saved"];

const IMPACT_ORDER = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const FAIL_IMPACTS = new Set(["critical", "serious"]);

function color(code, str) {
  return process.stdout.isTTY ? `\x1b[${code}m${str}\x1b[0m` : str;
}

async function auditRoute(page, route) {
  const url = new URL(route, BASE).toString();
  await page.goto(url, { waitUntil: "networkidle" });

  // Header and landing focus: audit the landmark shell + main content.
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();

  const violations = results.violations
    .filter((v) => v.impact)
    .sort((a, b) => (IMPACT_ORDER[a.impact] ?? 9) - (IMPACT_ORDER[b.impact] ?? 9));

  console.log(`\n${color("1;36", `● ${route}`)} → ${url}`);
  if (violations.length === 0) {
    console.log(color("32", "  ✓ no accessibility violations detected"));
    return { route, violations: [] };
  }

  for (const v of violations) {
    const badge = FAIL_IMPACTS.has(v.impact) ? color("31", `[${v.impact.toUpperCase()}]`) : color("33", `[${v.impact}]`);
    console.log(`  ${badge} ${v.id} — ${v.help}`);
    console.log(`    ${color("2", v.helpUrl)}`);
    for (const node of v.nodes.slice(0, 3)) {
      console.log(`    • ${node.target.join(" ")}`);
      if (node.failureSummary) {
        const lines = node.failureSummary.split("\n").map((l) => `      ${l}`).join("\n");
        console.log(color("2", lines));
      }
    }
    if (v.nodes.length > 3) console.log(color("2", `    …and ${v.nodes.length - 3} more node(s)`));
  }

  return { route, violations };
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

let fatal = 0;
let total = 0;
for (const route of ROUTES) {
  const { violations } = await auditRoute(page, route);
  total += violations.length;
  fatal += violations.filter((v) => FAIL_IMPACTS.has(v.impact)).length;
}

await browser.close();

console.log("\n" + color("1", "─".repeat(56)));
console.log(`Routes audited: ${ROUTES.length}  Violations: ${total}  Blocking: ${fatal}`);
if (fatal > 0) {
  console.log(color("31", "✗ Accessibility check failed — fix serious/critical issues above."));
  process.exit(1);
} else {
  console.log(color("32", "✓ No serious or critical accessibility issues."));
}
