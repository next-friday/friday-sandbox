# Contributing

Thanks for taking the time to contribute. `friday-sandbox` is a pnpm + Turborepo monorepo that ships the `@friday-sandbox/*` packages, and every improvement is welcome: a bug fix, a new component, a sharper type, or a docs typo.

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug:** open an issue with steps to reproduce, the expected vs. actual behavior, and your environment.
- **Request a feature:** open an issue that describes the problem before the solution.
- **Submit a change:** fix a bug, add or refine a component, tighten types, or improve documentation.

Browsing the open issues is the easiest way to find something to work on. Comment on an issue to claim it before you start, so nobody duplicates your effort.

## Packages

| Package                             | Description                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `@friday-sandbox/react`             | Accessible React components built on react-aria-components and Tailwind CSS v4. |
| `@friday-sandbox/styles`            | Framework-agnostic design tokens and Tailwind CSS v4 layers.                    |
| `@friday-sandbox/eslint-config`     | Shared ESLint flat-config presets.                                              |
| `@friday-sandbox/typescript-config` | Shared TypeScript config presets.                                               |

The toolchain is pnpm workspaces with Turborepo for the build graph, Storybook for component development, and Vitest in browser mode via Playwright for tests.

## Development setup

You need **Node `>=22.10.0`** and **pnpm 10**. The pnpm version is pinned in the root `package.json`; enable Corepack so it is used automatically.

```sh
corepack enable   # use the repo-pinned pnpm
pnpm install      # install workspace dependencies
pnpm dev          # Storybook for @friday-sandbox/react on http://localhost:6006
```

Common scripts, all run from the repository root:

