---
paths:
  - "packages/**"
  - "apps/**"
---

# Rule: codemap — what lives where

- **`styles`** — the upstream source and shared core: hand-authored token CSS,
  the Tailwind layers (`@layer theme, base, components, utilities`, imported in
  that order), the `themes/` token seeds, the `tailwind/` `@theme` bridge, the
  `layers/` base/spacing/utilities/variants files, and one CSS file per component. Ships
  CSS only, no JavaScript.
- **`react`** — accessible components built on `react-aria-components` (when
  interactive) or native HTML (display and layout), each owning its own `tv()`
  variant map (`<name>.styles.ts`, co-located with `<name>.tsx`) and styled
  only through `fri-<name>` classes. `components/bases/` holds the real published
  components and `components/utils/` the shared helpers; `samples/` and `icons/`
  sit at `src/` top-level — `samples/` holds demo fixtures (`Boxes`, `Lorem`, …)
  stories and the docs previews use for placeholder content, exposed to the
  workspace via the `@friday-sandbox/react/samples` subpath and stripped from the
  published package, and `icons/` the icon set.
- **`eslint-config`, `typescript-config`** — dev-only shared presets, extended
  rather than copied by the other packages.
- **`docs`** — the lone app, a Next.js + Fumadocs site that consumes `react`
  and `styles`; its pages are MDX.

How a component is built — the generator command and the issue-driven
lifecycle — lives in [`CONTRIBUTING.md`](../../CONTRIBUTING.md). Repo-wide
invariants — gates run via git hooks, the `src` ↔ `exports` surface parity, and
TypeScript-only sources — live in [`CLAUDE.md`](../../CLAUDE.md).

Pairs with styles-upstream (which package leads) and tests-are-stories (where
the tests live).
