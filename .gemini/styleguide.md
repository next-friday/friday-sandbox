# Review style guide

This repository is `friday-sandbox`, a pnpm + Turborepo monorepo shipping the `@friday-sandbox/*` packages: a React 19 UI library (`react`), CSS tokens and layers (`styles`), ESLint flat-config presets (`eslint-config`), and TypeScript config presets (`typescript-config`). The packages are consumed as workspace dependencies internally and will publish to npm.

Review every pull request against the rules below. They are hard project rules, not preferences; flag any deviation. Be terse. One sentence per finding: the problem, the location, the fix. Skip praise, skip restating the diff. Group by severity, highest first.

## Review priorities

Rank findings from highest to lowest:

1. Security and secret leakage.
2. Accessibility regressions in `@friday-sandbox/react`.
3. Correctness: runtime errors, type holes, missing changeset on a behavior change.
4. API ergonomics: exports map drift, prop naming, controlled-vs-uncontrolled patterns.
5. Architecture and DRY: duplicated logic, missing shared hook, preset drift.
6. Style and idiom: only after the above.

## Skip the release PR

The `chore(release): version packages` PR is produced by `changesets/action`. It contains only generated diffs (`.changeset/*` removed, `packages/*/CHANGELOG.md` added, `packages/*/package.json` version bumps). Do not review or comment on this PR; the diff is mechanical and not human-authored.

## Components and hooks (`packages/react/src/**`)

- Filenames are lowercase (`button.tsx`, `use-controlled-state.ts`) to satisfy `unicorn/filename-case`. PascalCase filenames are a `unicorn` rule violation.
- A client component starts with `"use client"` only when a client API is touched (`useState`, `useEffect`, refs, event handlers). Flag a missing directive on a client component, and flag a needless directive on a pure server component.
- Each component is a named export with its `Props` type colocated and exported alongside. No default exports.
- The package `exports` map is `./*` → `./src/*.tsx`, so consumers import from `@friday-sandbox/react/<name>`. A new component file outside that map is unreachable.
- The accessibility foundation is `react-aria-components`. Prefer composing those primitives over re-implementing focus, selection, or keyboard handling. Flag hand-rolled keyboard logic when an aria primitive already exists.
- Shared logic (focus management, ARIA wiring, controlled-vs-uncontrolled, event coalescing) belongs in a reusable hook under `packages/react/src/`. Flag re-implementations across components.

## Accessibility (`packages/react`)

- Keyboard reachable, focus visible, ARIA only where DOM does not convey intent.
- No pointer-only interactions: every click target also responds to keyboard.
- Motion respects `prefers-reduced-motion`.
- A `Storybook` story for the component must pass `addon-a11y`; flag known violations.

## Stories and tests (`packages/react/src/**/*.stories.{ts,tsx}`, `**/*.test.{ts,tsx}`)

- A new or changed visible behavior ships story coverage of the main visual and interactive states: default, hover, focus, disabled, loading, error.
- Tests run in Vitest browser mode via `@storybook/addon-vitest` with Playwright chromium. Prefer Storybook play functions over imperative DOM assertions. Cover keyboard paths alongside pointer paths.
- Stories must use real props, not mocked data, so addon-a11y catches the real component.
- **Storybook copy is for consumers, not contributors.** The deployed Storybook is the consumer-facing reference. Component descriptions, prop `description`s, and per-story `parameters.docs.description.story` text must read as instructions to someone using the component in their own app. Flag any of: internal class names (`fri-button-<variant>`, `fri-flex-*`), library names (`tailwind-variants`, `react-aria`, `react-aria-components`), engine math (`calc(var(--size-action) * N)`), file paths, "Maps to … class", "Forwarded to …", "Proof that …", or QA notes ("Rendered in mobile viewport to verify …"). Engine details, file layout, and verification rationale belong in `docs/ARCHITECTURE.md` and `CONTRIBUTING.md`.
- Symmetry across `.stories.tsx` files: same component-description shape (one-line summary → `## Import` → import snippet → "Add the stylesheet once at the top of your app:" → CSS snippet), same `gap` / `gapX` / `gapY` / `className` prop wording across layout primitives, same tone (second-person, "Pick …", "Use …"). Flag asymmetry — one story drifting from the others.

