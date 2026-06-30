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
- **Derived, contrast-checked tokens.** Set a handful of base tokens; every interaction state, surface, and tier derives automatically. The shipped light and dark themes are contrast-checked at build time.
- **Tailwind CSS v4 native.** Every token registers with `@theme inline` and emits a canonical utility, alongside ready-to-use `fri-*` component classes.

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

That is the whole model: set the base tokens you want to change, and every derived value (surfaces, borders, the interaction ladder) recomputes. The full base set is declared in [`variables.css`](./src/themes/default/variables.css).

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

- **Hand-authored tokens.** The theme lives in [`src/themes/`](./src/themes/) as plain CSS variables; the interaction ladder, surfaces, and tiers derive from the base roles via runtime `color-mix`. Each component's `tv()` variant map lives in [`src/components/`](./src/components/) and is exported from `@friday-sandbox/styles/components/<name>`.
- **Drop-in compatibility.** Unprefixed shadcn/Tailwind token names via `@friday-sandbox/styles/compat`.

## License

[MIT](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
