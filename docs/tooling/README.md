# Tooling

How `friday-sandbox` is structured, built, gated, and shipped, plus the code style that applies across every package. A tool-agnostic reference for any contributor or agent.

## Workspaces

Turborepo and pnpm workspaces map `pnpm-workspace.yaml` to `packages/*`. The four `@friday-sandbox/*` packages are `react`, `styles`, `eslint-config`, and `typescript-config`, listed in [the table of contents](../README.md#table-of-contents). Every workspace keeps its sources under `src/` and exposes its public surface through `package.json#exports`; the folder shape is symmetric across all four.

Package manager is **pnpm 10**, pinned via `packageManager` in the root `package.json` and honored by corepack. Node `>=22.10.0`. The `engines.pnpm` field of `>=9.0.0` is the floor, the supported minimum, while `packageManager` is the exact version everyone runs.

## Where each layer lives

The design system is layered from plain tokens up to React components. Each layer has one home:

| Layer                             | File                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| Token source (plain values)       | `packages/styles/src/theme/default.css`                                               |
| Tailwind alias map                | `packages/styles/src/system/theme.css`, `@theme inline`                               |
| Scope rhythm utility              | `packages/styles/src/system/utilities.css`                                            |
| Component CSS (engine + variants) | `packages/styles/src/components/bases/<name>.css` or `.../layouts/<name>.css`         |
| Component (React)                 | `packages/react/src/components/<tier>/<name>/<name>.tsx`                              |
| Consumer reference                | the deployed Storybook: each `*.stories.tsx` autodocs page, plus the global MDX pages |

The styles CSS still splits `bases/` from `layouts/`: `button.css` lives under `bases/`, while `flex.css`, `grid.css`, and `scroll-area.css` live under `layouts/`. The React side groups all four under `bases/`. The consumer reference is the deployed Storybook. Per-component docs come from each component's `*.stories.tsx` autodocs. The global pages for introduction, theming, and tokens come from `packages/react/src/stories/*.mdx`.

## Commands

This is the canonical command reference. Every root script is defined in the root [`package.json`](../../package.json) and fans out across workspaces via Turborepo:

```sh
pnpm install
pnpm dev                # turbo run dev: Storybook for @friday-sandbox/react, persistent, not cached
pnpm dev:storybook      # turbo run dev:storybook: storybook dev -p 6006
pnpm build              # turbo run build: tsdown for @friday-sandbox/react, tailwindcss for @friday-sandbox/styles
pnpm build:storybook    # turbo run build:storybook: storybook build to packages/react/storybook-static
pnpm build:watch        # turbo run build:watch: rebuild on change, persistent, not cached
pnpm lint               # turbo run lint: eslint --max-warnings 0
pnpm typecheck          # turbo run check-types: tsc --noEmit
pnpm test               # turbo run test: vitest browser mode, Storybook addon-vitest, Playwright
pnpm test:coverage      # turbo run test:coverage: vitest run --coverage
pnpm knip               # unused files, deps, and exports
pnpm depcruise          # depcruise packages: enforces the no-circular rule
pnpm format             # prettier --write across ts, tsx, md, css
pnpm format:check       # prettier --check, the CI-safe variant
pnpm sort               # sort-package-json across every workspace
pnpm sort:check         # sort-package-json --check, the CI-safe variant
pnpm doc:check          # turbo run doc:check: storybook build --quiet
pnpm doctor             # react-doctor across each workspace
pnpm audit              # pnpm audit --audit-level high
pnpm clean              # turbo run clean: remove each workspace dist
pnpm changeset          # author a changeset for behavior changes
pnpm changeset:version  # apply pending changesets and bump versions
pnpm changeset:publish  # publish bumped packages to npm
```

Scope to one workspace with a Turbo filter, or run a single Vitest file:

```sh
pnpm exec turbo lint --filter=@friday-sandbox/react
pnpm --filter @friday-sandbox/react exec vitest run src/components/bases/button/button.test.tsx
```

## Turbo task graph

From `turbo.json`, each task waits on its upstream dependencies in topological order:

- `build`, `build:storybook`, `doc:check`, `test`, and `test:coverage` depend on `^build`, so a workspace builds after its dependencies build.
- `check-types` depends on `^check-types`, and `lint` depends on `^lint`, so each waits on the same task in its dependencies, not on a build.
- `dev`, `dev:storybook`, and `build:watch` set `cache: false` and `persistent: true`. `clean` sets `cache: false`.

## Quality gates

The gates are the commands above, run by the pre-commit and pre-push hooks and again in CI. The workflow guide [`CONTRIBUTING.md`](../../CONTRIBUTING.md#quality-checks) covers when each runs and how a change ships. Let the hooks run them on what you touched rather than invoking the whole-repo tasks by hand. Two enforcers carry config worth knowing:

- **Dependency graph:** `.dependency-cruiser.cjs` enforces `no-circular` at `severity: error`. Break cycles; never suppress.
- **Knip:** runs from `knip.config.ts` on near-defaults. A `css` compiler walks the CSS-only `styles` workspace, and `eslint-import-resolver-typescript` is ignored on `eslint-config` because it is referenced by string in the flat config. Entries auto-detect from each `package.json`.

## `src` ↔ `dist` publishing

Workspace consumers import sources directly; published consumers read `dist/`. Both packages run `clean-package` on `prepack` and `postpack` to strip dev fields and repoint `exports` at the built files, but each builds differently:

- **`react`:** `exports` points to `./src/*/index.ts`. `pnpm build` runs `tsdown` to emit `dist/`, and `clean-package` repoints `main`, `module`, `types`, and `exports` to `./dist/index.mjs` and `./dist/index.d.mts`.
- **`styles`:** `exports` points to `./index.css` under the `style` and `default` conditions. `pnpm build` runs `tailwindcss --input index.css --output dist/index.css --minify`, and `clean-package` repoints `exports` to `./dist/index.css` under the same conditions.

Change one surface, keep the other aligned.

## Storybook deploy

Storybook deploys to Vercel from the root `vercel.json`, built from `packages/react`. `turbo-ignore @friday-sandbox/react` skips the deploy when the library and its workspace deps are unchanged.

## Troubleshooting

First-run snags, in the order they tend to bite:

- **`pnpm` not found or wrong version.** Corepack must be enabled so it picks up the pinned `packageManager`. Run `corepack enable`, then `pnpm install`.
- **Tests fail before the first assertion.** The Vitest browser provider is Playwright, and its browsers are not installed by `pnpm install`. Run `pnpm exec playwright install` once, then `pnpm test`.
- **A task reports stale or wrong output.** Turbo replayed a cached result. Re-run with `pnpm exec turbo <task> --force` to bypass the cache, or `pnpm clean` to drop build outputs.

## Rules in this chapter

House-style gates that apply to any file, whatever package. CI and the PR reviewers hold you to them:

- [`meaningful-identifiers.md`](rules/meaningful-identifiers.md): every identifier names what it represents, and no prose comments.
- [`lean-config.md`](rules/lean-config.md): never write a config key whose value equals the tool's documented default.
- [`lean-prose.md`](rules/lean-prose.md): documentation prose is direct and token-lean; no em-dash, no parenthetical aside.

---

**Handbook:** [Hub](../README.md) · [Styles](../styles/README.md) · [React](../react/README.md) · [Tooling](README.md) · [Contributing](../../CONTRIBUTING.md)
