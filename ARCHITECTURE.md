# Architecture

`friday-sandbox` is an accessible React component library paired with a
framework-agnostic design-token system. The goal it serves: a component's look
is driven entirely by design tokens, so theming is plain CSS variables with no
build step; the React API stays accessible (built on `react-aria-components`);
and the whole system is machine-predictable (a regular token grammar, a
generated theme, and stories that double as tests).

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
**upstream in `styles` first** — through the spec and codegen when it is
formula-derivable, or a hand-authored theme file when it is not — then consumes
it downstream. Reuse an existing token before inventing one.

## The class-name contract

A component is split across both packages and **linked by a class name, not an
import**. In `react`, a component's `tv()` variants map its props to a stable
`fri-<name>` class plus `fri-<name>-<value>` modifier classes. In `styles`, the
visual rules for those classes live in that component's CSS file under `@layer
components`. Neither side imports the other for styling — the `fri-<name>` class
is the entire contract, and it is what lets the same look apply to a
hand-written element, not only the React component.

Every variant value has exactly one class on each side; the two mirror 1:1, and
a lint gate fails on an orphan class on either side.

## The token system is generated from one spec

The theme is **generated, not hand-written**. A small spec of Tier-A knobs is
the single source of truth; a codegen script expands it through a derivation
table into the generated theme CSS — the color, border, radius, and spacing
tokens and the Tailwind `@theme` map. Generated files carry a `GENERATED`
header and are overwritten on every codegen run: **never hand-edit them.** To
change a color or scale, edit the spec or the formulas and rerun codegen.

Components consume spacing and size through the **semantic Tailwind alias** the
theme exposes — `gap-sm`, `p-md`, `bg-primary` — which resolve to the `--fri-*`
tokens because the spec maps them into `@theme`. Never a raw numeric (`gap-2`),
and never a bare `gap-(--fri-*)` var form when an alias exists.

Two files carry the `@theme` map, split by origin and never overlapping: the
generated one (color, radius, spacing, font) and a hand-authored one (the
typography type scale, which is not formula-derived). A build-time **contrast
gate** fails the build on any text/surface pair below the APCA/WCAG floor, so
the generated palette cannot ship an inaccessible default.

## Codemap

- **`styles`** — the upstream source: tokens (spec → codegen → generated
  theme), the Tailwind layers (`@layer theme, base, components, utilities`,
  imported in that order), shared utilities, and one CSS file per component.
- **`react`** — accessible components built on `react-aria-components` (when
  interactive) or native HTML (display and layout), styled only through
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
