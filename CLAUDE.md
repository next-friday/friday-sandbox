# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm 10** (corepack honors `packageManager` in root `package.json`). Node `>=22.10.0`.

Root scripts fan out across workspaces via Turborepo:

```sh
pnpm install
pnpm dev              # turbo run dev (Storybook for @friday-sandbox/react, persistent, not cached)
pnpm dev:storybook    # storybook dev -p 6006 via filter
pnpm build            # turbo run build (tsdown for @friday-sandbox/react)
pnpm build:storybook  # storybook build → packages/react/storybook-static
pnpm lint             # turbo run lint (eslint --max-warnings 0)
pnpm typecheck        # turbo run check-types (tsc --noEmit)
pnpm test             # turbo run test (vitest browser mode + Storybook addon-vitest + Playwright)
pnpm test:coverage    # turbo run test:coverage
pnpm knip
pnpm depcruise        # depcruise packages (no-circular rule)
pnpm format           # prettier --write "**/*.{ts,tsx,md}"
pnpm format:check
pnpm sort             # sort-package-json on root + every workspace package.json
pnpm sort:check
pnpm doc:check        # storybook build --quiet
pnpm changeset        # author a changeset for behavior changes
pnpm generate:component  # turbo gen react-component (scaffolds new base component)
```

Scope a task to one workspace with a Turbo filter:

```sh
pnpm exec turbo lint --filter=@friday-sandbox/react
pnpm exec turbo test --filter=@friday-sandbox/react
```

Run a single Vitest file inside `packages/react`:

```sh
pnpm --filter @friday-sandbox/react exec vitest run src/components/bases/button/button.test.tsx
```

## Architecture

Turborepo + pnpm workspaces (`pnpm-workspace.yaml` → `packages/*`). All workspaces are `@friday-sandbox/*`, consumed via `workspace:*`:

- `@friday-sandbox/react` — React 19 UI library on `react-aria-components` + `tailwind-variants` + Tailwind v4.
  - **Workspace consumers** import sources directly: the `exports` map points `.` → `./src/index.ts` and `./*` → `./src/*/index.ts`, so a feature subpath like `@friday-sandbox/react/components/bases/button` resolves to `packages/react/src/components/bases/button/index.ts`.
  - **Publish** runs `tsdown` (`pnpm build`) to emit `dist/`, then `clean-package` (`prepack` / `postpack`) strips dev fields and points `main`/`module`/`types` at `dist/`. Do not assume consumers always read `src/` — keep public surface aligned across both.
- `@friday-sandbox/styles` — CSS tokens and Tailwind v4 layers (`@layer theme, base, components, utilities`). Single source for color, spacing, and radius. Components compose it, never bypass it. Published as CSS only (`exports` map exposes `./index.css`). Design system follows **Dumb Tokens, Smart Components** — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the engine and scope rules. Token source: `packages/styles/src/theme/default.css` (plain values only — no `calc()`, no `color-mix()`, no relative color syntax). Derivation (foreground, hover) lives in the consuming component CSS.
- `@friday-sandbox/eslint-config` — three flat-config presets exported as subpaths: `./base`, `./next-js`, `./react-internal`.
- `@friday-sandbox/typescript-config` — `base.json`, `nextjs.json`, `react-library.json`. Drift between presets in `lib`, `moduleResolution`, `jsx`, `target`, `strict`, or `verbatimModuleSyntax` requires a framework-specific justification.

Turbo task graph (`turbo.json`):

- `build`, `lint`, `check-types`, `doc:check`, `test`, `test:coverage`, `build:storybook` fan out via `^`, so workspace tasks run in dependency order. `doc:check` and `test*` additionally depend on `^build`.
- `dev`, `dev:storybook`, `build:watch` are `cache: false` and `persistent: true`.

Storybook deploys to Vercel from the root `vercel.json` (`pnpm --filter @friday-sandbox/react build-storybook` → `packages/react/storybook-static`). `turbo-ignore @friday-sandbox/react` skips the deploy when the lib and its workspace deps have no changes.

Dependency graph is enforced by `.dependency-cruiser.cjs` — `no-circular` is the only rule, but it is `severity: error`. Honor it: break cycles instead of suppressing.

## Component conventions (`@friday-sandbox/react`)

