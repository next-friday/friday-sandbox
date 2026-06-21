# Handbook

The handbook for `friday-sandbox`, a Turborepo + pnpm monorepo shipping the `@friday-sandbox/*` packages: a React 19 UI library and the CSS, ESLint, and TypeScript foundations it stands on. Read it front to back, or jump to a chapter from the table of contents below.

**Using the packages?** See the package READMEs ([`@friday-sandbox/react`](../packages/react/README.md), [`@friday-sandbox/styles`](../packages/styles/README.md)) and the live Storybook for install, usage, and theming. This handbook is for contributors.

Everything canonical for contributors lives here under `docs/`. AI assistants and PR-review bots keep their own config, but it only points back here.

## Table of contents

| Chapter                                      | What it covers                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1. [Styles](styles/)                         | the CSS design system: dumb tokens, smart components, the sizing formulas, and the styling rules |
| 2. [React](react/)                           | the components: folder anatomy, composition, accessibility, and the component rules              |
| 3. [Tooling](tooling/)                       | the monorepo: workspaces, commands, the build graph, quality gates, publishing, and house style  |
| Workflow: [Contributing](../CONTRIBUTING.md) | how a change ships: issue to branch to PR, changesets, and the gates that guard it               |

## First run

```sh
corepack enable      # honors the pinned pnpm version
pnpm install
pnpm dev             # Storybook for @friday-sandbox/react on http://localhost:6006
```

Node `>=22.10.0`, pnpm 10 pinned via `packageManager` in the root `package.json`. The full command list is in [Tooling](tooling/README.md#commands).

## Principles

Two expectations sit above every chapter; CI and the reviewers hold you to them:

- **DRY and symmetric:** one skeleton per file kind, and shared logic extracted once rather than repeated. Every similar file, such as a component, story, or rule, follows the same shape, and so does every chapter here.
- **Self-contained artifacts:** issues, PRs, and docs never cite another design system or repository as precedent. Apply a convention silently and state the requirement directly.

---

Handbook hub · [Styles](styles/) · [React](react/) · [Tooling](tooling/) · [Contributing](../CONTRIBUTING.md)
