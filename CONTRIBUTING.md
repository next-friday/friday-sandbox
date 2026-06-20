# Contributing

Thanks for your interest in improving `friday-sandbox`. The repository ships the `@friday-sandbox/*` packages: a React 19 UI library (`react`), CSS tokens and layers (`styles`), ESLint flat-config presets (`eslint-config`), and TypeScript config presets (`typescript-config`).

New here? [`docs/onboarding.md`](docs/onboarding.md) maps the repo and routes you to the right document. Before changing tokens or component CSS, read [`docs/architecture.md`](docs/architecture.md) — the design system follows a strict **Dumb Tokens, Smart Components** model — and keep [`docs/formulas.md`](docs/formulas.md) open as the derivation lookup. The conventions you must follow while writing code live in [`.claude/rules/`](.claude/rules/); this guide covers the workflow around the change, not the code style inside it.

## Development setup

```sh
pnpm install
pnpm dev          # Storybook for @friday-sandbox/react on http://localhost:6006
pnpm build        # turbo run build across workspaces
```

Node `>=22.10.0` and pnpm 10 are required (pnpm is pinned via `packageManager` in the root `package.json`; corepack honors it). The full command catalog is in [`CLAUDE.md`](CLAUDE.md).

## Workflow

Every change ships through one issue and one pull request.

1. Open an issue, or pick an existing one, then create a branch from it: `gh issue develop <n> --checkout`. CI rejects a branch whose head ref does not start with `<n>-`.
2. Make the change. The conventions are enforced as path-scoped gates in [`.claude/rules/`](.claude/rules/) and mirrored by the reviewers' style guides ([`.coderabbit.yaml`](.coderabbit.yaml), [`.gemini/styleguide.md`](.gemini/styleguide.md)).
3. Add a changeset for any behavior change (`feat`, `fix`, `perf`, `refactor`): `pnpm changeset`. CI blocks behavior changes without one.
4. Let the gates run. The `pre-commit` and `pre-push` hooks run them automatically; `--no-verify` is forbidden and is re-caught by CI. Never disable a rule, skip a check, or loosen a gate to get green — fix the root cause.
5. Open a pull request whose body closes the issue with `Closes #<n>` (one per line). The PR title carries no `#N` — the squash merge auto-appends `(#<PR>)`.

## Quality gates

All of these must pass before a pull request can merge:

```sh
pnpm format:check
pnpm sort:check
pnpm lint            # eslint --max-warnings 0
pnpm knip
pnpm depcruise
pnpm typecheck
pnpm build
pnpm doc:check       # storybook build
pnpm test            # vitest browser mode + Storybook addon-vitest + Playwright
pnpm audit --audit-level high
```

`pnpm test` is slow. While iterating, let the hooks run the gates on what you touched rather than invoking the whole-repo tasks by hand.

## Adding a component (`@friday-sandbox/react`)

A component is a symmetric folder under `packages/react/src/components/<tier>/<name>/` — mirror the `button` folder, which is the reference. The full skeleton, naming, export, and accessibility rules are the gates in [`.claude/rules/`](.claude/rules/): [`component-structure.md`](.claude/rules/component-structure.md), [`compose-and-dry.md`](.claude/rules/compose-and-dry.md), and [`accessibility-and-stories.md`](.claude/rules/accessibility-and-stories.md). In short:

- Pick the tier: `bases` (interactive primitives), `layouts` (compositional primitives), or `samples` (Storybook-only demos, not exported).
- Ship the four files — `index.ts`, `<name>.tsx`, `<name>.variants.ts`, `<name>.stories.tsx` — with a lowercase filename, a named export, and the `Props` type colocated.
- Compose `react-aria-components` for behavior and the `layouts` primitives for structure; style through `@friday-sandbox/styles` tokens via `tailwind-variants`.
- The story covers `Default`, `Hovered`, `Focused`, `Disabled`, and every color variant including `danger`, and its copy reads as consumer documentation.

Consumers import through the package `exports` map (`.` → `./src/index.ts`, `./*` → `./src/*/index.ts`):

```ts
import { Button } from "@friday-sandbox/react";
import { Button } from "@friday-sandbox/react/components/bases/button";
```

## Adding a preset (`@friday-sandbox/eslint-config`, `typescript-config`)

Both packages ship their presets from `src/` and expose them as subpaths. A change must keep every export resolving in consumer workspaces:

- `eslint-config`: `./base`, `./next-js`, `./react-internal`.
- `typescript-config`: `./base.json`, `./nextjs.json`, `./react-library.json`.

Drift between the presets (different `lib`, `moduleResolution`, `jsx`, `target`, `strict`, or `verbatimModuleSyntax`) requires a framework-specific justification.

## Commit and title convention

Commits and pull request titles follow `type(scope): subject`:

- Type is one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `setup`, `style`, `test`.
- Scope is required and lowercase.
- Subject is lowercase and at most 50 characters.
- No body and no footer in commit messages (`body-empty` / `footer-empty` are commitlint errors); the PR body is where descriptions live.

Issue references go in the pull request body as `Closes #<n>`, never the title.

## Security

Do not open a public issue for security vulnerabilities. Follow [`.github/SECURITY.md`](.github/SECURITY.md) and use GitHub's private vulnerability reporting.