| Command          | Does                                              |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | start Storybook in watch mode                     |
| `pnpm build`     | build every package                               |
| `pnpm lint`      | ESLint (zero warnings allowed)                    |
| `pnpm typecheck` | TypeScript, no emit                               |
| `pnpm test`      | run the test suites                               |
| `pnpm changeset` | record a release note ([Changesets](#changesets)) |

## Workflow

Every change flows through one issue and one pull request.

1. **Start from an issue.** Open one or pick an existing one, then create its branch: `gh issue develop <n> --checkout`. The branch name must start with the issue number `<n>-…`, and CI rejects branches that don't.
2. **Make the change** on that branch. Keep it focused: one concern per pull request.
3. **Add a changeset** when you change published behavior, as described in [Changesets](#changesets).
4. **Run the gates**, described in [Gates](#gates). Git hooks run them for you on commit and push.
5. **Open a pull request.** Reference the issue in the body with `Closes #<n>` so it closes when the PR merges.

## Adding a component

Scaffold a base component instead of hand-creating its files:

```sh
pnpm gen component   # prompts for the name, the primitive kind (native or aria), and the Storybook category
```

The generator (Turborepo `turbo gen`, defined in `turbo/generators/`) creates `<name>.tsx`, `<name>.styles.ts` (the `tv()` variant map), `index.ts`, and `<name>.stories.tsx` under `packages/react/src/components/bases/<name>/`, adds the `<name>.css` stub under `@friday-sandbox/styles/src/components/<name>/` with its `@import`, creates the `<name>.mdx` docs page and its nav entry, wires the export barrels, and writes a changeset. Choose the `aria` primitive for an interactive component (it scaffolds the size, state, and story skeleton), or `native` for a minimal display element. Then fill in the variants, the `@apply` rules, the stories, and the docs. `pnpm lint:symmetry` verifies that `<name>.styles.ts` (in `react`) and `<name>.css` (in `styles`) stay a 1:1 mirror across the package boundary. Don't hand-create or hand-wire these files. To have Claude run this scaffolding step and everything after it from a plain-language goal instead, see [Building a component with Claude](#building-a-component-with-claude).

If the component needs a design token that does not exist yet, add it upstream in `@friday-sandbox/styles` first — by hand-authoring it in the theme CSS — then consume it downstream; `react` never defines its own tokens. The styles-is-upstream split, the `fri-<name>` class contract, and the token flow are in [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Building a component with Claude

The `pnpm gen component` route above is the manual one. This repo also ships a suite of Claude Code skills under `.claude/skills/component-*` that drive the same lifecycle from a plain-language goal: you describe _what_ you want and Claude runs the stations, starting from the scaffold above. Those skill files are Claude's instructions, not a manual you read — all you need are the trigger phrases below.

**The phrase you'll use most.** In Claude Code — the `claude` CLI in your terminal, or the editor extension — tell Claude, in plain language, to design a component:

```text
design a Badge
```

That starts `component-blueprint`, which records an approved issue you then implement and ship. The flow runs in three issue-driven phases, and you step in only at the two human checkpoints below.

### You step in twice, and only twice

1. **Up front** — you approve the design. The issue tracker is shared, so Claude asks you to authorize the issue (and later the pull request and any review sub-issues) before creating them; it never touches an issue, branch, or PR you didn't approve.
2. **At the end** — you are the only one who merges. Approve and it lands; request changes and `component-rebut` re-enters: fix, re-verify, drive the reviewers clean, back to you.

Between those two points it runs without you prompting each step:

```text
YOU      approve the design  →  blueprint records the issue
  ↓
CLAUDE   implement: branch → build → gates → PR → green CI
         rebut: bot review → fix → push  (repeats until checks + every bot round are clean)
  ↓
YOU      merge   ·   or request changes → back to Claude
```

**Driving one phase yourself.** Each phase has its own trigger, so you can stop and inspect between them:

| Tell Claude                  | Skill                 | What it does                                                  | Tracker writes  |
| ---------------------------- | --------------------- | ------------------------------------------------------------- | --------------- |
| `design a Badge`             | `component-blueprint` | settles the primitive/ladder/tokens, records the issue + plan | yes (the issue) |
| `implement issue #N`         | `component-implement` | branches, generates + fills the surfaces, gates, opens the PR | yes             |
| `handle the review comments` | `component-rebut`     | triages the bot review, fixes, pushes once per round          | yes             |

`component-blueprint`'s design work stays in chat until you authorize the issue write, so it's the safe place to start. `component-implement` and `component-rebut` write to the shared tracker, so Claude confirms each issue, branch, and PR with you first — it never guesses a target.

The gates and the human merge exist for a reason: generated code is shipped, not understood, until you read it. Review the diff.

## Commit and pull request titles

Commits and pull request titles follow [Conventional Commits](https://www.conventionalcommits.org): `type(scope): subject`.

| Part            | Rule                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `type`          | one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `setup`, `style`, `test` |
| `scope`         | required and lowercase, naming the package or area you touched                                               |
| `subject`       | lowercase, imperative, **50 characters max**                                                                 |
| body and footer | none — the description belongs in the pull request                                                           |

Put issue references such as `Closes #<n>` in the pull request body, never the title. Merges are squashed, and the pull request number is appended to the title automatically.

```text
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

## Gates

A pull request must be green before it can merge. These run automatically through the pre-commit and pre-push hooks, and again in CI:

| Gate                            | Checks                                                    |
| ------------------------------- | --------------------------------------------------------- |
| `pnpm format:check`             | Prettier                                                  |
| `pnpm sort:check`               | `package.json` key order                                  |
| `pnpm lint`                     | ESLint, zero warnings                                     |
| `pnpm lint:symmetry`            | component symmetry + token resolution (no dangling `var`) |
| `pnpm lint:md`                  | markdownlint                                              |
| `pnpm knip`                     | unused files, deps, and exports                           |
| `pnpm depcruise`                | dependency rules                                          |
| `pnpm typecheck`                | TypeScript                                                |
| `pnpm build`                    | build all packages                                        |
| `pnpm build:storybook`          | Storybook build                                           |
| `pnpm test`                     | test suites                                               |
| `pnpm audit --audit-level high` | dependency vulnerabilities                                |

The full suite is slow. While iterating, let the hooks check what you touched instead of running everything by hand.

Don't disable a rule, skip a gate, or bypass the hooks with `--no-verify` to force a green result; fix the underlying cause. CI re-runs every gate, so a skipped gate only resurfaces later.

## Pull request guidelines

- Keep each pull request small and scoped to a single issue.
- Make sure every gate passes and the branch is up to date with `main`.
- For visual changes, include a screenshot or screen recording of the before and after.
- Fill in the pull request template, describing what changed and why.
- A maintainer reviews and merges. Address review feedback by pushing follow-up commits to the same branch.

## Reporting a vulnerability

Don't open a public issue for security problems. Follow [`.github/SECURITY.md`](.github/SECURITY.md) and use GitHub's private vulnerability reporting instead.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
