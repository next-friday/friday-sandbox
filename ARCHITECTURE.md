# Architecture

`friday-sandbox` is an accessible React component library paired with a
framework-agnostic design-token system. The goal it serves: a component's look
is driven entirely by design tokens, so theming is plain CSS variables with no
build step; the React API stays accessible (built on `react-aria-components`);
and the whole system is machine-predictable (a regular token grammar and
stories that double as tests).

This document is the bird's-eye view — the codemap and the invariants. It names
entities rather than linking paths (links go stale; search by name). For the
contribution workflow see `CONTRIBUTING.md`; for prose conventions see
`STYLE.md`.

## Upstream and downstream: styles feeds react

`@friday-sandbox/styles` is the **upstream source of truth** — design tokens,
the Tailwind v4 `@theme` map, shared utilities, and one CSS file per component
holding its visual rules. `@friday-sandbox/react` is a **downstream consumer**:
accessible React components that _use_ what `styles` defines, never redefining
tokens or theme. Build `styles` correct first; `react`, and any future package,
consumes it. `react` depends on `styles` as a peer dependency.

A component that needs a token which does not exist yet adds that token
**upstream in `styles` first** — by hand-authoring it in the theme CSS — then
consumes it downstream. Reuse an existing token before inventing one.

## The class-name contract

`styles` owns the full visual contract. Each component's `tv()` variant map
(`src/components/<name>/<name>.styles.ts`) maps its props to a stable
`fri-<name>` class plus `fri-<name>-<value>` modifier classes, and the CSS rules
for those classes live in that component's file under `@layer components`. The
variant map and the CSS are **linked by the class name** — both inside `styles`,
mirrored 1:1, and a lint gate fails on an orphan class on either side.

`react` **imports** the variant map from `@friday-sandbox/styles/components/<name>`
and wraps it in an accessible component; it declares no classes of its own.
Because the contract is a plain class string, the same look applies to a
hand-written element, not only the React component.

## The token system is hand-authored CSS

The theme is **hand-authored CSS variables**. The base roles — brand, status,
and ground — are flat `oklch` values in `themes/default/variables.css`; the interaction ladder,
surfaces, and emphasis tiers derive from those bases through runtime
`color-mix`, so overriding a base role reflows everything built on it. There is
no spec, no codegen, and no generated file — edit the theme CSS directly.

Components consume spacing and size through the **semantic Tailwind alias** the
theme exposes — `gap-sm`, `p-md`, `bg-primary` — which resolve to the `--fri-*`
tokens because `tailwind.css` maps them into `@theme`. Never a raw numeric
(`gap-2`), and never a bare `gap-(--fri-*)` var form when an alias exists.

The `@theme` map (`tailwind.css`) and the `@property` registrations
(`registered.css`) sit alongside the token values and are kept in sync with them
by hand; the typography type scale is its own hand-authored file. A11y contrast
is the author's responsibility — verify text/surface pairs against the
APCA/WCAG floor when changing a color.

## Codemap

- **`styles`** — the upstream source and shared core: hand-authored token CSS,
  the Tailwind layers (`@layer theme, base, components, utilities`, imported in
  that order), the `themes/`, `utilities/`, and `variants/` layers, one CSS file
  per component, and each component's `tv()` variant map (shipped as JS).
- **`react`** — accessible components built on `react-aria-components` (when
  interactive) or native HTML (display and layout), each importing its variant
  map from `@friday-sandbox/styles/components/<name>` and styled only through
  `fri-<name>` classes. `bases/` holds real published components; `samples/`
  holds Storybook-only demos; `icons/` and `utils/` as named.
- **`eslint-config`, `typescript-config`** — dev-only shared presets, extended
  rather than copied by the other packages.
- **`docs`** — the lone app, a Next.js + Fumadocs site that consumes `react`
  and `styles`; its pages are MDX.

## How a component is built

Components are **generated, not hand-rolled.** One generator command scaffolds
the symmetric file set across both packages — the React surfaces, the styles
CSS, the docs page, and a changeset — and wires every export barrel. The build
is then an issue-driven lifecycle (design, implement, review) carried by the
`component-*` skills. The export chain runs `src/index` → `components/index` →
`bases/index` → the component's own `index`.

## Tests are stories

There are **no `*.test` files.** Vitest runs every `*.stories.tsx` in real
Chromium via Playwright. A story is its own test; writing a story gives you a
test.

## Cross-cutting concerns

- **Gates run via git hooks**, never by hand — pre-commit on staged files,
  pre-push the full suite. The full list lives in `CONTRIBUTING.md`.
- **`src` ↔ `exports`** — workspace consumers read `src/`, published consumers
  read `dist/`; change one surface, align the other.
- **TypeScript only** — source and scripts are `.ts`/`.tsx`, run with Node's
  native type-stripping; a config loaded only as ESM is `.mjs`.
