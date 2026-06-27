<div align="center">

# @friday-sandbox/styles

**Framework-agnostic design tokens and Tailwind CSS v4 layers.**

[![npm version](https://img.shields.io/npm/v/@friday-sandbox/styles?style=flat)](https://www.npmjs.com/package/@friday-sandbox/styles)
[![npm downloads](https://img.shields.io/npm/dm/@friday-sandbox/styles.svg?style=flat)](https://www.npmjs.com/package/@friday-sandbox/styles)
[![License](https://img.shields.io/npm/l/@friday-sandbox/styles?style=flat)](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
[![CI](https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml)

[Theming](#theming) · [Token reference](./design.md) · [Contributing](https://github.com/next-friday/friday-sandbox/blob/main/CONTRIBUTING.md)

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

That is the whole model: set the base tokens you want to change, and every derived value (surfaces, borders, the interaction ladder) recomputes. The [starter template](./src/theme-template.css) lists the full base set.

### Good to know

- **Pair each fill with its `-foreground`.** Shipped themes are contrast-checked at build time; runtime overrides are not, so set them together to keep text legible.
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

- **Every token, always current.** [`design.md`](./design.md) is generated from the spec, so it never drifts from the shipped CSS.
- **Starter template.** Copy [`@friday-sandbox/styles/template`](./src/theme-template.css) to scaffold a custom theme.
- **Drop-in compatibility.** Unprefixed shadcn/Tailwind token names via `@friday-sandbox/styles/compat`.

## License

[MIT](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
