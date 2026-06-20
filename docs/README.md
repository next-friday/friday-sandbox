# Documentation

This is the documentation hub for `friday-sandbox` — the central place every reader (a human contributor, an LLM, or a tool) comes to understand and develop this repository, which ships the `@friday-sandbox/*` packages: a React 19 UI library and the CSS, ESLint, and TypeScript foundations it stands on. This page is the map: read it, then follow the link to the document that owns the detail. It never repeats that detail; it routes you to it.

## Who reads what

Everything canonical lives here, under `docs/`. AI assistants and PR-review bots keep their own configuration files, but those read from these same docs and never hold anything you cannot find here — as a human you never need to open them.

| Audience                     | Start here                                                                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contributors (and any human) | this hub → [`architecture.md`](architecture.md), [`formulas.md`](formulas.md), [`conventions/`](conventions/), [`../CONTRIBUTING.md`](../CONTRIBUTING.md) |
| npm consumers                | the package READMEs ([`react`](../packages/react/README.md), [`styles`](../packages/styles/README.md)) and the deployed Storybook                         |

## First run

```sh
corepack enable      # honors the pinned pnpm version
pnpm install
pnpm dev             # Storybook for @friday-sandbox/react on http://localhost:6006
```

Node `>=22.10.0`, pnpm 10 (pinned via `packageManager` in the root `package.json`). Everything else fans out across workspaces through Turborepo — every script is defined in the root [`package.json`](../package.json).

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

Internalize that one idea and the rest of the codebase reads cleanly. The full engine is in [`architecture.md`](architecture.md); every formula in one lookup table is in [`formulas.md`](formulas.md).

## Where do I go for X

| I want to…                            | Start at                                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Add or change a component             | [`component-structure.md`](conventions/component-structure.md); mirror the `button` folder            |
| Understand the CSS engine             | [`architecture.md`](architecture.md)                                                                  |
| Look up a derivation formula          | [`formulas.md`](formulas.md)                                                                          |
| Change or add a design token          | `packages/styles/src/theme/default.css` (plain values only) + [`architecture.md`](architecture.md) §1 |
| Add an ESLint or tsconfig preset      | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Adding a preset_                                        |
| Ship a change (issue → branch → PR)   | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Workflow_                                               |
| Run or scope the quality gates        | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Quality gates_                                          |
| Understand the build, commands, or CI | [`build.md`](build.md)                                                                                |

## Conventions that are gates, not suggestions

The conventions live in [`conventions/`](conventions/) — one file per rule, **canonical and tool-agnostic**, enforced by CI and the PR reviewers. Read them whatever editor you use; no AI tool required. They are enforced, not advisory:

- [`component-structure.md`](conventions/component-structure.md) — the symmetric component folder skeleton, lowercase filenames, named export, `*.variants.ts`, exports-map reachability.
- [`compose-and-dry.md`](conventions/compose-and-dry.md) — compose `react-aria-components` and the `layouts` primitives; extract shared logic into a hook.
- [`accessibility-and-stories.md`](conventions/accessibility-and-stories.md) — keyboard/focus/ARIA, `addon-a11y`, required story states, consumer-facing story copy.
- [`semantic-token-scope.md`](conventions/semantic-token-scope.md) — size/radius tokens scoped to `action`/`field`/`box`, never a literal component name.
- [`canonical-tailwind.md`](conventions/canonical-tailwind.md) — mapped theme tokens use their Tailwind alias (`bg-muted`), not the `bg-(--var)` fallback.
- [`no-ghosts.md`](conventions/no-ghosts.md) — every named variant/size/state is a real, addressable class. No defaults hidden in a base rule.
- [`meaningful-identifiers.md`](conventions/meaningful-identifiers.md) — every identifier names what it represents; no prose comments.
- [`no-default-noise.md`](conventions/no-default-noise.md) — never write a config key whose value equals the tool's default.

Two cross-cutting principles the reviewers and CI also expect, beyond the convention files: **DRY and symmetric** (one skeleton per file kind, shared logic extracted once), and **self-contained artifacts** — issues, PRs, and docs never cite another design system or repository as precedent; apply the convention silently and state the requirement directly.