## Styles (`packages/styles/src/**`, Tailwind v4)

- Tailwind v4 utility classes plus the `@friday-sandbox/styles` layer system are the styling path. Flag inline `style` objects, hardcoded hex colors, or class strings that bypass tokens.
- Canonical Tailwind only. Every CSS var registered in `@theme inline` (`packages/styles/src/system/theme.css`) has a real utility alias. Flag the v3-era arbitrary-var form on a mapped token — `bg-(--muted)`, `text-(--foreground)`, `border-(--primary)`, `rounded-(--radius-action)` — and ask for the canonical alias (`bg-muted`, `text-foreground`, `border-primary`, `rounded-action`). The `*-(--var)` form is correct only for component-local vars that have no Tailwind alias (e.g. `bg-(--button-background)`).
- For shared layout, prefer the `layouts` primitives (`Flex`, `Grid`, `GridItem`, `ScrollArea`) over raw `<div className="flex …">` / `<div className="grid …">`. Flag layout divs that re-implement what a primitive already provides.
- A token rename requires a migration note in the changeset, not a silent rename.
- Global selectors that bypass layers are not allowed.

## Configs (`packages/eslint-config`, `packages/typescript-config`)

- `@friday-sandbox/eslint-config` keeps three subpath exports (`./base`, `./next-js`, `./react-internal`) working in consumer workspaces. A rule added to one preset that belongs in another is a deviation. A plugin import without a matching peer dep is a deviation.
- `@friday-sandbox/typescript-config` keeps `base.json`, `nextjs.json`, and `react-library.json` agreeing on `lib`, `moduleResolution`, `jsx`, `target`, `strict`, and `verbatimModuleSyntax`, unless a framework difference justifies otherwise.

## Workflows (`.github/workflows/**`)

- Third-party actions are pinned to a commit SHA, not a tag.
- Each job sets a tight `timeout-minutes` and a minimal `permissions` block.
- Top-level `permissions: contents: read`. Job-level grants only the scopes that step needs.
- Every job runs `step-security/harden-runner` first.

## Shell scripts (`.github/scripts/**`)

- Start with `set -euo pipefail`.
- Quote every variable expansion (`"$VAR"`, not `$VAR`).
- Read inputs from explicit env vars set at the step level, not positional args.

## Changesets (`.changeset/!(README).md`)

- Behavior-changing PR types (`feat`, `fix`, `perf`, `refactor`) require one `.changeset/*.md` entry. CI blocks the PR without it.
- The bump level (patch, minor, major) matches the change. `feat` is at least minor; a breaking change is major.
- The summary reads as a release note to a downstream consumer, not as an internal log.

## Commits, branches, and pull requests

- Conventional commits, strict: `type(scope): subject`, type from the enum (`build|chore|ci|docs|feat|fix|perf|refactor|revert|setup|style|test`), scope required, all lowercase, subject 50 characters or fewer, no body, no footer.
- The PR title carries no `#N`; issue closures go in the PR body as `Closes #N`, one per line.
- Branches are created from an issue (`gh issue develop <n>`), so head_ref starts with `<n>-`. CI blocks otherwise.
- `--no-verify` is forbidden. CI re-runs commitlint on every commit in the PR and re-runs every local gate; a bypass shows up there.

## Code quality (project-specific only)

- DRY across components, not just within a component. Flag re-implementations.
- No prose comments in source. Intent lives in names, commits, and `docs/`. Flag explanatory comments unless they encode a non-obvious invariant.
- `--max-warnings 0` is enforced. A warning-level lint is a CI failure.
