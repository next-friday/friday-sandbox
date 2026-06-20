# Onboarding

Start here. This repository ships the `@friday-sandbox/*` packages — a React 19 UI library and the CSS, ESLint, and TypeScript foundations it stands on. This page is the map for a new contributor or an AI agent: read it, then follow the link to the document that owns the detail. It does not repeat that detail; it routes you to it.

## First run

```sh
corepack enable      # honors the pinned pnpm version
pnpm install
pnpm dev             # Storybook for @friday-sandbox/react on http://localhost:6006
```

Node `>=22.10.0`, pnpm 10 (pinned via `packageManager` in the root `package.json`). Everything else fans out across workspaces through Turborepo — see the command list in [`../CLAUDE.md`](../CLAUDE.md).

Run one test file while iterating:

```sh
pnpm --filter @friday-sandbox/react exec vitest run src/components/bases/button/button.test.tsx
```

## What's in here

Four workspaces under `packages/*`, all `@friday-sandbox/*`, all keeping their sources under `src/` and exposing a public surface through `package.json#exports`. The folder shape is symmetric across every package.

| Package             | Role                                                         | Public surface                                         |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| `react`             | React 19 components on `react-aria-components` + Tailwind v4 | `exports` → `./src/*/index.ts`                         |
| `styles`            | CSS tokens + Tailwind v4 layers (the design-token source)    | `exports` → `./index.css`                              |
| `eslint-config`     | Three flat-config presets                                    | `./base`, `./next-js`, `./react-internal`              |
| `typescript-config` | Three tsconfig presets                                       | `./base.json`, `./nextjs.json`, `./react-library.json` |

## The one mental model

The design system is **Dumb Tokens, Smart Components**. `packages/styles/src/theme/default.css` holds plain values only — OKLCH literals, `rem` sizes, keywords. Every derivation (readable foreground, hover shade, height/padding/radius rhythm) lives in the consuming component's own CSS, not in a central engine. Tokens are scoped to a **semantic family** — `action`, `field`, `box` — never to a literal component name.

Internalize that one idea and the rest of the codebase reads cleanly. The full engine is in [`ARCHITECTURE.md`](ARCHITECTURE.md); every formula in one lookup table is in [`formulas.md`](formulas.md).

## Where do I go for X

| I want to…                          | Start at                                                                                              |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Add or change a component           | [`component-structure.md`](../.claude/rules/component-structure.md); mirror the `button` folder       |
| Understand the CSS engine           | [`ARCHITECTURE.md`](ARCHITECTURE.md)                                                                  |
| Look up a derivation formula        | [`formulas.md`](formulas.md)                                                                          |
| Change or add a design token        | `packages/styles/src/theme/default.css` (plain values only) + [`ARCHITECTURE.md`](ARCHITECTURE.md) §1 |
| Add an ESLint or tsconfig preset    | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Adding a preset_                                        |
| Ship a change (issue → branch → PR) | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Workflow_                                               |
| Run or scope the quality gates      | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Quality gates_                                          |

## Conventions that are gates, not suggestions

The path-scoped rules in [`../.claude/rules/`](../.claude/rules/) load automatically when a matching file enters context. They are enforced, not advisory:

- [`component-structure.md`](../.claude/rules/component-structure.md) — the symmetric component folder skeleton, lowercase filenames, named export, `*.variants.ts`, exports-map reachability.
- [`compose-and-dry.md`](../.claude/rules/compose-and-dry.md) — compose `react-aria-components` and the `layouts` primitives; extract shared logic into a hook.
- [`accessibility-and-stories.md`](../.claude/rules/accessibility-and-stories.md) — keyboard/focus/ARIA, `addon-a11y`, required story states, consumer-facing story copy.
- [`semantic-token-scope.md`](../.claude/rules/semantic-token-scope.md) — size/radius tokens scoped to `action`/`field`/`box`, never a literal component name.
- [`canonical-tailwind.md`](../.claude/rules/canonical-tailwind.md) — mapped theme tokens use their Tailwind alias (`bg-muted`), not the `bg-(--var)` fallback.
- [`no-ghosts.md`](../.claude/rules/no-ghosts.md) — every named variant/size/state is a real, addressable class. No defaults hidden in a base rule.
- [`meaningful-identifiers.md`](../.claude/rules/meaningful-identifiers.md) — every identifier names what it represents; no prose comments.
- [`no-default-noise.md`](../.claude/rules/no-default-noise.md) — never write a config key whose value equals the tool's default.

Two cross-cutting principles the reviewers and CI also expect, beyond the rule files: **DRY and symmetric** (one skeleton per file kind, shared logic extracted once), and **self-contained artifacts** — issues, PRs, and docs never cite another design system or repository as precedent; apply the convention silently and state the requirement directly.

## For AI agents specifically

- Read [`../CLAUDE.md`](../CLAUDE.md) top to bottom first. It is the operating manual: orientation, the command catalog, the single-source-of-truth map, the rule gates, and the operating rules.
- Let the hooks do the formatting. `PostToolUse` runs `prettier --write` and `eslint --fix` on the file you just edited; `pre-commit` and `pre-push` run the gates. Do **not** run whole-repo `lint`/`typecheck`/`build`/`test` by hand — CI and the hooks own that, and each manual run burns minutes.
- Sources live under `src/`; the public surface is the `package.json#exports` map. Change one, keep the other in sync — a published consumer reads `dist/`, a workspace consumer reads `src/`.
- One change ships as one issue → one branch → one PR. Behavior changes (`feat`, `fix`, `perf`, `refactor`) need a changeset (`pnpm changeset`), and the branch name must start with the issue number.
