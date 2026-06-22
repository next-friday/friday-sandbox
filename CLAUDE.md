# CLAUDE.md

Guidance for Claude Code at claude.ai/code when working in this repository.

## Claude Code operating rules

- **Let the hooks do the work.** `PostToolUse` runs `prettier --write` + `eslint --fix` on the edited file; `pre-commit` runs the gates on staged files; `pre-push` runs the full list. Do **not** run whole-repo `turbo lint`/`typecheck`/`build`/`knip`/`test` by hand, since each is minutes of duplicated work the hooks already cover.
- **Never suppress a gate.** Fix the root cause: do not disable a lint rule, skip a check, loosen a gate, or use `--no-verify`, which is forbidden and re-caught by CI. Disabling is a last resort needing explicit approval with a stated reason.
- **`src` ↔ `exports` invariant.** Workspace consumers read `src/`; published consumers read `dist/`. Change one surface, keep the other aligned.
- **One change = one issue → one branch → one PR.** Behavior changes such as `feat`, `fix`, `perf`, and `refactor` require a `.changeset/*.md` entry, and the branch must start with `<issue#>-`. Full workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).
