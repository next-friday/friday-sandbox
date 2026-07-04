---
paths:
  - "packages/**"
---

# Rule: architecture — the codemap and invariants

`friday-sandbox` is an accessible React component library paired with a
framework-agnostic design-token system. The goal it serves: a component's look
is driven entirely by design tokens, so theming is plain CSS variables with no
build step; the React API stays accessible (built on `react-aria-components`);
and the whole system is machine-predictable (a regular token grammar and
stories that double as tests).

## Upstream and downstream: styles feeds react

`@friday-sandbox/styles` is the **upstream source of truth** — design tokens,
the Tailwind v4 `@theme` map, shared utilities, and one CSS file per component
holding its visual rules. It ships **CSS only**, no JavaScript.
`@friday-sandbox/react` is a **downstream consumer**: accessible React
components that _use_ what `styles` defines, never redefining tokens or theme.
Build `styles` correct first; `react`, and any future package, consumes it.
`react` depends on `styles` as a peer dependency — for its CSS, not its JS.

A component that needs a token which does not exist yet adds that token
**upstream in `styles` first** — by hand-authoring it in the theme CSS — then
consumes it downstream. Reuse an existing token before inventing one.

## The class-name contract

The visual contract is split across the two packages and linked **by the class
name**. `styles` owns the CSS half: each component's file
(`src/components/<name>.css`) defines the `fri-<name>` class plus
`fri-<name>-<value>` modifier classes under `@layer components`. `react` owns
the JS half: each component's `tv()` variant map (`<name>.styles.ts`,
co-located with `<name>.tsx` in `packages/react/src/components/bases/<name>/`)
maps its props to that same set of class names. The two halves are mirrored
1:1 across the package boundary — a deterministic gate fails on an orphan
class on either side.

The shared spacing utilities are the deliberate exception. Padding and gap live
in `layers/spacing.css` as global `fri-p-*`/`fri-gap-*` classes — not
`fri-<name>`-prefixed, one file every component shares — so a variant map
consumes them by spreading `paddingVariants`/`gapVariants` (and their slot forms)
from `components/utils/spacing-variants.ts`, not by declaring its own. Being
global they fall outside the per-component mirror gate; their `styles` ↔ `react`
parity rests on the shared map that names them.

`react` wraps its own variant map in an accessible component; it declares no
CSS of its own. Because the CSS half of the contract is a plain, framework-
agnostic class name, the same look applies to a hand-written element that
reproduces the class names by hand, not only the React component.

## The token system is a four-layer pipeline

The theme is **hand-authored CSS variables** organised into four layers, each
with one job. A value lives in one place by its nature — a **static seed**
in `tokens.css`, a **derivation** in `variables.css` — and `theme.css` bridges
both to Tailwind. The pipeline never redefines a Tailwind theme variable, save
the `--font-sans`/`--font-mono` exception.

1. **`src/themes/default/tokens.css` — static.** Base, constant `--fri-*` values
   with **no `calc()` or `var()`**: the ground, brand/status roles, field, focus,
   overlay, the spacing / type / motion / radius / shadow scales, the radius
   archetypes (`--fri-action/field/box-radius`, set directly) and geometry
   archetype sizes. Declared per mode in the light/dark blocks; a custom theme
   edits only this file.
2. **`src/themes/default/variables.css` — computed + semantic.** Everything derived
   from the static tokens through runtime `color-mix()`/`var()`: the surfaces,
   emphasis tiers, content tones, line tiers, the slot foregrounds, and the
   per-role interaction ladder (hover, pressed, soft, surface, border, tint) —
   the accent role itself is a seed in `tokens.css`, only its ladder is derived
   here. The interaction mix ratios (`--fri-mix-*`) also live here, declared per
   mode: internal constants the `color-mix()` derivations consume, not consumer
   seeds — the one non-derived value the file holds.
3. **`src/tailwind/theme.css` — the Tailwind bridge.** One `@theme inline`
   block maps `--fri-*` onto Tailwind theme variables (`--color-*`,
   `--spacing-*`, `--radius-action/…`, `--shadow-surface/…`, `--text-*`) so they
   emit semantic utilities (`bg-primary`, `gap-small`, `rounded-action`,
   `shadow-surface`). It **adds new names only** — Tailwind's own defaults
   (`--radius-sm`, `--ease-*`, `--shadow-sm/md/lg`, bare `--spacing`) stay native
   so a consumer can still use them — save the `--font-sans`/`--font-mono`
   exception.
