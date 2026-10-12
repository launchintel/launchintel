import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const git = (root, ...args) => execFileSync("git", ["-c", "user.name=Public fixture", "-c", "user.email=test@example.invalid", "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null", ...args], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "li-public-history-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  cpSync(ROOT, root, { recursive: true, filter: path => path !== join(ROOT, ".git") });
  git(root, "init", "--initial-branch=master"); git(root, "add", "."); git(root, "commit", "-m", "Public fixture");
  return root;
}
const check = root => spawnSync(process.execPath, ["scripts/check-public.mjs", "--release"], { cwd: root, encoding: "utf8" });
test("release checks reviewed paths throughout clean public history without network access", t => {
  const root = fixture(t), result = check(root);
  assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /Historical paths checked in 1 reachable commits/);
});
test("deleting an unreviewed file cannot conceal it from the public release check", t => {
  const root = fixture(t);
  writeFileSync(join(root, "unreviewed-fixture.txt"), "Synthetic non-public fixture, no real paid data.\n");
  git(root, "add", "unreviewed-fixture.txt"); git(root, "commit", "-m", "Accidental fixture file");
  git(root, "rm", "unreviewed-fixture.txt"); git(root, "commit", "-m", "Remove fixture file");
  const result = check(root);
  assert.notEqual(result.status, 0); assert.match(result.stderr, /Unreviewed public history path: unreviewed-fixture.txt/);
});
test("a separate reachable branch with unreviewed history blocks release too", t => {
  const root = fixture(t); git(root, "checkout", "-b", "unreviewed-fixture");
  writeFileSync(join(root, "branch-only-fixture.txt"), "Synthetic branch test.\n");
  git(root, "add", "branch-only-fixture.txt"); git(root, "commit", "-m", "Branch fixture"); git(root, "checkout", "master");
  const result = check(root);
  assert.notEqual(result.status, 0); assert.match(result.stderr, /Unreviewed public history path: branch-only-fixture.txt/);
});
