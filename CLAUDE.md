# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Claude Code operating rules

- **Let the hooks do the work.** `pre-commit` runs the gates on staged files; `pre-push` runs the full list (in [`CONTRIBUTING.md`](CONTRIBUTING.md)). **YOU MUST NOT** run the whole-repo gates (`lint`, `typecheck`, `build`, `test`, and the rest) by hand — each is minutes of duplicated work the hooks already cover.
- **Never suppress a gate.** YOU MUST fix the root cause: never disable a lint rule, skip or loosen a gate, or use `--no-verify` (forbidden, re-caught by CI). Disabling is a last resort needing explicit approval with a stated reason.
- **`src` ↔ `exports` invariant.** Workspace consumers read `src/`; published consumers read `dist/`. Change one surface, keep the other aligned.
- **One change = one issue → one branch (`<issue#>-`) → one PR.** Behavior changes (`feat`/`fix`/`perf`/`refactor`) need a `.changeset/*.md`; titles are Conventional Commits `type(scope): subject` (≤50 chars, lowercase imperative, no body/footer), with `Closes #<n>` in the PR body, never the title. Which packages a changeset covers, and the full workflow: [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Generate components; do not hand-roll.** Scaffold a base component with `pnpm gen component` (Turborepo `turbo gen`; templates in `turbo/generators/`) — never hand-create the files or add a second changeset. The `component-*` skill suite (`.claude/skills/component-{blueprint,implement,docs,rebut}/`) drives the issue-driven lifecycle, each writing to the shared tracker only with explicit per-artifact authorization. Full generator behavior and the workflow: [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Skill docs mirror the code they describe.** The `component-*` skills reference the generator (`turbo/generators/`), the base-component patterns, and the token ladder by concrete path, token name, and scaffold output. Change one of those and the skill rots silently — update the skill in the **same change**, the way `src` ↔ `exports` stay aligned. When a skill and the tree disagree, the tree is right and the skill is the bug.
- **TypeScript only, never `.js`.** Source and scripts are `.ts`/`.tsx`, run with `node --experimental-strip-types` (Node's native type-stripping, not `tsx`/`ts-node`); a config a tool loads only as ESM is `.mjs`. Every check that reads code is TypeScript on real ASTs — the symmetry gate (`scripts/check-component-symmetry.ts`) uses the TypeScript compiler API for `.ts`/`.tsx` and postcss for CSS, never a text scan. The one shell niche is `.claude/skills/*/scripts/*.sh` process wrappers that only orchestrate `git`/`gh`/`pnpm` commands and parse no source.
- Conventions auto-load from [`.claude/rules/`](.claude/rules) — the global rules every session, the path-scoped rules (the styles/react architecture set, prose voice, vocabulary, doc skeletons, markdown style, comments, minimal examples, stories-docs sync) when you touch a matching file. One rule = one concern = one file. Process lives in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Documentation map

One fact, one home — every convention stated once, read from there (this is `no-redundancy` applied to docs). Homes:

| topic                                                                   | canonical home                                  |
| ----------------------------------------------------------------------- | ----------------------------------------------- |
| code + architecture + prose conventions                                 | [`.claude/rules/`](.claude/rules) (auto-loaded) |
| contribution process — issue → branch → PR, generator, gates, changeset | [`CONTRIBUTING.md`](CONTRIBUTING.md)            |
| executable procedures                                                   | [`.claude/skills/`](.claude/skills)             |

Read from the home; don't restate it. The bot configs (`.coderabbit.yaml`, `.gemini/styleguide.md`) carry designated mirrors — the mirror mechanism and its sync duty live in `.claude/rules/docs-follow-code.md`.

**Link direction is one-way.** `CONTRIBUTING.md`, the READMEs, `apps/docs/**`, and `.github/**` docs are the human layer: self-contained, never referencing `.claude/**` — a contributor who hand-writes code, uses another editor, or deletes the AI layer loses nothing (the gates enforce the same contracts for everyone). `.claude/**` is the LLM overlay: it references the human layer and the code, never the reverse. Two sanctioned exceptions: CONTRIBUTING's "Building a component with Claude" section (it documents the AI route itself) and path globs in automation configs (`.github/labeler.yml` matches `.claude/**` to label PRs — a matching pattern, not a dependency).

## Commands

The hooks cover the gates (see operating rules); these are the scoped helpers they don't:

| Command                                                    | Does                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------ |
| `pnpm dev`                                                 | turbo run dev: Storybook on :6006 + docs site together |
| `pnpm dev:storybook`                                       | Storybook only, on :6006                               |
| `pnpm dev:docs`                                            | docs site only (next dev)                              |
| `pnpm --filter @friday-sandbox/react test`                 | one package's tests                                    |
| `pnpm --filter @friday-sandbox/react exec vitest run text` | one story file (substring match)                       |

Full gate list and the issue → PR workflow live in [`CONTRIBUTING.md`](CONTRIBUTING.md).
