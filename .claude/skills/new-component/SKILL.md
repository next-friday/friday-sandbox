---
name: new-component
description: Use when adding or building a base component in @friday-sandbox/react (e.g. "add a Button", "create a Tooltip component", "scaffold a new component"). Drives the full build — generate, fill the judgment surfaces against the repo conventions, then verify — so one trigger produces a complete component instead of prompting each step.
---

# New Component

Build a base component end to end from one trigger. The generator scaffolds every surface; this skill fills the parts that need judgment, against the repo's conventions, then verifies. Do not hand-create or hand-wire component files.

## 1. Generate

Run the generator. It writes the React files, the three export barrels, the styles css, the docs page and its nav entry, and a changeset:

```sh
pnpm gen component   # prompts: name (kebab or words), Storybook category
```

Never hand-create these files or edit the barrels by hand — the generator owns them.

## 2. Fill the judgment surfaces

The generator leaves stubs. Fill each against these conventions:

- **`packages/react/src/components/bases/<name>/<name>.variants.ts`** — define the real `tv()` variants and map every value to a distinct `fri-<name>-<value>` class. Keep each size and color distinct; never collapse several into one token.
- **`packages/styles/src/components/bases/<name>.css`** — write the visual rules for `.fri-<name>` and one class per variant, inside `@layer components`, via `@apply`. The component and its styles are linked by the `fri-<name>` class name, not an import, so keep this file and `.variants.ts` mirrored.
- **`<name>.tsx`** — the real props and the primitive it wraps (react-aria-components, radix, or native HTML, per the pattern); keep `data-slot="<name>"` and compose `className` through the variants.
- **`<name>.stories.tsx`** — stories are the tests (Vitest runs them in Chromium via Playwright). Cover `Default`, every variant, and the states, with `play` assertions, not just renders.
- **`apps/docs/content/docs/components/<name>.mdx`** — fill the `STYLE.md` spine prose in order: Purpose, When to use, When not to use, Example, Accessibility. Honor the marketing-word banlist in `STYLE.md`.

## 3. Verify and ship

- Let the hooks run the gates (pre-commit on staged files, pre-push the full list); do not run whole-repo gates by hand.
- The stories run as tests; the new component needs them green.
- Ship through the issue then branch then PR flow (the **implement** skill), with a `.changeset/*.md` entry for the `feat`.

## Conventions this encodes

- A component is split across `@friday-sandbox/react` and `@friday-sandbox/styles`, linked by the `fri-<name>` class rather than an import; edit one side, mirror the other.
- Export chain: `<name>/index.ts` then `bases/index.ts` then `components/index.ts` then `src/index.ts`, all wired by the generator.
- Tests are stories, docs follow the `STYLE.md` spine, and everything is TypeScript.