Components live under `packages/react/src/components/<tier>/<name>/`, where `<tier>` is the category: `bases` (interactive primitives, e.g. button), `layouts` (compositional primitives — flex, grid, scroll-area), and `samples` (Storybook-only demo components — box, long-list, wide-row — used by stories; **not re-exported from `@friday-sandbox/react` public surface**). The conventions below are the `bases` reference; `layouts` follow the same four-file skeleton but split multi-part primitives into sibling files (`grid.item.tsx`, `scroll-area.types.ts`, `scroll-area.namespace.ts`) and skip the interactive-state stories — they render no interactive state. `samples` ship a two-file skeleton (`index.ts` + `<name>.tsx`) — no `.variants.ts` (no variants) and no `.stories.tsx` (they ARE story content). Each `bases` component folder ships four files with the same skeleton:

```text
packages/react/src/components/bases/<name>/
  index.ts             # re-exports component + types from <name>.tsx
  <name>.tsx           # component, "use client" only when needed, Props type colocated
  <name>.variants.ts   # tailwind-variants definition + ButtonVariants-style types
  <name>.stories.tsx   # Storybook story (Base/<Name>) covering required states
```

- Compose `react-aria-components` for focus, selection, and keyboard behavior — do not re-implement.
- Style with Tailwind v4 utilities + `@friday-sandbox/styles` tokens/layers via `tailwind-variants`. No inline `style`, no hardcoded hex, no class strings that bypass tokens. Variant classes follow `fri-<component>-<variant>` (see `button.variants.ts`).
- The Storybook story **must** cover: `Default`, `Hovered` (use `play` with `userEvent.hover` from `storybook/test`), `Focused` (use `play` with `element.focus()`), `Disabled`, every color variant including `danger`. The Button story is the reference layout.
- Scaffold with `pnpm --filter @friday-sandbox/react generate:component` so the file shape stays symmetric across components.
- Forward all react-aria props; never re-declare them locally. `Props` extends the upstream `*Props` from `react-aria-components`.

### Class naming

- **Theme classes** carry no prefix: `.light`, `.dark`, `[data-theme="light"]`, `[data-theme="dark"]`. These toggle surface tokens at `<html>` or any subtree.
- **Component classes** are prefixed `fri-`: `fri-button`, `fri-button-primary`, `fri-button-md`. The prefix protects against collisions in consumer apps. Never strip it from component classes; never add it to theme classes.

### Token scope (`@friday-sandbox/styles`)

Tokens are scoped to a **semantic family**, not a literal component name. Three scopes:

- `action` — clickable triggers (button, icon-button, link-button) → `--size-action`, `--radius-action`
- `field` — form data entry (input, textarea, select, checkbox, radio) → `--size-field`, `--radius-field`
- `box` — containers (card, modal, alert, popover) → `--size-box`, `--radius-box`

`--size-{scope}` is the base unit (default `0.25rem`). Components compute their heights inline as `calc(var(--size-{scope}) * N)` with N ∈ {6, 8, 10, 12, 14} for xs/sm/md/lg/xl (24 / 32 / 40 / 48 / 56 px at the default base). No `--spacing-{scope}-{size}` tokens — that math is component-local.

`--radius-{scope}` is the **reference radius at `md`**. Components with size variants scale radius linearly with height (`var(--radius-{scope}) * var(--{component}-height) / (var(--size-{scope}) * 10)`) so corners stay visually proportional from xs to xl. xs is less round than the bare token, xl is more round.

Forbidden: literal-component scope (`--*-button-*`, `--*-input-*`, `--*-card-*`). Place a new component in the existing matching scope. If no scope fits, add a new semantic scope (not a literal one).

### Component CSS derivation pattern

Each component CSS file defines its engine once in the base rule and lets variants only swap the intent:

```css
.fri-button {
  --button-background: var(--primary);
  --button-foreground: oklch(
    from var(--button-background) clamp(0, calc((0.62 - l) * 100), 1) 0 0
  );
  --button-background-hover: color-mix(
    in oklab,
    var(--button-background) 88%,
    var(--background) 12%
  );
}
.fri-button-danger {
  --button-background: var(--danger);
}
```

Variants are one line each. Foreground and hover never live as global tokens.

## Docs audience

Two layers, never mixed:

- **Consumer-facing** — `packages/styles/README.md` (npm-listing) and `packages/react/src/stories/*.mdx` (deployed Storybook). Cover install, import, theme toggle, component class/prop usage, and which tokens can be overridden. Strip engine internals, file paths, threshold values, contributor workflow.
- **Contributor-facing** — [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`CONTRIBUTING.md`](CONTRIBUTING.md), and `.claude/rules/`. Engine math, scope rules, file layout, gates, conventions live here.

