# <img src="assets/logo.svg" width="36" height="36" alt=""> LaunchIntel

Let Claude work through your product's launch, with tested playbooks and a local dashboard.

This is the public installer skill. The paid **LaunchIntel Pro** repository contains the
workflows, playbooks, templates, scripts and dashboard. Directory submissions are the first
module. Installing this skill alone does not provide the paid package or grant access to it.

[See the product and a sample guide](https://launchintel.dev)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/dashboard-dark.png">
  <img alt="LaunchIntel dashboard with fictional demo products and example progress" src="assets/dashboard.png">
</picture>

*The working dashboard with fictional demo products and example progress.*

## Install

You need Claude Code, Git, Node 20 or newer and a GitHub account. The private package also needs
a browser Claude can control; its setup guide explains the options.

Install the public skill whenever you like; using the paid workflows requires purchasing access
and connecting your GitHub account through Polar’s customer portal, then accepting the private
repository invitation. The portal link is in your Polar order confirmation:

```bash
git clone https://github.com/launchintel/launchintel.git ~/.claude/skills/launchintel
```

If that destination already exists, inspect it before updating; do not overwrite it.
Start a Claude Code session and say:

> Use LaunchIntel to launch my product.

Claude finds your existing private clone or helps clone it using your GitHub authentication,
then loads the workflow from there. You approve the product facts and queue before submissions
begin. In the paid workflow, you can exclude badges and choose whether blockers should wait for
your help or be deferred while Claude continues.

To open your dashboard, say:

> Open my LaunchIntel dashboard.

Switch products, edit their briefs and permissions, review blockers and prepare queues in the
browser. Light and dark themes are included. Optional Ahrefs Domain Rating tracking records
measurements locally, with daily checks only if you enable them. Your agent handles setup.

<details>
<summary>Manual package inspection</summary>

To inspect an existing private clone without logging in, changing files or running a workflow:

```bash
node ~/.claude/skills/launchintel/scripts/inspect-package.mjs /path/to/launchintel-pro
```

The check lists the installed modules and their private entrypoints. It does not print customer
run data. An unsupported package version or unsafe path stops setup before any workflow is read.

</details>

Authentication happens through your Git tools. Never paste passwords, tokens or keys into chat.
An access error can mean an unaccepted invitation or the wrong GitHub account; it does not
necessarily mean you need to purchase again.

## What is public

This skill, installation instructions, the brand mark and demo screenshots. The paid guides, directory
data, detailed workflow instructions and dashboard code are kept in a separate private repo.
Your local run files and credentials are not uploaded to this public repo. During an approved
submission, Claude sends the required product details to the directory you selected.

You can use this public repo for setup issues and feature requests. Do not attach private
playbooks, customer data, credentials or order details to public issues.

## Updates

Ask Claude to update LaunchIntel. It follows the paid package's update procedure and keeps your
product files separate from shipped code.

<details>
<summary>Manual public skill update</summary>

With a clean public skill checkout, run:

```bash
git -C ~/.claude/skills/launchintel pull --ff-only
```

</details>

Update the paid package using its own README. Its workflow is read from the private clone each
time, so paid changes do not need to be copied into this public repo.

## Publishing this repo

The official repositories are `launchintel/launchintel` (this public installer) and
`launchintel/launchintel-pro` (the private paid package). Before publishing, run
`node scripts/check-public.mjs --release`.
Run `node --test tests/*.test.mjs` to check the installer against synthetic fixtures.
The release check limits this repo to reviewed public paths and checks every locally reachable
commit for unexpected paths or symlinks, including files later deleted. It does not prove that
all text inside allowed files is suitable for publication; review content and screenshots too.
If it reports private history, stop before pushing and inspect the affected commit. Deleting the
current file does not remove its history. Do not copy the paid repo
or its Git history here. Repository visibility and any software licence are separate decisions;
the paid package remains subject to its purchase terms.
