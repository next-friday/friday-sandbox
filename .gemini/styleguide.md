# Review style guide

This repository is `friday-sandbox`, a pnpm + Turborepo monorepo shipping the `@friday-sandbox/*` packages: a React 19 UI library (`react`), CSS tokens and layers (`styles`), ESLint flat-config presets (`eslint-config`), and TypeScript config presets (`typescript-config`). The packages are consumed as workspace dependencies internally and publish to npm.

The project conventions are defined once in the [docs handbook](../docs/) — the rules sit in each chapter, and the design-system engine in the [Styles chapter](../docs/styles/). **Enforce those rules** — they are the source of truth. This guide adds the review priority order and the highest-value checks per area; it does not restate the rationale. Be terse: one sentence per finding (the problem, the location, the fix), grouped by severity, highest first. Skip praise, skip restating the diff.

## Review priorities

Rank findings from highest to lowest:

1. Security and secret leakage.
2. Accessibility regressions in `@friday-sandbox/react`.
3. Correctness: runtime errors, type holes, a missing changeset on a behavior change.
4. API ergonomics: exports-map drift, prop naming, controlled-vs-uncontrolled patterns.
5. Architecture and DRY: duplicated logic, a missing shared hook, preset drift.
6. Style and idiom: only after the above.

## Skip the release PR

The `chore(release): version packages` PR is produced by `changesets/action`. It contains only generated diffs (`.changeset/*` removed, `packages/*/CHANGELOG.md` added, `packages/*/package.json` version bumps). Do not review it; the diff is mechanical and not human-authored.

## Components and hooks (`packages/react/src/**`)

Enforce [`component-structure.md`](../docs/react/component-structure.md) and [`compose-and-dry.md`](../docs/react/compose-and-dry.md). Key checks:

- Lowercase filename (`button.tsx`, not `Button.tsx`); a named export with the `Props` type colocated; no default export.
- `"use client"` only when a client API is touched (`useState`, `useEffect`, refs, event handlers) — flag a missing directive on a client component and a needless one on a pure component.
- Compose `react-aria-components` for focus, selection, and keyboard behavior instead of hand-rolling it.
- Shared logic (focus management, ARIA wiring, controlled-vs-uncontrolled, event coalescing) lives in a reusable hook under `packages/react/src/` — flag re-implementations across components.
- A new file is reachable through the package `exports` map (`.` → `./src/index.ts`, `./*` → `./src/*/index.ts`); a file no `index.ts` re-exports is unreachable.

## Accessibility, stories, and tests (`packages/react/src/**/*.{stories,test}.{ts,tsx}`)

Enforce [`accessibility-and-stories.md`](../docs/react/accessibility-and-stories.md). Key checks:

- Keyboard reachable, focus visible, ARIA only where the DOM does not convey intent, motion respects `prefers-reduced-motion`; the story passes `addon-a11y`.
- A new or changed behavior ships story coverage of `Default`, `Hovered`, `Focused`, `Disabled`, and every color variant including `danger`, using real props rather than mocked data.
- Tests run in Vitest browser mode via `@storybook/addon-vitest` with Playwright chromium; prefer Storybook play functions over imperative DOM assertions and cover keyboard paths alongside pointer paths.
- Story copy is consumer-facing — flag internal class names (`fri-button-*`, `fri-flex-*`), library names (`tailwind-variants`, `react-aria`), engine math (`calc(var(--size-action) * N)`), or file paths. Symmetric story shape across files.

## Styles (`packages/styles/src/**`, Tailwind v4)

Enforce [`canonical-tailwind.md`](../docs/styles/canonical-tailwind.md) and [`semantic-token-scope.md`](../docs/styles/semantic-token-scope.md). Key checks:

- Respect the `@layer` system; flag inline `style` objects, hardcoded hex colors, and class strings that bypass tokens.
- Canonical Tailwind alias for any var mapped in `@theme inline` (`bg-muted`, not `bg-(--muted)`); the `*-(--var)` form is only for component-local vars with no alias.
- Size and radius tokens scoped to `action`, `field`, or `box` — never a literal component name.
- A token rename carries a migration note in the changeset; no global selectors that bypass layers.

## Configs (`packages/eslint-config`, `packages/typescript-config`)

- `eslint-config` keeps `./base`, `./next-js`, `./react-internal` resolving in consumer workspaces. A rule added to the wrong preset, or a plugin import without a matching peer dep, is a deviation.
- `typescript-config` keeps `base.json`, `nextjs.json`, and `react-library.json` agreeing on `lib`, `moduleResolution`, `jsx`, `target`, `strict`, and `verbatimModuleSyntax`, unless a framework difference justifies otherwise.

## Workflows (`.github/workflows/**`)

- Third-party actions pinned to a commit SHA, not a tag.
- Each job sets a tight `timeout-minutes` and a minimal `permissions` block; top-level `permissions: contents: read`, job-level grants only what the step needs.
- Every job runs `step-security/harden-runner` first.

## Shell scripts (`.github/scripts/**`)

- Start with `set -euo pipefail`; quote every variable expansion; read inputs from explicit env vars set at the step level, not positional args.

## Changesets (`.changeset/!(README).md`)

- A behavior-changing PR type (`feat`, `fix`, `perf`, `refactor`) requires one entry; the bump level (patch, minor, major) matches the change (`feat` is at least minor, a breaking change major). The summary reads as a release note to a downstream consumer.

## Commits, branches, and pull requests

- Conventional commits, strict: `type(scope): subject`, type from the enum (`build | chore | ci | docs | feat | fix | perf | refactor | revert | setup | style | test`), scope required, all lowercase, subject 50 characters or fewer, no body, no footer.
- The PR title carries no `#N`; issue closures go in the PR body as `Closes #N`, one per line.
- Branches are created from an issue (`gh issue develop <n>`), so `head_ref` starts with `<n>-`.
- `--no-verify` is forbidden and is re-caught by CI.

## Code quality

- DRY across components, not just within one — flag re-implementations.
- No prose comments in source; intent lives in names, commits, and `docs/`. Flag explanatory comments unless they encode a non-obvious invariant.
- `--max-warnings 0` is enforced; a warning-level lint is a CI failure.
