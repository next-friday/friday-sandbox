# CLAUDE.md

Guidance for Claude Code at claude.ai/code when working in this repository.

## docs/ is the center

[`docs/`](docs/), starting at [`docs/README.md`](docs/README.md), is the canonical source of truth for **every** reader: humans, LLMs, and tools. This file holds nothing canonical; it is the Claude Code operating layer that points into `docs/`. When a fact changes, change it in `docs/`, never here. The repository overview, covering what `friday-sandbox` ships and the stack behind it, lives at [`docs/README.md`](docs/README.md).

## Where things live

| Topic                                                          | Home                                                 |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| Styles: the CSS design system for tokens, derivation, formulas | [`docs/styles/`](docs/styles/)                       |
| React: the components                                          | [`docs/react/`](docs/react/)                         |
| Tooling: build, commands, the workspace graph                  | [`docs/tooling/`](docs/tooling/)                     |
| Code-convention gates                                          | each chapter's rules, mirrored into `.claude/rules/` |
| Contributor workflow + quality gates                           | [`CONTRIBUTING.md`](CONTRIBUTING.md)                 |
| Consumer install / usage / theming                             | the package `README.md` files + deployed Storybook   |

## Claude Code operating rules

- **Read [`docs/README.md`](docs/README.md) first.** It is the map; it routes you to the document that owns each fact.
- **The convention gates auto-load.** The files in [`.claude/rules/`](.claude/rules/) mirror the rule files in each docs chapter and load by path when a matching file enters context. Treat them as gates; open the linked chapter rule for the full text.
- **Let the hooks do the work.** `PostToolUse` runs `prettier --write` + `eslint --fix` on the edited file; `pre-commit` runs the gates on staged files; `pre-push` runs the full list. Do **not** run whole-repo `turbo lint`/`typecheck`/`build`/`knip`/`test` by hand, since each is minutes of duplicated work the hooks already cover.
- **Never suppress a gate.** Fix the root cause: do not disable a lint rule, skip a check, loosen a gate, or use `--no-verify`, which is forbidden and re-caught by CI. Disabling is a last resort needing explicit approval with a stated reason.
- **`src` ↔ `exports` invariant.** Workspace consumers read `src/`; published consumers read `dist/`. Change one surface, keep the other aligned; details are in the [Tooling chapter](docs/tooling/).
- **One change = one issue → one branch → one PR.** Behavior changes such as `feat`, `fix`, `perf`, and `refactor` require a `.changeset/*.md` entry, and the branch must start with `<issue#>-`. Full workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).
