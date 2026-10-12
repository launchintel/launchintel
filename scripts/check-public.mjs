import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Changing this list requires reviewing the added material for public distribution.
const allowed = new Set([".gitignore", "AGENTS.md", "README.md", "SKILL.md", "launchintel.json", "scripts/check-public.mjs", "scripts/inspect-package.mjs", "tests/inspect-package.test.mjs", "tests/check-public.test.mjs", "assets/dashboard.png"]);
const seen = new Set();
function walk(relative = "") {
  for (const name of readdirSync(join(root, relative))) {
    if (!relative && name === ".git") continue;
    const path = relative ? `${relative}/${name}` : name;
    const stat = lstatSync(join(root, path));
    assert(!stat.isSymbolicLink(), `Public repo must not link another tree: ${path}`);
    if (stat.isDirectory()) walk(path);
    else {
      assert(allowed.has(path), `Unreviewed public file: ${path}`);
      seen.add(path);
    }
  }
}
walk();
assert.deepEqual(seen, allowed, "A required public file is missing");
const config = JSON.parse(readFileSync(join(root, "launchintel.json"), "utf8"));
assert(config.kind === "launcher" && config.schema_version === 1);
assert(config.private_repository === null || /^https:\/\/github\.com\/[A-Za-z0-9_-]+\/launchintel-pro(?:\.git)?$/u.test(config.private_repository), "Use the official private GitHub repository URL");
if (process.argv.includes("--release")) {
  assert(config.private_repository, "Set the private repository URL after the organization exists");
  assert(!readFileSync(join(root, "README.md"), "utf8").includes("YOUR_ORG"), "Set the public repository organization in README.md");
  // A deleted private file would still travel with a public push. Inspect every reachable
  // commit from local refs; no fetch, remote authentication or history rewrite is performed.
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
  const commits = git("rev-list", "--all").trim().split("\n").filter(Boolean);
  assert(commits.length > 0, "Public release requires a reviewed local commit history");
  for (const commit of commits) {
    for (const entry of git("ls-tree", "-r", "-z", commit).split("\0").filter(Boolean)) {
      const tab = entry.indexOf("\t"), metadata = entry.slice(0, tab), path = entry.slice(tab + 1);
      assert(allowed.has(path), `Unreviewed public history path: ${path} in ${commit.slice(0, 12)}`);
      assert(/^100(?:644|755) blob /u.test(metadata), `Unsupported public history entry: ${path} in ${commit.slice(0, 12)}`);
    }
  }
  console.log(`Historical paths checked in ${commits.length} reachable commits; file contents still require review`);
}
console.log(`${seen.size} public files checked${process.argv.includes("--release") ? "; release configuration ready" : "; run --release before publishing"}`);