## Path-scoped rules (`.claude/rules/`)

These rules load automatically when matching files enter context. Treat them as gates, not suggestions:

- **`meaningful-identifiers.md`** — every identifier names what it represents. No `T`/`U`/`K` generics, no `v`/`e`/`i`/`tw`/`cb` parameters, no shortenings (`tmp`, `obj`, `arr`, `fn`, `el`). Exceptions: `id`, `i` only as a tight loop counter, `_` for discarded args.
- **`no-default-noise.md`** (paths: every `*.json`, `*.{yml,yaml}`, `.*rc*`, `*.config.*`) — do not write config keys whose value equals the tool's documented default. Empty arrays, empty objects, and explicit defaults are noise. Check the tool's docs before adding a key.
- **`no-ghosts.md`** — every named variant, size, color, mode, or state must exist as a real, addressable artifact (class, prop value, enum entry). An empty-string `tailwind-variants` value or a default baked into a base rule without a matching class is a ghost. Forbidden in every dimension.
- **`canonical-tailwind.md`** — when a CSS var is registered in `@theme inline` (see `packages/styles/src/system/theme.css`), use the canonical Tailwind alias (`bg-muted`, `text-foreground`, `rounded-action`) — never the arbitrary-var fallback `bg-(--muted)`. The `*-(--var)` form is reserved for component-local vars that have no Tailwind alias.

## Workflow

Every change ships as one issue → one branch → one PR:

1. Branch from the issue: `gh issue develop <n> --checkout`. **CI rejects branch names that do not start with `<n>-`**.
2. Behavior changes (`feat`, `fix`, `perf`, `refactor`) require a `.changeset/*.md` entry from `pnpm changeset`. CI blocks behavior changes without one.
3. PR body closes the issue with `Closes #<n>` (one per line, never `Closes #1, #2`). The PR title carries no `#N` — the squash merge auto-appends `(#<PR>)`.
4. Commit and PR title format: `type(scope): subject`. Type ∈ {build, chore, ci, docs, feat, fix, perf, refactor, revert, setup, style, test}. Scope required, lowercase. Subject lowercase, ≤50 chars. **Commit body and footer are forbidden** (`body-empty` / `footer-empty` are commitlint errors). Enforced via `.husky/commit-msg` (`@commitlint/config-conventional` + overrides in `.commitlintrc.json`).
5. PRs are reviewed by CodeRabbit and Gemini Code Assist. Style guides at `.coderabbit.yaml` and `.gemini/styleguide.md` — match them to minimize review churn.
6. `.github/PULL_REQUEST_TEMPLATE.md` includes an Architecture Compliance checklist (DRY, symmetric, typed, no gate suppression) and conditional sections marked "(when touched)" — remove the ones that do not apply rather than filling with N/A.

`pre-commit` (lint-staged via `.lintstagedrc.json`) and `pre-push` hooks run the gates. **`--no-verify` is forbidden** and is re-caught by CI.

## Quality gates

CI and local hooks both run, all must pass:

```sh
pnpm format:check
pnpm sort:check
pnpm lint
pnpm knip
pnpm depcruise
pnpm typecheck
pnpm build
pnpm doc:check
pnpm test
pnpm audit --audit-level high
```

`pnpm test` runs Vitest browser mode + Playwright and is slow.

While iterating, **let the hooks do the work** — do not run the whole-repo gates manually:

- `PostToolUse` (`.claude/hooks/post-edit-format.sh`) runs `prettier --write` and `eslint --fix` on the file just edited.
- `pre-commit` (lint-staged) runs the gates on staged files only.
- `pre-push` runs the full gate list.

Whole-repo `pnpm exec turbo check-types lint`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, etc. are reserved for the pre-push hook and CI. Running them by hand mid-task burns minutes per call and duplicates work the hooks already do.

Knip uses defaults except for two real-fixes in `knip.config.ts`: (1) a `css` compiler that rewrites `@import "..."` into virtual `import` statements so the CSS-only `packages/styles` workspace is walked correctly, and (2) `ignoreDependencies: ["eslint-import-resolver-typescript"]` on `packages/eslint-config` because the resolver is referenced by string in the eslint flat config and is invisible to static analysis. Entries are auto-detected from each workspace `package.json` (`exports`, `main`, `bin`, scripts). No rules are overridden.
