# Contributing

Thanks for your interest in improving `friday-sandbox`. The repository ships the `@friday-sandbox/*` packages: a React 19 UI library (`react`), CSS tokens and layers (`styles`), ESLint flat-config presets (`eslint-config`), and TypeScript config presets (`typescript-config`).

Before changing tokens or component CSS, read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the design system follows a strict **Dumb Tokens, Smart Components** model and conventions there are enforced. [`docs/formulas.md`](docs/formulas.md) is the quick reference for every engine derivation.

## Development setup

```sh
pnpm install
pnpm dev          # Storybook + per-package dev tasks
pnpm build        # turbo run build across workspaces
```

Node `>=22.10.0` and pnpm `>=9.0.0` are required (`engines` is enforced).

## Workflow

Every change ships through one issue and one pull request.

1. Open an issue, or pick an existing one, then create a branch from it: `gh issue develop <n> --checkout`. CI rejects branches whose head ref does not start with `<n>-`.
2. Make the change, following the conventions in [`.claude/rules/`](.claude/rules/) and the review style guides in [`.coderabbit.yaml`](.coderabbit.yaml) and [`.gemini/styleguide.md`](.gemini/styleguide.md).
3. Add a changeset for any behavior change (`feat`, `fix`, `perf`, `refactor`): `pnpm changeset`. CI blocks behavior changes without one.
4. Run the gates locally. The `pre-commit` and `pre-push` hooks run them automatically; `--no-verify` is forbidden and is re-caught by CI.
5. Open a pull request whose body closes the issue with `Closes #<n>` (one per line). The PR title carries no `#N`.

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
pnpm test            # vitest browser mode + Storybook addon-vitest
pnpm audit --audit-level high
```

## Adding a component (`@friday-sandbox/react`)

A new component is wired in two places:

1. `packages/react/src/<name>.tsx` — the component, lowercase filename, named export, `Props` type colocated.
2. A Storybook story under `packages/react/src/stories/` that covers the main visual and interactive states (default, hover, focus, disabled, loading, error).

Conventions:

- Start with `"use client"` only when a client API is touched.
- Compose `react-aria-components` for focus, selection, and keyboard behavior; do not re-implement.
- Styles ride Tailwind v4 utilities plus the `@friday-sandbox/styles` token and layer system. No inline `style` objects, no hardcoded hex colors, no class strings that bypass tokens.
- **Canonical Tailwind only.** Theme tokens registered in `@theme inline` (`packages/styles/src/system/theme.css`) have real Tailwind aliases — use them. Write `bg-muted`, `text-foreground`, `border-primary`, `rounded-action` — never the arbitrary-var form `bg-(--muted)`, `text-(--foreground)`, `border-(--primary)`, `rounded-(--radius-action)`. The `*-(--var)` form is the v3-era escape hatch and is reserved for component-local vars (e.g. `bg-(--button-background)`) that have no Tailwind alias. See [`.claude/rules/canonical-tailwind.md`](.claude/rules/canonical-tailwind.md).
- For shared layout (rows, columns, grids, scrollable regions), compose the `layouts` primitives — `Flex`, `Grid`, `GridItem`, `ScrollArea` — instead of writing raw `<div className="flex …">`. Stories included.
- Scaffold the file shape with `pnpm --filter @friday-sandbox/react generate:component`.

Consumers import via the package exports map (`./*` → `./src/*.tsx`):

```ts
import { Button } from "@friday-sandbox/react";
```

## Adding a preset (`@friday-sandbox/eslint-config`, `typescript-config`)

The presets are subpath-exported. A change must keep every export working in consumer workspaces:

- `eslint-config`: `./base`, `./next-js`, `./react-internal`.
- `typescript-config`: `base.json`, `nextjs.json`, `react-library.json`.

Drift between the presets (different `lib`, `moduleResolution`, `jsx`, `target`, `strict`, or `verbatimModuleSyntax`) requires a framework-specific justification.

## Commit and title convention

Commits and pull request titles follow `type(scope): subject`:

- Type is one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `setup`, `style`, `test`.
- Scope is required and lowercase.
- Subject is lowercase and at most 50 characters.
- No body, no footer in commit messages; PR body is where descriptions live.

Issue references go in the pull request body as `Closes #<n>`, never the title.

## Security

Do not open a public issue for security vulnerabilities. Follow [`.github/SECURITY.md`](.github/SECURITY.md) and use GitHub's private vulnerability reporting.
