<div align="center">

# @friday-sandbox/styles

**Framework-agnostic design tokens and Tailwind CSS v4 layers.**

[![npm version](https://img.shields.io/npm/v/@friday-sandbox/styles?style=flat)](https://www.npmjs.com/package/@friday-sandbox/styles)
[![npm downloads](https://img.shields.io/npm/dm/@friday-sandbox/styles.svg?style=flat)](https://www.npmjs.com/package/@friday-sandbox/styles)
[![License](https://img.shields.io/npm/l/@friday-sandbox/styles?style=flat)](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
[![CI](https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml)

[Theming](#theming) · [Contributing](https://github.com/next-friday/friday-sandbox/blob/main/CONTRIBUTING.md)

</div>

## Why

- **Theme by CSS variables.** Override flat custom properties to retheme. Works anywhere CSS loads: React, plain HTML, WordPress, or PHP.
- **Light and dark, built in.** Switch per subtree with `data-theme`; themes nest.
- **Derived tokens.** Set a handful of seed tokens; every interaction state, border, and line tier derives automatically via `color-mix`.
- **Tailwind CSS v4 native.** Semantic tokens register with `@theme inline` and emit canonical utilities (`bg-primary`, `rounded-action`), alongside ready-to-use `fri-*` component classes.

## Installation

```sh
npm install @friday-sandbox/styles
# or
pnpm add @friday-sandbox/styles
# or
yarn add @friday-sandbox/styles
```

Requires Tailwind CSS v4 (peer dependency).

## Quick start

Import once at your app root, after Tailwind:

```css
@import "tailwindcss";
@import "@friday-sandbox/styles";
```

For a buildless setup, load it from a CDN:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@friday-sandbox/styles/dist/index.css"
/>
```

## Theming

Light is the default. Switch to dark on `<html>` or any subtree:

```html
<html data-theme="dark">
  ...
</html>
```

Author your own theme by overriding base tokens. Set each fill and its `-foreground` together; the interaction states derive automatically:

```css
[data-theme="brand"] {
  color-scheme: light;
  --fri-primary: oklch(55% 0.3 240);
  --fri-primary-foreground: oklch(98% 0 0);
  --fri-background: oklch(98% 0 0);
  --fri-foreground: oklch(20% 0 0);
}
```

That is the model: set every seed you want to change. Overriding `--fri-primary` alone changes only that role — accent, info, and the rest keep their defaults, so a complete retheme sets the full seed set: the ground (`--fri-background`/`--fri-foreground`, `--fri-stroke`), the muted text tiers (`--fri-foreground-secondary`/`--fri-foreground-tertiary`), the `surface` fills (`--fri-surface`/`--fri-surface-secondary`), the seven roles (`primary secondary accent info success warning danger`, each seeding its base, `-foreground`, `-secondary`, and `-secondary-foreground`), plus `--fri-focus`. A named theme replaces the mode — it carries its own `color-scheme`, so don't combine it with the `.dark` class. The per-role interaction states, borders, and line tiers derive from the seeds via `color-mix`/`var()` in [`shared/variables.css`](./src/themes/shared/variables.css). Edit the seeds — declared per mode in [`default/tokens.css`](./src/themes/default/tokens.css) — never the derived tokens.

### Good to know

- **Pair each fill with its `-foreground`.** Contrast is the theme author's responsibility — nothing checks it for you, so set them together and verify text stays legible against the APCA/WCAG floor.
- **Load order matters.** Import the package CSS first and your overrides after; later rules win at equal specificity.

## Component classes

Components use a `fri-<component>-<modifier>` convention, usable in plain HTML:

```html
<button class="fri-button fri-button-solid fri-button-primary fri-button-md">
  Save
</button>
```

`.fri-button` on its own renders the default button (solid · primary · md); add a variant, color, or size class only to override a default.

## Reference

- **Hand-authored tokens.** The theme lives in [`src/themes/`](./src/themes/) as plain CSS variables — a theme's color seeds (ground, surface, roles, focus) declared per mode in `<name>/tokens.css`, the theme-agnostic scales (spacing, type, radius archetypes) once in `shared/scales.css`; the per-role interaction states, borders, and line tiers derive from the seeds via runtime `color-mix`/`var()` in `shared/variables.css`. This package ships CSS only — each component's `cva()` variant map lives with the component in `@friday-sandbox/react` (`<name>.styles.ts`), mirrored 1:1 against this package's `<name>.css`.

## License

[MIT](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
