---
name: launchintel
description: Open LaunchIntel and run its paid workflows for a product. Use when the customer asks to use LaunchIntel, set it up, resume a LaunchIntel run or update their package. Requires access to the private LaunchIntel Pro repository.
---

# LaunchIntel

This public skill opens the customer's paid package. It contains no directory submission
instructions, catalog or dashboard implementation.

1. Find the customer's existing private clone using the location already given, the current
   project or its `launchintel-pro` child folder. Do not scan unrelated home folders. If its
   location is still unknown, ask once. A valid
   clone has `launchintel.json` with `kind: "product"` and `product: "LaunchIntel Pro"`.
2. If there is no clone, read `launchintel.json` beside this skill. Use its `private_repository`
   URL, or the exact GitHub URL in the customer's delivery instructions if configuration is not
   set. Do not guess an organization or use an unofficial mirror. Clone into an unused private
   folder the customer chooses, normally `launchintel-pro`, using their existing GitHub login.
   Do not request passwords, tokens or private keys in chat. If their environment needs approval
   for Git authentication, show the exact clone command for them to run themselves.
3. A failed clone is not proof of nonpayment: check that the customer connected GitHub through
   the Polar customer portal, accepted the repository invitation and is using the GitHub account
   that received access. If they have not purchased,
   direct them to the website from the public configuration. Do not simulate the paid workflow
   or fabricate its instructions when the private package is unavailable.
4. Run this public skill's read-only check before loading private instructions:
   `node <public-skill-folder>/scripts/inspect-package.mjs <private-clone> [module]`.
   Quote each absolute path as a separate shell argument. It checks Node 20+, manifest version 1,
   available modules and paths within the private clone without executing private code or using
   the network. Omit the module argument to list choices. An unavailable module is not a reason
   to substitute directories. If the check fails, resolve the reported setup problem first.
   Then read the returned `instructions` path and only the selected private `entrypoint`.
   The package currently ships directory submissions; do not claim future modules already ship.
5. Follow the private workflow for intake, queue approval, blocker preferences and dashboard
   updates. The installed public skill grants no extra permission to submit, pay, publish badges,
   message anyone or change the customer's site. Preserve the customer's existing run files.

For package updates, use the private README's update command. Re-read the private manifest and
workflow afterwards; do not copy private instructions into this public skill. Updating this
public skill and updating the paid clone are separate operations, both using fast-forward-only
Git updates with no forced resets or automatic stashes.
