import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const json = (file, value) => writeFileSync(file, JSON.stringify(value));
function fixture(t) {
  const folder = mkdtempSync(join(tmpdir(), "li-public-"));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  for (const dir of ["modules/example", "dashboard", "runs"]) mkdirSync(join(folder, dir), { recursive: true });
  for (const file of ["AGENTS.md", "modules/example/SKILL.md", "dashboard/index.html", "state-format.json"]) writeFileSync(join(folder, file), "Synthetic test fixture; no product instructions.");
  const manifest = { schema_version: 1, kind: "product", product: "LaunchIntel Pro", modules: { example: { name: "Fixture module", entrypoint: "modules/example/SKILL.md" } }, dashboard: "dashboard/index.html", runs: "runs", state_format: "state-format.json" };
  json(join(folder, "launchintel.json"), manifest);
  return { folder, manifest };
}
const inspect = (folder, module) => spawnSync(process.execPath, [join(root, "scripts/inspect-package.mjs"), folder, ...(module ? [module] : [])], { encoding: "utf8" });

test("inspector lists a synthetic module without modifying the package", (t) => {
  const { folder } = fixture(t);
  const before = readFileSync(join(folder, "launchintel.json"), "utf8");
  const result = inspect(folder, "example");
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.modules.example.entrypoint, join(folder, "modules/example/SKILL.md"));
  assert.equal(readFileSync(join(folder, "launchintel.json"), "utf8"), before);
  assert.equal(inspect(folder, "unavailable").status, 1);
});

test("unsupported versions and paths escaping the clone cannot reach instructions", (t) => {
  const { folder, manifest } = fixture(t);
  for (const badPath of ["../elsewhere/SKILL.md", "/tmp/SKILL.md", "C:\\private\\SKILL.md", "modules/../AGENTS.md"]) {
    manifest.modules.example.entrypoint = badPath;
    json(join(folder, "launchintel.json"), manifest);
    const result = inspect(folder);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
  }
  manifest.schema_version = 2;
  json(join(folder, "launchintel.json"), manifest);
  assert.match(inspect(folder).stderr, /Unsupported package manifest/u);
});

test("symlinks and changed format-1 storage paths are rejected", (t) => {
  const { folder, manifest } = fixture(t);
  rmSync(join(folder, "modules/example/SKILL.md"));
  symlinkSync("../../AGENTS.md", join(folder, "modules/example/SKILL.md"));
  assert.match(inspect(folder).stderr, /symlink/u);
  rmSync(join(folder, "modules/example/SKILL.md"));
  writeFileSync(join(folder, "modules/example/SKILL.md"), "Synthetic fixture");
  manifest.runs = "new-runs";
  json(join(folder, "launchintel.json"), manifest);
  assert.match(inspect(folder).stderr, /unsupported format-1 storage path/u);
});
