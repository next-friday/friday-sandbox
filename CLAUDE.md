# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## docs/ is the center

[`docs/`](docs/) — starting at [`docs/README.md`](docs/README.md) — is the canonical source of truth for **every** reader: humans, LLMs, and tools. This file holds nothing canonical; it is the Claude Code operating layer that points into `docs/`. When a fact changes, change it in `docs/`, never here.

`friday-sandbox` is a Turborepo + pnpm monorepo shipping the public `@friday-sandbox/*` packages: a React 19 UI library (`react`) on `react-aria-components` + `tailwind-variants` + Tailwind v4, its design-token CSS (`styles`), and shared `eslint-config` / `typescript-config` presets.

## Where things live

| Topic                                                            | Home                                               |
| ---------------------------------------------------------------- | -------------------------------------------------- |
| Build, commands, tooling, the workspace graph                    | [`docs/build.md`](docs/build.md)                   |
| Design-system engine (Dumb Tokens/Smart Components, dark mode)   | [`docs/architecture.md`](docs/architecture.md)     |
| Derivation formulas (height, padding, radius, foreground, hover) | [`docs/formulas.md`](docs/formulas.md)             |
| Code-convention gates                                            | [`docs/conventions/`](docs/conventions/)           |
| Contributor workflow + quality gates                             | [`CONTRIBUTING.md`](CONTRIBUTING.md)               |
| Consumer install / usage / theming                               | the package `README.md` files + deployed Storybook |

## Claude Code operating rules

- **Read [`docs/README.md`](docs/README.md) first.** It is the map; it routes you to the document that owns each fact.
- **The convention gates auto-load.** The files in [`.claude/rules/`](.claude/rules/) mirror [`docs/conventions/`](docs/conventions/) and load by path when a matching file enters context. Treat them as gates; open the linked `docs/conventions/` file for the full rule.
- **Let the hooks do the work.** `PostToolUse` runs `prettier --write` + `eslint --fix` on the edited file; `pre-commit` runs the gates on staged files; `pre-push` runs the full list. Do **not** run whole-repo `turbo lint`/`typecheck`/`build`/`knip`/`test` by hand — each is minutes of duplicated work the hooks already cover.
- **Never suppress a gate.** Fix the root cause — do not disable a lint rule, skip a check, loosen a gate, or use `--no-verify` (forbidden, re-caught by CI). Disabling is a last resort needing explicit approval with a stated reason.
- **`src` ↔ `exports` invariant.** Workspace consumers read `src/`; published consumers read `dist/`. Change one surface, keep the other aligned — details in [`docs/build.md`](docs/build.md).
- **One change = one issue → one branch → one PR.** Behavior changes (`feat`, `fix`, `perf`, `refactor`) require a `.changeset/*.md` entry, and the branch must start with `<issue#>-`. Full workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).
