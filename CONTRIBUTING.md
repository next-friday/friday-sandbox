# Contributing

Thanks for taking the time to contribute. `friday-sandbox` is a pnpm + Turborepo monorepo that ships the `@friday-sandbox/*` packages, and every improvement is welcome: a bug fix, a new component, a sharper type, or a docs typo.

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug:** open an issue with steps to reproduce, the expected vs. actual behavior, and your environment.
- **Request a feature:** open an issue that describes the problem before the solution.
- **Submit a change:** fix a bug, add or refine a component, tighten types, or improve documentation.

Browsing the open issues is the easiest way to find something to work on. Comment on an issue to claim it before you start, so nobody duplicates your effort.

## Packages

| Package                             | What it is                        |
| ----------------------------------- | --------------------------------- |
| `@friday-sandbox/react`             | React 19 component library        |
| `@friday-sandbox/styles`            | CSS design tokens and layers      |
| `@friday-sandbox/eslint-config`     | Shared ESLint flat-config presets |
| `@friday-sandbox/typescript-config` | Shared TypeScript config presets  |

The toolchain is pnpm workspaces with Turborepo for the build graph, Storybook for component development, and Vitest in browser mode via Playwright for tests.

## Development setup

You need **Node `>=22.10.0`** and **pnpm 10**. The pnpm version is pinned in the root `package.json`; enable Corepack so it is used automatically.

```sh
corepack enable
pnpm install
pnpm dev          # Storybook for @friday-sandbox/react on http://localhost:6006
```

Common scripts, all run from the repository root:

```sh
pnpm dev          # start Storybook in watch mode
pnpm build        # build every package
pnpm lint         # ESLint (zero warnings allowed)
pnpm typecheck    # TypeScript, no emit
pnpm test         # run the test suites
pnpm changeset    # record a release note (see below)
```

## Workflow

Every change flows through one issue and one pull request.

1. **Start from an issue.** Open one or pick an existing one, then create its branch: `gh issue develop <n> --checkout`. The branch name must start with the issue number `<n>-…`, and CI rejects branches that don't.
2. **Make the change** on that branch. Keep it focused: one concern per pull request.
3. **Add a changeset** when you change published behavior, as described in [Changesets](#changesets).
4. **Run the checks**, described in [Quality checks](#quality-checks). Git hooks run them for you on commit and push.
5. **Open a pull request.** Reference the issue in the body with `Closes #<n>` so it closes when the PR merges.

## Adding a component

Scaffold a base component instead of hand-creating its files:

```sh
pnpm gen component   # prompts for the name, the primitive kind (native or aria), and the Storybook category
```

The generator (Turborepo `turbo gen`, defined in `turbo/generators/`) creates `<name>.tsx`, `<name>.variants.ts`, `index.ts`, and `<name>.stories.tsx` under `packages/react/src/components/bases/<name>/`, adds the `<name>.css` stub in `@friday-sandbox/styles` with its `@import`, creates the `<name>.mdx` docs page and its nav entry, wires the export barrels, and writes a changeset. Choose the `aria` primitive for an interactive component — it scaffolds the size, state, and story skeleton — or `native` for a minimal display element. Then fill in the variants, the `@apply` rules, the stories, and the docs. `pnpm lint:symmetry` verifies that `<name>.variants.ts` and `<name>.css` stay a 1:1 mirror. Don't hand-create or hand-wire these files.

## Commit and pull request titles

Commits and pull request titles follow [Conventional Commits](https://www.conventionalcommits.org): `type(scope): subject`.

- **type:** one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `setup`, `style`, `test`.
- **scope:** required and lowercase, naming the package or area you touched.
- **subject:** lowercase, imperative, **50 characters max**.
- Commit messages carry **no body and no footer**. The description belongs in the pull request.

Put issue references such as `Closes #<n>` in the pull request body, never the title. Merges are squashed, and the pull request number is appended to the title automatically.

```
feat(react): add tooltip component
fix(styles): correct focus-ring offset token
docs(readme): clarify install steps
```

## Changesets

Any change that affects published behavior, namely `feat`, `fix`, `perf`, or `refactor`, needs a changeset. It becomes the package changelog and drives the next version bump:

```sh
pnpm changeset
```

Pick the affected packages and a semver bump of patch, minor, or major, then write a short, user-facing summary. Commit the generated file alongside your change. CI blocks behavior changes that arrive without one. Pure chores such as CI config, formatting, and internal tooling don't need a changeset.

## Quality checks

A pull request must be green before it can merge. These run automatically through the pre-commit and pre-push hooks, and again in CI:

```sh
pnpm format:check   # Prettier
pnpm sort:check     # package.json key order
pnpm lint           # ESLint, zero warnings
pnpm lint:prose     # prose style (STYLE.md)
pnpm lint:symmetry  # variants <-> css mirror
pnpm knip           # unused files, deps, and exports
pnpm depcruise      # dependency rules
pnpm typecheck      # TypeScript
pnpm build          # build all packages
pnpm build:storybook # Storybook build
pnpm test           # test suites
pnpm audit --audit-level high
```

The full suite is slow. While iterating, let the hooks check what you touched instead of running everything by hand.

Don't disable a rule, skip a check, or bypass the hooks with `--no-verify` to force a green result; fix the underlying cause. CI re-runs every gate, so a skipped check only resurfaces later.

## Pull request guidelines

- Keep each pull request small and scoped to a single issue.
- Make sure every check passes and the branch is up to date with `main`.
- For visual changes, include a screenshot or screen recording of the before and after.
- Fill in the pull request template, describing what changed and why.
- A maintainer reviews and merges. Address review feedback by pushing follow-up commits to the same branch.

## Reporting a vulnerability

Don't open a public issue for security problems. Follow [`.github/SECURITY.md`](.github/SECURITY.md) and use GitHub's private vulnerability reporting instead.

## License

By contributing, you agree that your contributions are licensed under the [Apache License 2.0](LICENSE).
