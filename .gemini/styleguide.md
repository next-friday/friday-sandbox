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

## Components: `packages/react/src/components/bases/**`

Architecture and the `fri-<name>` react↔styles contract live in `ARCHITECTURE.md`. A base component is generated (`pnpm gen component`), never hand-created. Flag in a base component's diff:

- Lowercase filename such as `button.tsx`, not `Button.tsx`; a named export with the `Props` type colocated; no default export.
- `"use client"` only when a client API such as `useState`, `useEffect`, refs, or event handlers — or a `react-aria-components` / `radix` client primitive — is touched; flag a needless directive on a pure layout or text component.
- Wrap the right primitive for the job: `react-aria-components` for interactive and accessibility (button), a `radix` part for a compound component (scroll-area), or native HTML for layout and text (flex, text). Flag hand-rolled keyboard or focus where a primitive exists.
- Props widen from the primitive (`ComponentPropsWithRef<typeof X>`); a render-prop primitive composes `className` through `composeTailwindRenderProps`; keep `data-slot="<name>"`.
- Variants map props to the `fri-<name>` class via `tailwind-variants/lite` `tv()`: every value is a distinct `fri-<name>-<value>` class, reusing the repo vocabulary (color `primary…danger`, `variant` `solid…plain`, `size` `xs…xl`), with `defaultVariants` set and no hardcoded color — wire the `--fri-<role>` token ladder.
- A new file is reachable through the package `exports` map's one public entry, `.` → `./src/index.ts`, via the barrel chain; a file no `index.ts` re-exports is unreachable. A compound component wires every part through all four barrels.

## Accessibility and stories: `packages/react/src/**/*.stories.{ts,tsx}`

Key checks for accessibility and stories:

- Keyboard reachable, focus visible, ARIA only where the DOM does not convey intent, motion respects `prefers-reduced-motion`; the story passes `addon-a11y`.
- Cover every variant value — a showcase story per axis (`Variants`, `Colors`, `Sizes`, laid out with `Flex`) and per state — using real props rather than mocked data.
- Stories are the test suite (the testing setup is in `CLAUDE.md`). A `play` function asserts behavior only where it fits: an interactive base gets `Default` (interaction — `userEvent.tab()` → `toHaveFocus`); a display or layout base (`text`, `flex`, `grid`, `separator`, `spinner`) skips the `userEvent` interaction plays, so never ask one for an interaction play, though a presence or `getComputedStyle` assertion on `Default` still fits.
- No separate `*.test.*` files exist or belong here; a behavior is verified by its story. Flag a new test file and ask for a `*.stories.tsx` play function instead.
- Story copy is consumer-facing: flag internal class names such as `fri-button-*` and `fri-flex-*`, library names such as `tailwind-variants` and `react-aria`, engine math such as `calc(var(--fri-spacing-xs) * var(--_button-n))`, or file paths. Symmetric story shape across files.
- Story copy stays generic, not brittle: flag concrete pixel sizes or an exhaustive enumeration of a prop's values; prefer the imperative `Use the \`X\` prop to …` form and let the stories demonstrate the values.

## Styles: `packages/styles/src/**`, Tailwind CSS v4

Key checks for styles:

- A component's rules live in `components/bases/<name>.css` under `@layer components`, keyed to the `fri-<name>` class, and must mirror `<name>.variants.ts` 1:1 — every `fri-<name>-<value>` class has a rule and vice versa (the `lint:symmetry` gate enforces it); flag an orphan class on either side.
- Respect the `@layer` system; flag inline `style` objects, hardcoded hex colors, and class strings that bypass tokens. Wire colors through the `--fri-<role>` ladder and geometry through a component-local ramp multiplier (`--_<name>-n`), with the `md` default baked at zero specificity via `:where(.fri-<name>)`.
- Canonical Tailwind alias for any var mapped in `@theme inline`, such as `bg-primary` and not `bg-(--fri-primary)`; the `*-(--var)` form is only for component-local vars with no alias.
- Size and radius tokens scoped to `action`, `field`, or `box`, never a literal component name. The `src/theme/` CSS carrying a `GENERATED` header is codegen output — flag hand-edits; change `tokens/default.spec.json` or `scripts/formulas.ts` and rerun codegen.
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

The changeset rules are in `CONTRIBUTING.md` — flag a behavior-changing PR (`feat`, `fix`, `perf`, `refactor`) with no entry or a bump level that does not match the change. The summary must read as a release note to a downstream consumer.

## Commits, branches, and pull requests

The commit, branch, and PR rules are defined in `CONTRIBUTING.md` — flag any violation: a commit not matching `type(scope): subject` (type off the enum, missing scope, not lowercase, subject over 50 characters, or a body/footer present), a `#N` in the PR title instead of `Closes #N` in the body, a branch that does not start with `<n>-`, or a `--no-verify` bypass.

## Documentation prose

- Prose follows the editorial style guide in `STYLE.md`. Flag a banned marketing adjective, an off-vocabulary synonym, and a component doc missing a required section.
- Also flag a switch of narrator or voice within one document, and maintainer-internal detail in a consumer page. Name the `STYLE.md` section.

## Code quality

- DRY across components, not just within one: flag re-implementations.
- No prose comments in source; intent lives in names and commits. Flag explanatory comments unless they encode a non-obvious invariant.
- `--max-warnings 0` is enforced; a warning-level lint is a CI failure.
