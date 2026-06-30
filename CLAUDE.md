# CLAUDE.md

This file provides guidance to Claude Code (code.claude.com) when working with code in this repository.

## Claude Code operating rules

- **Let the hooks do the work.** `pre-commit` runs the gates on staged files; `pre-push` runs the full list (in [`CONTRIBUTING.md`](CONTRIBUTING.md)). Do **not** run the whole-repo gates (`lint`, `typecheck`, `build`, `test`, and the rest) by hand, since each is minutes of duplicated work the hooks already cover.
- **Never suppress a gate.** Fix the root cause: do not disable a lint rule, skip or loosen a gate, or use `--no-verify`, which is forbidden and re-caught by CI. Disabling is a last resort needing explicit approval with a stated reason.
- **`src` ↔ `exports` invariant.** Workspace consumers read `src/`; published consumers read `dist/`. Change one surface, keep the other aligned.
- **One change = one issue → one branch → one PR.** Behavior changes such as `feat`, `fix`, `perf`, and `refactor` require a `.changeset/*.md` entry, and the branch must start with `<issue#>-`. Titles are Conventional Commits `type(scope): subject` (≤50 chars, lowercase imperative, no body/footer); put `Closes #<n>` in the PR body, never the title. Full workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Generate components; do not hand-roll.** Scaffold a base component with `pnpm gen component` (Turborepo `turbo gen`; templates in `turbo/generators/`) — never hand-create the files or add a second changeset. The `component-*` skill suite (`.claude/skills/component-{blueprint,implement,rebut}/`) drives the issue-driven lifecycle, each writing to the shared tracker only with explicit per-artifact authorization. Full generator behavior and the blueprint → implement → rebut workflow: [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Skill docs mirror the code they describe.** The `component-*` skills reference the generator (`turbo/generators/`), the base-component patterns, and the token ladder by concrete path, token name, and scaffold output. Change one of those and the skill rots silently — update the skill in the **same change**, the way `src` ↔ `exports` stay aligned. When a skill and the tree disagree, the tree is right and the skill is the bug.
- **TypeScript only, never `.js`.** Source and scripts are TypeScript (`.ts`/`.tsx`), run with `node --experimental-strip-types <file>.ts` (Node's native type-stripping, not `tsx` or `ts-node`); a config or root build script a tool loads only as ESM uses `.mjs`.

Project rules, imported into context:

@.claude/rules/no-guessing.md
@.claude/rules/no-redundancy.md
@.claude/rules/no-unprovable-llm-claims.md

## Architecture

Full codemap and invariants: [`ARCHITECTURE.md`](ARCHITECTURE.md). The essentials to hold every session:

- **`styles` is upstream, `react` is downstream.** `styles` owns the design tokens, the Tailwind `@theme` map, and each component's CSS; `react` consumes them and never redefines theme. A component is split across both packages and linked by a `fri-<name>` class, not an import — mirror the two sides 1:1.
- **The theme is hand-authored CSS.** Token values live in `packages/styles/src/theme/*.css` and are edited directly — base roles are flat `oklch`, while the ladder, surfaces, and tiers derive from them via runtime `color-mix`. Keep `tailwind.css` (`@theme`) and `registered.css` (`@property`) in sync with the token names by hand. Consume spacing/size through the semantic alias (`gap-sm`, `p-md`, `bg-primary`), never a raw numeric (`gap-2`) or a `gap-(--fri-*)` var form when an alias exists.
- **Tests are stories.** There are no `*.test` files; Vitest runs every `*.stories.tsx` in real Chromium via Playwright. Write a story, get a test.

## Commands

The hooks cover the gates (see operating rules); these are the scoped helpers they don't:

```sh
pnpm dev                                                   # turbo run dev: Storybook on :6006 + docs site together
pnpm dev:storybook                                         # Storybook only, on :6006
pnpm dev:docs                                              # docs site only (next dev)
pnpm --filter @friday-sandbox/react test                   # one package's tests
pnpm --filter @friday-sandbox/react exec vitest run text   # one story file (substring match)
```

Full gate list and the issue → PR workflow live in [`CONTRIBUTING.md`](CONTRIBUTING.md).
