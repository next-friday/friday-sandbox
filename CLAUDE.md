# CLAUDE.md

This file provides guidance to Claude Code (code.claude.com) when working with code in this repository.

## Claude Code operating rules

- **Let the hooks do the work.** `pre-commit` runs the gates on staged files; `pre-push` runs the full list (in [`CONTRIBUTING.md`](CONTRIBUTING.md)). Do **not** run the whole-repo gates (`lint`, `typecheck`, `build`, `test`, and the rest) by hand, since each is minutes of duplicated work the hooks already cover.
- **Never suppress a gate.** Fix the root cause: do not disable a lint rule, skip or loosen a gate, or use `--no-verify`, which is forbidden and re-caught by CI. Disabling is a last resort needing explicit approval with a stated reason.
- **`src` ↔ `exports` invariant.** Workspace consumers read `src/`; published consumers read `dist/`. Change one surface, keep the other aligned.
- **One change = one issue → one branch → one PR.** Behavior changes such as `feat`, `fix`, `perf`, and `refactor` require a `.changeset/*.md` entry (only the published `@friday-sandbox/react` and `@friday-sandbox/styles`, version-locked so they bump together; the `private` `eslint-config`/`typescript-config` are never in a changeset), and the branch must start with `<issue#>-`. Titles are Conventional Commits `type(scope): subject` (≤50 chars, lowercase imperative, no body/footer); put `Closes #<n>` in the PR body, never the title. Full workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Generate components; do not hand-roll.** Scaffold a base component with `pnpm gen component` (Turborepo `turbo gen`; templates in `turbo/generators/`) — never hand-create the files or add a second changeset. The `component-*` skill suite (`.claude/skills/component-{blueprint,implement,rebut}/`) drives the issue-driven lifecycle, each writing to the shared tracker only with explicit per-artifact authorization. Full generator behavior and the blueprint → implement → rebut workflow: [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Skill docs mirror the code they describe.** The `component-*` skills reference the generator (`turbo/generators/`), the base-component patterns, and the token ladder by concrete path, token name, and scaffold output. Change one of those and the skill rots silently — update the skill in the **same change**, the way `src` ↔ `exports` stay aligned. When a skill and the tree disagree, the tree is right and the skill is the bug.
- **TypeScript only, never `.js`.** Source and scripts are TypeScript (`.ts`/`.tsx`), run with `node --experimental-strip-types <file>.ts` (Node's native type-stripping, not `tsx` or `ts-node`); a config or root build script a tool loads only as ESM uses `.mjs`. Exception: a pure text-scan gate whose logic is grep/awk over literal conventions (not a TS/CSS AST) is a shell script (`scripts/check-component-symmetry.sh`) — the root has no `tsconfig` to typecheck a root `.ts`, so a shell gate with no toolchain is the honest form.
- Conventions auto-load from [`.claude/rules/`](.claude/rules) — the global rules every session, the path-scoped rules (architecture, prose style, comments) when you touch a matching file. Process lives in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Documentation map

One fact, one home — every convention stated once, read from there (this is `no-redundancy` applied to docs). Homes:

| topic                                                                   | canonical home                                  |
| ----------------------------------------------------------------------- | ----------------------------------------------- |
| code + architecture + prose conventions                                 | [`.claude/rules/`](.claude/rules) (auto-loaded) |
| contribution process — issue → branch → PR, generator, gates, changeset | [`CONTRIBUTING.md`](CONTRIBUTING.md)            |
| executable procedures                                                   | [`.claude/skills/`](.claude/skills)             |

Read from the home; don't restate it. The two bot configs can't follow a link, so each carries a designated mirror `docs-follow-code` keeps in sync: `.coderabbit.yaml` and `.gemini/styleguide.md` restate the rules for CodeRabbit and Gemini. A mirror never adds a fact or contradicts its home — change a canonical fact, update its mirror in the same change.

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
