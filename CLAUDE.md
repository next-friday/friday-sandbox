# CLAUDE.md

This file provides guidance to Claude Code (code.claude.com) when working with code in this repository.

## Claude Code operating rules

- **Let the hooks do the work.** `pre-commit` runs the gates on staged files; `pre-push` runs the full list (in [`CONTRIBUTING.md`](CONTRIBUTING.md)). Do **not** run the whole-repo gates (`lint`, `typecheck`, `build`, `test`, and the rest) by hand, since each is minutes of duplicated work the hooks already cover.
- **Never suppress a gate.** Fix the root cause: do not disable a lint rule, skip or loosen a gate, or use `--no-verify`, which is forbidden and re-caught by CI. Disabling is a last resort needing explicit approval with a stated reason.
- **`src` ↔ `exports` invariant.** Workspace consumers read `src/`; published consumers read `dist/`. Change one surface, keep the other aligned.
- **One change = one issue → one branch → one PR.** Behavior changes such as `feat`, `fix`, `perf`, and `refactor` require a `.changeset/*.md` entry, and the branch must start with `<issue#>-`. Titles are Conventional Commits `type(scope): subject` (≤50 chars, lowercase imperative, no body/footer); put `Closes #<n>` in the PR body, never the title. Full workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Generate components; do not hand-roll.** Scaffold a base component with `pnpm gen component` (Turborepo `turbo gen`; templates in `turbo/generators/`) — never hand-create the files or add a second changeset. The `component-*` skill suite (`.claude/skills/component-{blueprint,implement,rebut}/`) drives the issue-driven lifecycle, each writing to the shared tracker only with explicit per-artifact authorization. Full generator behavior and the blueprint → implement → rebut workflow: [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Skill docs mirror the code they describe.** The `component-*` skills reference the generator (`turbo/generators/`), the base-component patterns, and the token ladder by concrete path, token name, and scaffold output. Change one of those and the skill rots silently — update the skill in the **same change**, the way `src` ↔ `exports` stay aligned. When a skill and the tree disagree, the tree is right and the skill is the bug.
- **TypeScript only, never `.js`.** Source and scripts are TypeScript (`.ts`/`.tsx`), run with `node --experimental-strip-types <file>.ts` (Node's native type-stripping, not `tsx` or `ts-node`); a config or root build script a tool loads only as ESM uses `.mjs`. Exception: a pure text-scan gate whose logic is grep/awk over literal conventions (not a TS/CSS AST) is a shell script (`scripts/check-component-symmetry.sh`) — the root has no `tsconfig` to typecheck a root `.ts`, so a shell gate with no toolchain is the honest form.

Project rules, imported into context:

@.claude/rules/docs-follow-code.md
@.claude/rules/no-code-comments.md
@.claude/rules/no-guessing.md
@.claude/rules/no-redundancy.md
@.claude/rules/no-unprovable-llm-claims.md

## Documentation map

One fact, one home. Every convention and model fact is stated **once**, in its canonical doc, and read from there — a doc that copies another's fact drifts, and the reader (you, a sub-agent, a bot) then grabs whichever copy it opened, so the same task comes out inconsistent. This is `no-redundancy` applied to the docs.

| topic                                                                                       | canonical home                                      |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| architecture — token pipeline, styles↔react split, `@apply`-only, semantic aliases          | [`ARCHITECTURE.md`](ARCHITECTURE.md)                |
| code conventions — redundancy, guessing, docs-follow-code, code-comments, unprovable claims | [`.claude/rules/*`](.claude/rules) (imported above) |
| contribution process — issue → branch → PR, generator, gates, changeset                     | [`CONTRIBUTING.md`](CONTRIBUTING.md)                |
| doc and prose voice                                                                         | [`STYLE.md`](STYLE.md)                              |
| executable procedures                                                                       | [`.claude/skills/*`](.claude/skills)                |

Read from the home; don't restate it. An **internal reference doc** (this file, `ARCHITECTURE.md`, `CONTRIBUTING.md`) **points** to the home with a link. A **skill** keeps only its procedure — the steps and the exact names to write — and points to the home for the model behind them. Two audiences can't follow a link, so each carries a **designated mirror** that `docs-follow-code` keeps in sync: **consumer docs** (`README.md`, `apps/docs/**`) re-frame the _model_ for consumers, and **bot configs** (`.coderabbit.yaml`, `.gemini/styleguide.md`) restate the _rules_ for CodeRabbit and Gemini. A mirror may shorten and re-word for its audience but never adds a fact or contradicts its home; change a canonical fact → update its mirrors in the same change, or they drift.

## Architecture essentials

Full model: [`ARCHITECTURE.md`](ARCHITECTURE.md) (the canonical home). Hold these every session:

- **`styles` upstream, `react` downstream.** `styles` ships CSS only — tokens, the `@theme` map, each component's css; `react` owns each `tv()` variant map (`<name>.styles.ts`), linked to its css by `fri-<name>`, mirrored 1:1, `@apply`-only. Rules + detail in `ARCHITECTURE.md`.
- **Theme = four-layer token pipeline.** Seeds → derived → `@theme` bridge → component css; consume through semantic aliases (`gap-small`, `bg-primary`), never a raw numeric. Detail in `ARCHITECTURE.md`.
- **Tests are stories.** No `*.test` files; Vitest runs every `*.stories.tsx` in real Chromium via Playwright. Write a story, get a test.

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
