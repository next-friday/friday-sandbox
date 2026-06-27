---
name: component-ship
description: Use to ship a repo change through this repo's GitHub lifecycle, or when a pull request needs setting up, a branch or changeset is missing, the gates are red, or an issue needs closing by a PR. Triggers "ship this", "open the PR", "start the branch", "the gates are red", "add the changeset".
---

# Component Ship

The ship station: move a change through this repo's issue → branch → changeset → gates → PR lifecycle. The issue tracker is shared by many contributors, so a tracker write is confirmed with the user first and scoped to what you own.

## When to use

- A change — a built component, a fix — is ready to land, or the branch, changeset, or PR needs settling.
- Not this station:
  - Building or fixing the component → `component-build`.
  - Bot-review comments after the PR opens → `component-review`.

## Steps

1. **Confirm and scope first.** The tracker is shared — `CONTRIBUTING.md` says claim an issue before you start so no one duplicates work. Before creating or editing an issue, branch, or PR, confirm with the user you're working for, and work only on the issue, branch, or PR you own — do not touch another contributor's in-flight work. Not confirmed → stop here. Run `bash "${CLAUDE_SKILL_DIR}/scripts/preflight.sh"` first; it fails fast with the fix if gh is unauthenticated or there's no GitHub remote, so you recover instead of guessing.
2. **Branch from the issue.** `gh issue develop <n> --checkout`. The branch MUST start `<n>-` (a CI check in `.github/workflows/` rejects otherwise), off the default branch, one concern per branch.
3. **Make the change** on that branch. For a component, run `component-build` to its Done contract, then return here.
4. **Settle the changeset — check before adding.** A generated component ALREADY carries `.changeset/<name>-component.md` (`@friday-sandbox/react` + `@friday-sandbox/styles`, both `minor`); verify its user-facing summary in STYLE.md voice and do NOT add a second. For a behavior change WITHOUT a generated changeset (a `fix`, `perf`, `refactor`) run `pnpm changeset` once. Pure tooling or chore needs none. CI blocks a behavior change that arrives without one.
5. **Gates via the hooks.** Pre-commit runs them on staged files, pre-push the full list: `format:check`, `sort:check`, `lint`, `knip`, `depcruise`, `typecheck`, `build`, `build:storybook`, `test`, plus `audit`. Do not run whole-repo gates by hand; never `--no-verify` or disable a rule — fix the root cause.
6. **Open the PR** (after step 1's confirmation). Title is Conventional Commits `type(scope): subject` — type from the repo enum (`feat fix docs refactor perf chore build ci style test …`), scope the area (`react`, `styles`, `docs`, `tooling`), ≤50 chars, lowercase imperative, no body or footer. Put `Closes #<n>` in the BODY, never the title. Fill the PR template; add a screenshot for visual changes.

## Done — the contract

- [ ] Each GitHub write confirmed with the user and scoped to an owned artifact.
- [ ] Branch starts `<n>-`, off the default branch, one concern.
- [ ] Exactly one correct changeset: the generated `<name>-component.md` for a new component (summary checked), or one `pnpm changeset` for a non-generated behavior change, or none for a chore.
- [ ] Gates green via the hooks, nothing suppressed.
- [ ] PR title valid Conventional Commits ≤50; `Closes #<n>` in the body; template filled.

## Verify

- Confirm the branch matches `^<n>-`, the title parses as `type(scope): subject` within 50 chars, and exactly one changeset covers the change.
- Do not claim green from memory — the hooks' output is the evidence.

## Red flags — STOP

- Creating or editing a tracker artifact without confirming with the user → STOP (shared tracker).
- Touching an issue, branch, or PR you don't own, on title or topic match → STOP; it may be another contributor's in-flight work.
- Adding a second changeset on top of the generator's `<name>-component.md` → duplicate; the generator already wrote it.
- `--no-verify`, disabling a rule, or "I'll fix the gate later" → forbidden; fix the cause.
- `Closes #n` in the title, or a subject over 50 chars or capitalized → invalid.
- Splitting one coherent change across multiple PRs → keep it one issue, one PR.

## What this encodes

- Workflow, commit, changeset, and gate rules: `CONTRIBUTING.md`. Operating rules and the `src` ↔ `exports` invariant: `CLAUDE.md`.
- The generator pre-writes a component's changeset (`turbo/generators/templates/changeset.md.hbs`) — verify it, never duplicate it.
- The tracker is shared (`CONTRIBUTING.md`: claim before you start; one issue, one PR). Chromatic (`CHROMATIC_PROJECT_TOKEN`) and Sonar (`SONAR_TOKEN`) can show red when their secrets aren't configured (`.github/workflows/`); whether a check blocks merge is branch-protection config — confirm via the PR's checks (see `component-review`).
