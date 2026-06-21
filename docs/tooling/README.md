# Tooling

How `friday-sandbox` is structured, built, gated, and shipped, plus the code style that applies across every package. A tool-agnostic reference for any contributor or agent.

## Workspaces

Turborepo and pnpm workspaces map `pnpm-workspace.yaml` to `packages/*`. The four `@friday-sandbox/*` packages are `react`, `styles`, `eslint-config`, and `typescript-config`, listed in [the table of contents](../README.md#table-of-contents). Every workspace keeps its sources under `src/` and exposes its public surface through `package.json#exports`; the folder shape is symmetric across all four.

Package manager is **pnpm 10**; corepack honors `packageManager` in the root `package.json`. Node `>=22.10.0`.

## Where each layer lives

The design system is layered from plain tokens up to React components. Each layer has one home:

| Layer                             | File                                                     |
| --------------------------------- | -------------------------------------------------------- |
| Token source (plain values)       | `packages/styles/src/theme/default.css`                  |
| Tailwind alias map                | `packages/styles/src/system/theme.css`, `@theme inline`  |
| Scope rhythm utility              | `packages/styles/src/system/utilities.css`               |
| Component CSS (engine + variants) | `packages/styles/src/components/<tier>/<name>.css`       |
| Component (React)                 | `packages/react/src/components/<tier>/<name>/<name>.tsx` |
| Consumer reference                | `packages/react/src/stories/*.mdx` (deployed Storybook)  |

## Commands

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

Every script is defined in the root [`package.json`](../../package.json).

## Turbo task graph

From `turbo.json`: `build`, `lint`, `check-types`, `doc:check`, `test`, `build:storybook` fan out via `^` (dependency order); `doc:check` and `test*` also depend on `^build`. `dev`, `dev:storybook`, and `build:watch` are `cache: false` and `persistent: true`.

## Quality gates

Every gate must pass before a pull request can merge. The full list and how to run it locally lives in the workflow guide [`CONTRIBUTING.md`](../../CONTRIBUTING.md#quality-gates). Let the hooks run them on what you touched rather than invoking the whole-repo tasks by hand. Two enforcers worth calling out:

- **Dependency graph:** `.dependency-cruiser.cjs` enforces `no-circular` at `severity: error`. Break cycles; never suppress.
- **Knip:** runs from `knip.config.ts` on near-defaults. A `css` compiler walks the CSS-only `styles` workspace, and `eslint-import-resolver-typescript` is ignored on `eslint-config` because it is referenced by string in the flat config. Entries auto-detect from each `package.json`.

## `src` ↔ `dist` publishing

Workspace consumers import sources directly, with `exports` pointing to `./src/*/index.ts`. Published consumers read `dist/`: `pnpm build` runs `tsdown` to emit it, then `clean-package` runs on `prepack` and `postpack` to strip dev fields and repoint `main`, `module`, and `types`. Change one surface, keep the other aligned.

## Storybook deploy

Storybook deploys to Vercel from the root `vercel.json`, built from `packages/react`. `turbo-ignore @friday-sandbox/react` skips the deploy when the library and its workspace deps are unchanged.

## Rules in this chapter

House-style gates that apply to any file, whatever package. CI and the PR reviewers hold you to them:

- [`meaningful-identifiers.md`](rules/meaningful-identifiers.md): every identifier names what it represents; no prose comments.
- [`lean-config.md`](rules/lean-config.md): never write a config key whose value equals the tool's documented default.
- [`lean-prose.md`](rules/lean-prose.md): documentation prose is direct and token-lean; no em-dash, no parenthetical aside.
