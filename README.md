# <img src="assets/logo.svg" width="36" height="36" alt=""> LaunchIntel

**Let Claude handle directory submissions. Follow every product in one dashboard.**

LaunchIntel gives Claude tested playbooks for submitting your product to launch and product
directories. You choose the product, approve the queue and decide when Claude should ask for help.
The dashboard keeps submissions, live listings and blockers in view.

[Explore LaunchIntel Pro and read a sample guide](https://launchintel.dev)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/dashboard-dark.png">
  <img alt="LaunchIntel dashboard showing a product switcher, submission progress, follow-ups and a blocker awaiting approval" src="assets/dashboard.png">
</picture>

*The working dashboard. Products, directories and metrics shown here are fictional demo data.*

## What you get with Pro

- **Tested submission playbooks.** Each shipped directory has been submitted to end to end with a real product. Guides cover the form, account setup, free route and follow-up.
- **One dashboard for all your products.** Manage briefs, review queues and follow progress in light or dark mode. Updates appear while the dashboard is open.
- **Control over the run.** Decide whether to include badge requirements and whether an unresolved captcha or other blocker should be deferred or brought to you.
- **Clear outcomes.** See which submissions are waiting for review, which listings are live and what needs attention. Directory operators make the approval decisions.
- **Optional Domain Rating history.** Keep dated Ahrefs DR measurements locally. Daily checks are opt-in, use your own API key and run when your computer is available.

**This public repo is the installer skill.** The playbooks, workflows, templates and dashboard
are in the private **LaunchIntel Pro** repo. Using them requires paid access; installing this
skill alone does not unlock the product.

## Get started

You need Claude Code, Git, Node 20+ and a GitHub account. Claude also needs a browser it can
control; the private package walks you through setup.

1. Get LaunchIntel Pro from [launchintel.dev](https://launchintel.dev).
2. Open the Polar customer portal from your order confirmation, connect GitHub and accept the private repository invitation.
3. Give Claude Code this request:

> Install the LaunchIntel skill from https://github.com/launchintel/launchintel, then open my LaunchIntel dashboard.

Claude sets up the public skill, locates or helps clone your private package, and opens the
local dashboard. Add your product and review its facts and submission queue before work begins.

<details>
<summary>Prefer to install the skill yourself?</summary>

Run this once in your terminal:

```bash
git clone https://github.com/launchintel/launchintel.git ~/.claude/skills/launchintel
```

If that folder already exists, ask Claude to update it instead of overwriting it. Start a
Claude Code session and say **“Open my LaunchIntel dashboard.”**

</details>

## Keep working in plain language

> Use LaunchIntel to prepare a submission queue for my product. Skip directories that require a badge.

> Continue my LaunchIntel run. Defer captchas you cannot solve and show me what needs my help.

> Open my LaunchIntel dashboard.

> Update LaunchIntel, keeping my product files and progress.

The dashboard runs on your computer. Claude uses your approved product details for submissions
and saves progress locally. The public repository receives none of your run files or credentials.

## Help

Use [GitHub issues](https://github.com/launchintel/launchintel/issues) for setup problems, bugs
and feature requests. Keep private playbooks, product data and order details out of public issues.
Never paste passwords, tokens or keys into chat.

If GitHub refuses access to Pro, check that you accepted the invitation and are signed into the
GitHub account connected in Polar. An access error does not mean you need to purchase again.
