# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Turborepo + pnpm monorepo shipping the public `@friday-sandbox/*` packages: a React 19 UI library (`react`) built on `react-aria-components` + `tailwind-variants` + Tailwind v4, its design-token CSS (`styles`), and shared `eslint-config` / `typescript-config` presets. Every workspace keeps its sources under `src/` and exposes a public surface through `package.json#exports` — the folder shape is symmetric across all four packages.

New to the repo? The [`docs/`](docs/) hub is the start-here map; it routes you to the right document per task.

## Single source of truth

Each fact has exactly one home. Read these — never restate their content in code comments, other docs, or reviewer configs. When a fact changes, change it here:

| Topic                                                                 | Home                                                                                    |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Design-system engine (Dumb Tokens/Smart Components, dark mode)        | [`docs/architecture.md`](docs/architecture.md)                                          |
| Derivation formulas (height, padding, radius, foreground, hover)      | [`docs/formulas.md`](docs/formulas.md)                                                  |
| Code-convention gates                                                 | [`docs/conventions/`](docs/conventions/) (mirrored into `.claude/rules/` for auto-load) |
| Contributor workflow (issue → branch → PR, commits, changeset, gates) | [`CONTRIBUTING.md`](CONTRIBUTING.md)                                                    |
| Consumer install / usage / theming                                    | package `README.md` files + deployed Storybook                                          |

## Commands

Package manager is **pnpm 10** (corepack honors `packageManager` in the root `package.json`). Node `>=22.10.0`. Root scripts fan out across workspaces via Turborepo:

```sh
pnpm install
pnpm dev              # turbo run dev (Storybook for @friday-sandbox/react, persistent, not cached)
pnpm dev:storybook    # storybook dev -p 6006 via filter
pnpm build            # turbo run build (tsdown for @friday-sandbox/react)
pnpm build:storybook  # storybook build → packages/react/storybook-static
pnpm lint             # turbo run lint (eslint --max-warnings 0)
pnpm typecheck        # turbo run check-types (tsc --noEmit)
pnpm test             # turbo run test (vitest browser mode + Storybook addon-vitest + Playwright)
pnpm test:coverage
pnpm knip
pnpm depcruise        # depcruise packages (no-circular rule)
pnpm format           # prettier --write
pnpm sort             # sort-package-json across every workspace
pnpm doc:check        # storybook build --quiet
pnpm changeset        # author a changeset for behavior changes
```

Scope to one workspace with a Turbo filter, or run a single Vitest file:

```sh
pnpm exec turbo lint --filter=@friday-sandbox/react
pnpm --filter @friday-sandbox/react exec vitest run src/components/bases/button/button.test.tsx
```

## Conventions are gates

The canonical conventions live in [`docs/conventions/`](docs/conventions/) — tool-agnostic, one file per rule, enforced by CI and the PR reviewers. The files in [`.claude/rules/`](.claude/rules/) are thin pointers that mirror them and auto-load by path when a matching file enters context. Read the linked `docs/conventions/` file for the full rule. Treat them as gates, not suggestions:

- **`component-structure.md`** — the symmetric component folder skeleton, lowercase filenames, named export, colocated `Props`, `*.variants.ts`, exports-map reachability.
- **`compose-and-dry.md`** — compose `react-aria-components` and the `layouts` primitives; extract shared logic into a hook instead of repeating it.
- **`accessibility-and-stories.md`** — keyboard/focus/ARIA, `addon-a11y`, required story states, and Storybook copy written for consumers.
- **`semantic-token-scope.md`** — size/radius tokens scoped to `action` / `field` / `box`, never a literal component name.
- **`canonical-tailwind.md`** — use the Tailwind alias for any token mapped in `@theme inline` (`bg-muted`, not `bg-(--muted)`).
- **`no-ghosts.md`** — every named variant/size/state is a real, addressable class; no defaults hidden in a base rule.
- **`meaningful-identifiers.md`** — every identifier names what it represents; no prose comments.
- **`no-default-noise.md`** — never write a config key whose value equals the tool's documented default.

## Operating rules

- **Let the hooks do the work.** `PostToolUse` runs `prettier --write` + `eslint --fix` on the edited file; `pre-commit` runs the gates on staged files; `pre-push` runs the full list. Do **not** run whole-repo `turbo lint`/`typecheck`/`build`/`knip`/`test` by hand — each is minutes of duplicated work the hooks already cover.
- **`src` ↔ `exports` invariant.** Workspace consumers read `src/` directly; published consumers read `dist/` (`tsdown` build, then `clean-package` repoints `main`/`module`/`types`). Change one surface, keep the other aligned.
- **Never suppress a gate.** Fix the root cause — do not disable a lint rule, skip a check, loosen a gate, or use `--no-verify` (forbidden, re-caught by CI). Disabling is a last resort needing explicit approval with a stated reason.
- **One change = one issue → one branch → one PR.** Behavior changes (`feat`, `fix`, `perf`, `refactor`) require a `.changeset/*.md` entry, and the branch must start with `<issue#>-`. Full workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Repo mechanics

- **Turbo graph** (`turbo.json`): `build`, `lint`, `check-types`, `doc:check`, `test`, `build:storybook` fan out via `^` (dependency order); `doc:check` and `test*` also depend on `^build`. `dev`, `dev:storybook`, `build:watch` are `cache: false` + `persistent: true`.
- **Quality gates** (CI and hooks, all must pass): `format:check`, `sort:check`, `lint`, `knip`, `depcruise`, `typecheck`, `build`, `doc:check`, `test`, `audit --audit-level high`. `test` is slow (Vitest browser mode + Playwright).
- **Dependency graph** is enforced by `.dependency-cruiser.cjs` — `no-circular`, `severity: error`. Break cycles, never suppress.
- **Knip** runs from `knip.config.ts` on near-defaults: a `css` compiler walks the CSS-only `styles` workspace, and `eslint-import-resolver-typescript` is ignored on `eslint-config` (referenced by string in the flat config). Entries auto-detect from each `package.json`.
- **Storybook** deploys to Vercel from the root `vercel.json`; `turbo-ignore @friday-sandbox/react` skips the deploy when the lib and its deps are unchanged.
