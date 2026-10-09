import assert from "node:assert/strict";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Changing this list requires reviewing the added material for public distribution.
const allowed = new Set([".gitignore", "AGENTS.md", "README.md", "SKILL.md", "launchintel.json", "scripts/check-public.mjs", "assets/dashboard.png"]);
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
}
console.log(`${seen.size} public files checked${process.argv.includes("--release") ? "; release configuration ready" : "; run --release before publishing"}`);
