# Review style guide

This repository is `friday-sandbox`, a pnpm + Turborepo monorepo shipping the `@friday-sandbox/*` packages: a React 19 UI library in `react`, CSS tokens and layers in `styles`, ESLint flat-config presets in `eslint-config`, and TypeScript config presets in `typescript-config`. A documentation site in `apps/docs`, built on Next.js App Router and Fumadocs, consumes the published packages. The packages are consumed as workspace dependencies internally and publish to npm.

The project conventions are enforced in this guide. **Enforce these rules**; they are the source of truth. This guide gives the review priority order and the highest-value checks per area. Be terse: one sentence per finding, naming the problem, the location, and the fix, grouped by severity, highest first. Skip praise, skip restating the diff.

## Review priorities

Rank findings from highest to lowest:

1. Security and secret leakage.
2. Accessibility regressions in `@friday-sandbox/react`.
3. Correctness: runtime errors, type holes, a missing changeset on a behavior change.
4. API ergonomics: exports-map drift, prop naming, controlled-vs-uncontrolled patterns.
5. Architecture and DRY: duplicated logic, a missing shared hook, preset drift.
6. Style and idiom: only after the above.

## Skip the release PR

The `chore(release): version packages` PR is produced by `changesets/action`. It contains only generated diffs: `.changeset/*` removed, `packages/*/CHANGELOG.md` added, and `packages/*/package.json` version bumps. Do not review it; the diff is mechanical and not human-authored.

## Components and hooks: `packages/react/src/**`

Key checks for components and hooks:

- Lowercase filename such as `button.tsx`, not `Button.tsx`; a named export with the `Props` type colocated; no default export.
- `"use client"` only when a client API such as `useState`, `useEffect`, refs, or event handlers is touched; flag a missing directive on a client component and a needless one on a pure component.
- Compose `react-aria-components` for focus, selection, and keyboard behavior instead of hand-rolling it.
- Shared logic such as focus management, ARIA wiring, controlled-vs-uncontrolled, and event coalescing lives in a reusable hook under `packages/react/src/`; flag re-implementations across components.
- A new file is reachable through the package `exports` map, where `.` → `./src/index.ts` and `./*` → `./src/*/index.ts`; a file no `index.ts` re-exports is unreachable.

## Accessibility and stories: `packages/react/src/**/*.stories.{ts,tsx}`

Key checks for accessibility and stories:

- Keyboard reachable, focus visible, ARIA only where the DOM does not convey intent, motion respects `prefers-reduced-motion`; the story passes `addon-a11y`.
- A new or changed behavior ships story coverage of `Default`, `Hovered`, `Focused`, `Disabled`, and every color variant including `danger`, using real props rather than mocked data.
- Stories are the test suite: they run in Vitest browser mode via `@storybook/addon-vitest` with Playwright chromium; prefer Storybook play functions over imperative DOM assertions and cover keyboard paths alongside pointer paths.
- No separate `*.test.*` files exist or belong here; a behavior is verified by its story. Flag a new test file and ask for a `*.stories.tsx` play function instead.
- Story copy is consumer-facing: flag internal class names such as `fri-button-*` and `fri-flex-*`, library names such as `tailwind-variants` and `react-aria`, engine math such as `calc(var(--size-action) * N)`, or file paths. Symmetric story shape across files.
- Story copy stays generic, not brittle: flag concrete pixel sizes or an exhaustive enumeration of a prop's values; prefer the imperative `Use the \`X\` prop to …` form and let the stories demonstrate the values.

## Styles: `packages/styles/src/**`, Tailwind v4

Key checks for styles:

- Respect the `@layer` system; flag inline `style` objects, hardcoded hex colors, and class strings that bypass tokens.
- Canonical Tailwind alias for any var mapped in `@theme inline`, such as `bg-primary` and not `bg-(--primary)`; the `*-(--var)` form is only for component-local vars with no alias.
- Size and radius tokens scoped to `action`, `field`, or `box`, never a literal component name.
- A token rename carries a migration note in the changeset; no global selectors that bypass layers.

## Configs: `packages/eslint-config`, `packages/typescript-config`

- `eslint-config` keeps `./base`, `./next-js`, `./react-internal` resolving in consumer workspaces. A rule added to the wrong preset, or a plugin import without a matching peer dep, is a deviation.
- `typescript-config` keeps `base.json`, `nextjs.json`, and `react-library.json` agreeing on `lib`, `moduleResolution`, `jsx`, `target`, `strict`, and `verbatimModuleSyntax`, unless a framework difference justifies otherwise.

## Documentation site: `apps/docs/**`, Next.js + Fumadocs

- Consumes the published `@friday-sandbox/react` and `@friday-sandbox/styles`; flag a component re-implemented here instead of imported, or a deep import that bypasses the package `exports` map.
- `"use client"` only when a client API is touched; demos exercise the real public component API, not internal class names or private paths.
- MDX under `content/docs/**` documents the real exported prop names and types; flag a documented prop the component does not expose, or an import snippet that uses a workspace path rather than the package name.

## Workflows: `.github/workflows/**`

- Third-party actions pinned to a commit SHA, not a tag.
- Each job sets a tight `timeout-minutes` and a minimal `permissions` block; top-level `permissions: contents: read`, job-level grants only what the step needs.
- Every job runs `step-security/harden-runner` first.

## Shell scripts: `.github/scripts/**`

- Start with `set -euo pipefail`; quote every variable expansion; read inputs from explicit env vars set at the step level, not positional args.

## Changesets (`.changeset/!(README).md`)

- A behavior-changing PR type such as `feat`, `fix`, `perf`, or `refactor` requires one entry; the bump level of patch, minor, or major matches the change, so `feat` is at least minor and a breaking change is major. The summary reads as a release note to a downstream consumer.

## Commits, branches, and pull requests

- Conventional commits, strict: `type(scope): subject`, type from the enum `build | chore | ci | docs | feat | fix | perf | refactor | revert | setup | style | test`, scope required, all lowercase, subject 50 characters or fewer, no body, no footer.
- The PR title carries no `#N`; issue closures go in the PR body as `Closes #N`, one per line.
- Branches are created from an issue with `gh issue develop <n>`, so `head_ref` starts with `<n>-`.
- `--no-verify` is forbidden and is re-caught by CI.

## Documentation prose

- Prose follows the editorial style guide in `STYLE.md`. The `scripts/prose/lint-prose.mjs` gate flags a banned marketing adjective, an off-vocabulary synonym, and a component doc missing a required section, so those are caught before review.
- For the judgment axes the linter cannot check, flag a switch of narrator or voice within one document, and maintainer-internal detail in a consumer page. Name the `STYLE.md` section.

## Code quality

- DRY across components, not just within one: flag re-implementations.
- No prose comments in source; intent lives in names and commits. Flag explanatory comments unless they encode a non-obvious invariant.
- `--max-warnings 0` is enforced; a warning-level lint is a CI failure.
