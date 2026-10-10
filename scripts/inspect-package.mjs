#!/usr/bin/env node
// Read-only bootstrap check. No network, Git commands, or private workflow execution.
import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

try {
  const [location, requested, ...extra] = process.argv.slice(2);
  if (!location || extra.length) throw new Error("usage: node scripts/inspect-package.mjs /path/to/launchintel-pro [module]");
  if (Number(process.versions.node.split(".")[0]) < 20) throw new Error("LaunchIntel Pro needs Node 20 or newer.");
  const root = realpathSync(resolve(location));
  const local = (value, label, directory = false) => {
    if (typeof value !== "string" || !value || isAbsolute(value) || value.includes("\\") || /^[A-Za-z]:/u.test(value) || value.split("/").some((part) => !part || part === "." || part === "..")) throw new Error(`${label}: expected a relative path inside the private clone`);
    let path = root;
    for (const part of value.split("/")) {
      path = join(path, part);
      if (!existsSync(path) || lstatSync(path).isSymbolicLink()) throw new Error(`${label}: missing path or symlink; repair or update the private clone`);
    }
    const stat = lstatSync(path);
    if (directory ? !stat.isDirectory() : !stat.isFile()) throw new Error(`${label}: unexpected file type`);
    return path;
  };
  const manifest = JSON.parse(readFileSync(local("launchintel.json", "manifest"), "utf8"));
  if (manifest.schema_version !== 1 || manifest.kind !== "product" || manifest.product !== "LaunchIntel Pro") throw new Error("Unsupported package manifest. Expected format-1 LaunchIntel Pro; update the public skill before loading another format.");
  if (!manifest.modules || typeof manifest.modules !== "object" || Array.isArray(manifest.modules) || !Object.keys(manifest.modules).length) throw new Error("The package has no available modules.");
  const modules = {};
  for (const [id, module] of Object.entries(manifest.modules)) {
    if (!/^[a-z][a-z0-9-]*$/u.test(id)) throw new Error("Unsupported module identifier");
    modules[id] = { name: module.name || id, entrypoint: local(module.entrypoint, `${id} entrypoint`) };
    if (module.index !== undefined) local(module.index, `${id} index`);
  }
  if (requested && !Object.hasOwn(modules, requested)) throw new Error(`Module '${requested}' is not installed. Available: ${Object.keys(modules).join(", ")}.`);
  for (const [label, value] of Object.entries({ dashboard: "dashboard/index.html", runs: "runs", state_format: "state-format.json" })) {
    if (manifest[label] !== value) throw new Error(`${label}: unsupported format-1 storage path`);
    local(value, label, label === "runs");
  }
  console.log(JSON.stringify({ root, instructions: local("AGENTS.md", "instructions"), modules: requested ? { [requested]: modules[requested] } : modules }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
