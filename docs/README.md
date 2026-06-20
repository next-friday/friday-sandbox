# Documentation

This is the documentation hub for `friday-sandbox` — the central place every reader (a human contributor, an LLM, or a tool) comes to understand and develop this repository, which ships the `@friday-sandbox/*` packages: a React 19 UI library and the CSS, ESLint, and TypeScript foundations it stands on. This page is the map: read it, then follow the link to the document that owns the detail. It never repeats that detail; it routes you to it.

## Who reads what

Everything canonical lives here, under `docs/`. This is the place to research the repository — whether you are a person, an LLM, or a tool, you read it directly here, and `docs/` never sends you to an editor- or assistant-specific file. AI assistants and PR-review bots do keep their own config files, but those only point back here; they hold nothing you cannot find in `docs/`.

| Audience                                         | Start here                                                                                                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anyone developing the repo (human, LLM, or tool) | this hub → [`architecture.md`](architecture.md), [`formulas.md`](formulas.md), [`conventions/`](conventions/), [`../CONTRIBUTING.md`](../CONTRIBUTING.md) |
| npm consumers                                    | the package READMEs ([`react`](../packages/react/README.md), [`styles`](../packages/styles/README.md)) and the deployed Storybook                         |

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

## Where do I go for X

| I want to…                                  | Start at                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Understand why the system is built this way | [`architecture.md`](architecture.md)                                                                   |
| Look up a derivation formula                | [`formulas.md`](formulas.md)                                                                           |
| Follow the code conventions                 | [`conventions/`](conventions/)                                                                         |
| Add or change a component                   | [`conventions/component-structure.md`](conventions/component-structure.md); mirror `button`            |
| Change or add a design token                | `packages/styles/src/theme/default.css` (plain values only) — see [`architecture.md`](architecture.md) |
| Understand the build, commands, or CI       | [`build.md`](build.md)                                                                                 |
| Add an ESLint or tsconfig preset            | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Adding a preset_                                         |
| Ship a change (issue → branch → PR)         | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Workflow_                                                |
| Run or scope the quality gates              | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) → _Quality gates_                                           |