4. **`src/components/<name>.css` — consume + component-local calc.**
   Components apply the semantic utilities and add only the arithmetic unique to
   that component, driven by a local ramp multiplier (`--_<name>-n`). Every
   `.fri-*` rule (and every base element rule) styles through `@apply` **only** —
   a raw CSS property is a bug when a utility exists. A property Tailwind has no
   utility for (`grid-template-columns: repeat(auto-fit…)`,
   `font: inherit`) is defined once as a named `@utility` in `layers/utilities.css`
   (see `status-disabled`) and `@apply`-ed; raw declarations live
   only in `@utility` bodies and the token layer. Custom-property defs (`--*`, the
   ramp multiplier) are var machinery and stay. The `lint:symmetry` apply-only
   dimension enforces this.

**Worked example — radius.** `tokens.css` holds two static sets: the generic
scale (`--fri-radius-xs … xl`; for a `radius` prop or a consumer's own
`rounded-(--fri-radius-md)`) and the per-component archetypes
(`--fri-action-radius`, `--fri-box-radius`) a consumer sets directly.
`theme.css` maps the archetypes to `rounded-action/field/box`; `button.css`
scales its archetype per size:

```css
--button-radius: calc(var(--fri-action-radius) * var(--_button-n) / 10);
```

Radius is fully static, so it never touches `variables.css`.

Components consume spacing and size through the **semantic Tailwind alias** —
`gap-small`, `p-medium`, `bg-primary` — never a raw numeric (`gap-2`) or a bare
`gap-(--fri-*)` var form when an alias exists. There is no spec, no codegen, no
generated file — edit the CSS directly. A11y contrast is the author's
responsibility — verify text/surface pairs against the APCA/WCAG floor when
changing a color.

## Codemap

- **`styles`** — the upstream source and shared core: hand-authored token CSS,
  the Tailwind layers (`@layer theme, base, components, utilities`, imported in
  that order), the `themes/` token seeds, the `tailwind/` `@theme` bridge, the
  `layers/` base/spacing/utilities/variants files, and one CSS file per component. Ships
  CSS only, no JavaScript.
- **`react`** — accessible components built on `react-aria-components` (when
  interactive) or native HTML (display and layout), each owning its own `tv()`
  variant map (`<name>.styles.ts`, co-located with `<name>.tsx`) and styled
  only through `fri-<name>` classes. `bases/` holds real published components;
  `samples/` holds demo fixtures (`Boxes`, `Lorem`, …) that stories and the docs
  previews use for placeholder content — exposed to the workspace via the
  `@friday-sandbox/react/samples` subpath and stripped from the published package;
  `icons/` and `utils/` as named.
- **`eslint-config`, `typescript-config`** — dev-only shared presets, extended
  rather than copied by the other packages.
- **`docs`** — the lone app, a Next.js + Fumadocs site that consumes `react`
  and `styles`; its pages are MDX.

## How a component is built

Components are **generated, not hand-rolled.** One generator command scaffolds
the symmetric file set across both packages — the React surfaces, the styles
CSS, the docs page, and a changeset — and wires every export barrel. The build
is then an issue-driven lifecycle (design, implement, review) carried by the
`component-*` skills. The export chain runs `src/index` → `components/bases/index`
→ the component's own `index`.

## Tests are stories

There are **no `*.test` files.** Vitest runs every `*.stories.tsx` in real
Chromium via Playwright. A story is its own test; writing a story gives you a
test.

## Cross-cutting concerns

- **Gates run via git hooks**, never by hand — pre-commit on staged files,
  pre-push the full suite.
- **`src` ↔ `exports`** — workspace consumers read `src/`, published consumers
  read `dist/`; change one surface, align the other.
- **TypeScript only** — source and scripts are `.ts`/`.tsx`, run with Node's
  native type-stripping; a config loaded only as ESM is `.mjs`.
