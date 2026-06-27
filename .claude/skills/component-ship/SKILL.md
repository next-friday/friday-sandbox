---
name: component-ship
description: Use to ship a base-component change in @friday-sandbox/react through the repo's issue → branch → changeset → gates → PR lifecycle — when a component's branch, changeset, or PR needs settling, or a component PR's gates are red. Triggers "ship this component", "open the component PR", "start the component branch", "the gates are red on the component". Not for docs, config, tooling, or other non-component changes.
---

# Component ship

The ship station: move a change through this repo's issue → branch → changeset → gates → PR lifecycle. The issue tracker is shared by many contributors, so a tracker write is confirmed with the user first and scoped to what you own.

## When to use

- A change — a built component, a fix — is ready to land, or the branch, changeset, or PR needs settling.
- Not this station:
  - Building or fixing the component → `component-build`.
  - Bot-review comments after the PR opens → `component-review`.

## Steps

1. **Authorize the lifecycle once, then scope.** The tracker is shared — `CONTRIBUTING.md` says claim an issue before you start so no one duplicates work. Get the user's go-ahead **once** for the whole issue → branch → push → PR lifecycle of the change they named — not a fresh prompt before each gh write — then run it through without pausing mid-pipeline. The per-artifact STOP applies only to work the user did NOT name: never create an issue, branch, or PR they didn't ask for, and never touch another contributor's in-flight artifact. Not authorized → stop here. Run `bash "${CLAUDE_SKILL_DIR}/scripts/preflight.sh"` first; it fails fast with the fix if gh is unauthenticated or there's no GitHub remote, so you recover instead of guessing.
2. **Create the issue (if none), then branch.** If no issue exists yet, create one after the user's authorization (shared tracker — only the change they named): `gh issue create --title "type(scope): subject" --body "…"`. Then `gh issue develop <n> --checkout`. The branch MUST start `<n>-` (a CI check in `.github/workflows/` rejects otherwise), off the default branch, one concern per branch. Keep the working tree to that one concern: uncommitted changes from another concern ride along on checkout and — because pre-push gates run whole-repo (`format:check` and friends) — can block the push even though they are unstaged; commit or stash them first, and stage only this change's files.
3. **Make the change** on that branch. For a component, run `component-build` to its Done contract, then return here. If the spec shifts after you reach this station (a renamed prop, a dropped axis), loop back through `component-build` and return — that loop is cheap while the work is still local and uncommitted, but once the PR is open it costs a fresh review round, so prefer settling the design before step 2.
4. **Settle the changeset — check before adding.** A generated component ALREADY carries `.changeset/<name>-component.md` (`@friday-sandbox/react` + `@friday-sandbox/styles`, both `minor`); verify its user-facing summary in STYLE.md voice and do NOT add a second. For a behavior change WITHOUT a generated changeset (a `feat`, `fix`, `perf`, `refactor`) run `pnpm changeset` once. Pure tooling or chore needs none. CI blocks a behavior change that arrives without one.
5. **Gates via the hooks.** Pre-commit runs them on staged files; pre-push runs `format:check`, `sort:check`, `lint:symmetry`, then the affected-package tasks (`lint`, `typecheck`, `build`, `build:storybook`, `test`), the graph gates (`knip`, `depcruise`), plus `audit`. Do not run whole-repo gates by hand; never `--no-verify` or disable a rule — fix the root cause.
6. **Open the PR** (covered by step 1's one-time authorization — no separate confirm). Title is Conventional Commits `type(scope): subject` — type from the repo enum (`feat fix docs refactor perf chore build ci style test …`), scope the area (`react`, `styles`, `docs`, `tooling`), ≤50 chars, lowercase imperative, no body or footer. Put `Closes #<n>` in the BODY, never the title. Fill the PR template; add a screenshot for visual changes.

## Done — the contract

- [ ] The whole issue → PR lifecycle authorized once at entry; only artifacts the user named were created, none of another contributor's.
- [ ] Branch starts `<n>-`, off the default branch, one concern.
- [ ] Exactly one correct changeset: the generated `<name>-component.md` for a new component (summary checked), or one `pnpm changeset` for a non-generated behavior change, or none for a chore.
- [ ] Gates green via the hooks, nothing suppressed.
- [ ] PR title valid Conventional Commits ≤50; `Closes #<n>` in the body; template filled.

## Verify

- Confirm the branch matches `^<n>-`, the title parses as `type(scope): subject` within 50 chars, and exactly one changeset covers the change.
- Do not claim green from memory — the hooks' output is the evidence.

## Closing summary table

On finishing, report one markdown table — the result at a glance:

| Issue  | Branch       | Commit              | Gates          | PR                      |
| ------ | ------------ | ------------------- | -------------- | ----------------------- |
| `#<n>` | `<n>-<slug>` | `<sha>` `<subject>` | pass via hooks | `#<pr>` (`Closes #<n>`) |

## Red flags — STOP

- Creating or editing a tracker artifact the user did not authorize → STOP (shared tracker); one authorization covers the named change's whole lifecycle, but never an artifact they didn't ask for.
- Touching an issue, branch, or PR you don't own, on title or topic match → STOP; it may be another contributor's in-flight work.
- Adding a second changeset on top of the generator's `<name>-component.md` → duplicate; the generator already wrote it.
- `--no-verify`, disabling a rule, or "I'll fix the gate later" → forbidden; fix the cause.
- `Closes #n` in the title, or a subject over 50 chars or capitalized → invalid.
- Splitting one coherent change across multiple PRs → keep it one issue, one PR.

## What this encodes

- Workflow, commit, changeset, and gate rules: `CONTRIBUTING.md`. Operating rules and the `src` ↔ `exports` invariant: `CLAUDE.md`.
- The generator pre-writes a component's changeset (`turbo/generators/templates/changeset.md.hbs`) — verify it, never duplicate it.
- The tracker is shared (`CONTRIBUTING.md`: claim before you start; one issue, one PR). Chromatic (`CHROMATIC_PROJECT_TOKEN`) can show red when its secret isn't configured (`.github/workflows/chromatic.yml`); whether a check blocks merge is branch-protection config — confirm via the PR's checks (see `component-review`).
