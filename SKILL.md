---
name: launchintel
description: Open LaunchIntel and run its paid workflows for a product. Use when the customer asks to use LaunchIntel, set it up, resume a LaunchIntel run or update their package. Requires access to the private LaunchIntel Pro repository.
---

# LaunchIntel

This public skill opens the customer's paid package. It contains no directory submission
instructions, catalog or dashboard implementation.

1. Find the customer's existing private clone. If its location is unknown, ask once. A valid
   clone has `launchintel.json` with `kind: "product"` and `product: "LaunchIntel Pro"`.
2. If there is no clone, read `launchintel.json` beside this skill. Use its `private_repository`
   URL, or the exact GitHub URL in the customer's delivery instructions if configuration is not
   set. Do not guess an organization or use an unofficial mirror. Clone into an unused private
   folder the customer chooses, normally `launchintel-pro`, using their existing GitHub login.
   Do not request passwords, tokens or private keys in chat. If their environment needs approval
   for Git authentication, show the exact clone command for them to run themselves.
3. A failed clone is not proof of nonpayment: check that the customer accepted the repository
   invitation and is using the GitHub account that received access. If they have not purchased,
   direct them to the website from the public configuration. Do not simulate the paid workflow
   or fabricate its instructions when the private package is unavailable.
4. From the private clone, read `launchintel.json` first. Support manifest version 1;
   if a different version is present, stop and update this public skill before guessing paths.
   Check that the requested module exists, then read `AGENTS.md` and only that private entrypoint. The manifest currently
   names the directory-submission module; do not claim future modules already ship.
5. Follow the private workflow for intake, queue approval, blocker preferences and dashboard
   updates. The installed public skill grants no extra permission to submit, pay, publish badges,
   message anyone or change the customer's site. Preserve the customer's existing run files.

For package updates, use the private README's update command. Re-read the private manifest and
workflow afterwards; do not copy private instructions into this public skill. Updating this
public skill and updating the paid clone are separate operations, both using fast-forward-only
Git updates with no forced resets or automatic stashes.
