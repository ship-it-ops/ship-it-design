#!/usr/bin/env node
// Identifies publishable packages changed on the PR branch that lack a
// matching `.changeset/*.md` entry. Writes a detailed report to
// $GITHUB_STEP_SUMMARY and emits ::error:: annotations naming each missing
// package, then exits non-zero. Used by .github/workflows/changeset-check.yml.

import { readFileSync, readdirSync, existsSync, appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const baseRef = process.env.BASE_REF || "origin/main";

function discoverPublishablePackages() {
  const config = JSON.parse(readFileSync(".changeset/config.json", "utf8"));
  const ignored = new Set(config.ignore ?? []);
  const out = [];
  for (const entry of readdirSync("packages", { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = join("packages", entry.name, "package.json");
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    if (pkg.private) continue;
    if (ignored.has(pkg.name)) continue;
    out.push({ name: pkg.name, dir: entry.name });
  }
  return out;
}

function changedPackageDirs() {
  // execFileSync (not execSync) so `baseRef` never reaches a shell — argv is
  // passed straight to git. A branch name like `main; rm -rf /` would be
  // forwarded as a literal ref and rejected by git, never executed.
  const diff = execFileSync(
    "git",
    ["diff", "--name-only", `${baseRef}...HEAD`],
    { encoding: "utf8" },
  );
  const dirs = new Set();
  for (const file of diff.split("\n")) {
    if (!file) continue;
    const parts = file.split("/");
    if (parts[0] === "packages" && parts.length >= 2) dirs.add(parts[1]);
  }
  return dirs;
}

function coveredByChangesets() {
  const covered = new Set();
  for (const file of readdirSync(".changeset")) {
    if (!file.endsWith(".md")) continue;
    if (file.toLowerCase() === "readme.md") continue;
    const content = readFileSync(join(".changeset", file), "utf8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;
    for (const line of match[1].split(/\r?\n/)) {
      const m = line.match(
        /^\s*['"]?([^'":\s]+)['"]?\s*:\s*(patch|minor|major)\s*$/,
      );
      if (m) covered.add(m[1]);
    }
  }
  return covered;
}

function writeSummary(text) {
  const path = process.env.GITHUB_STEP_SUMMARY;
  if (!path) return;
  appendFileSync(path, `${text}\n`);
}

const publishable = discoverPublishablePackages();
const touchedDirs = changedPackageDirs();
const changed = publishable.filter((p) => touchedDirs.has(p.dir));
const covered = coveredByChangesets();
const missing = changed.filter((p) => !covered.has(p.name));

if (changed.length === 0) {
  console.log("No publishable package changes detected.");
  writeSummary("## Changeset check ✅");
  writeSummary("");
  writeSummary("No publishable package changes detected on this branch.");
  process.exit(0);
}

if (missing.length === 0) {
  console.log("All changed publishable packages have a changeset entry.");
  writeSummary("## Changeset check ✅");
  writeSummary("");
  writeSummary("Changed publishable packages, all covered by changesets:");
  writeSummary("");
  for (const p of changed) writeSummary(`- \`${p.name}\` (\`packages/${p.dir}/\`)`);
  process.exit(0);
}

console.error(
  "Missing changeset entries for the following package(s) changed on this branch:",
);
for (const p of missing) {
  console.error(`::error title=Missing changeset::${p.name} (packages/${p.dir}/) changed but has no entry in .changeset/`);
  console.error(`  - ${p.name} (packages/${p.dir}/)`);
}
console.error("");
console.error(
  "Run `pnpm changeset` locally to add one, or apply the `no-changeset` label / use a `chore` PR title if this change should not ship.",
);

writeSummary("## Changeset check ❌");
writeSummary("");
writeSummary(
  "The following publishable package(s) changed on this branch but have no entry in `.changeset/`:",
);
writeSummary("");
writeSummary("| Package | Path |");
writeSummary("| --- | --- |");
for (const p of missing) {
  writeSummary(`| \`${p.name}\` | \`packages/${p.dir}/\` |`);
}

const otherChanged = changed.filter((p) => covered.has(p.name));
if (otherChanged.length) {
  writeSummary("");
  writeSummary("Already covered by an existing changeset:");
  writeSummary("");
  for (const p of otherChanged) {
    writeSummary(`- \`${p.name}\` (\`packages/${p.dir}/\`)`);
  }
}

writeSummary("");
writeSummary("### How to fix");
writeSummary("");
writeSummary(
  "Run `pnpm changeset` locally, select the affected package(s) and a bump (`patch` / `minor` / `major`), commit the generated `.changeset/<name>.md`, and push.",
);
writeSummary("");
writeSummary(
  "If this PR doesn't ship a consumer-visible change (refactor, test-only, internal tooling), apply the `no-changeset` label or retitle the PR to start with `chore` to skip this gate.",
);

process.exit(1);
