# @friday-sandbox/styles

Design tokens and Tailwind CSS v4 layers consumed by @friday-sandbox/react.

<p>
  <a href="https://www.npmjs.com/package/@friday-sandbox/styles">
    <img src="https://img.shields.io/npm/v/@friday-sandbox/styles?style=flat" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@friday-sandbox/styles">
    <img src="https://img.shields.io/npm/dm/@friday-sandbox/styles.svg?style=flat" alt="npm downloads">
  </a>
  <a href="https://github.com/next-friday/friday-sandbox/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@friday-sandbox/styles?style=flat" alt="License">
  </a>
  <a href="https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml">
    <img src="https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
</p>

## Features

- **Design tokens.** Semantic colors, surfaces, and sizing scopes exposed as CSS variables you can override.
- **Tailwind CSS v4 integration.** Every color token is registered with `@theme inline`, so it emits a canonical Tailwind utility; component-local variables stay reachable through the arbitrary-var form.
- **Component classes.** Ready-to-use `fri-*` classes for button and layout primitives.
- **Light and dark themes.** Built in, switchable per subtree.

## Requirements

- Tailwind CSS v4 (peer dependency, `tailwindcss@^4`)

## Installation

```bash
npm install @friday-sandbox/styles
# or
pnpm add @friday-sandbox/styles
# or
yarn add @friday-sandbox/styles
```

## Usage

Import the stylesheet once at your application root, after Tailwind:

```css
@import "tailwindcss";
@import "@friday-sandbox/styles";
```

```ts
// or as a side-effect import in JavaScript
import "@friday-sandbox/styles";
```

This pulls in Tailwind base styles, the default theme tokens in light and dark, the `@theme inline` registrations, the `status-disabled`, `transition-base`, and `focus-ring` utilities, and the component classes for button, flex, grid, and scroll-area.

The package exposes one entry point, available as the bare specifier or as `./css`:

```css
@import "@friday-sandbox/styles/css";
```

### Plain HTML, no build step

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@friday-sandbox/styles/dist/index.css"
/>
```

## Component Classes

Components use a kebab-case `fri-<component>-<modifier>` convention. Apply the base class plus one class from each axis. Every modifier has its own addressable class, with no hidden defaults.

```html
<!-- base + solid variant + primary color + md size -->
<button class="fri-button fri-button-solid fri-button-primary fri-button-md">
  Save
</button>

<!-- destructive action -->
<button class="fri-button fri-button-solid fri-button-danger fri-button-md">
  Delete
</button>

<!-- subtle, compact secondary -->
<button class="fri-button fri-button-subtle fri-button-secondary fri-button-sm">
  Cancel
</button>

<!-- works on any element -->
<a
  class="fri-button fri-button-outline fri-button-primary fri-button-md"
  href="/"
>
  Go
</a>
```

| Class                                                                                           | Required | Pick   |
| ----------------------------------------------------------------------------------------------- | -------- | ------ |
| `fri-button`                                                                                    | yes      | base   |
| `fri-button-solid` / `-subtle` / `-surface` / `-outline` / `-ghost` / `-plain`                  | one      | 1 of 6 |
| `fri-button-primary` / `-secondary` / `-accent` / `-info` / `-success` / `-warning` / `-danger` | one      | 1 of 7 |
| `fri-button-xs` / `-sm` / `-md` / `-lg` / `-xl`                                                 | one      | 1 of 5 |
| `fri-button-icon-only`                                                                          | no       | square |
| `fri-button-full-width`                                                                         | no       | block  |
| `fri-button-rounded-full`                                                                       | no       | round  |

`.fri-button` on its own renders the default button: variant `solid`, color `primary`, size `md`. The base class alone is usable in plain HTML, so add a variant, color, or size class only to override a default. `fri-button-icon-only` makes a square button to pair with an `aria-label`, `fri-button-full-width` makes the button span its container, and `fri-button-rounded-full` makes it fully rounded.

## Consumer theming

The default theme ships **light** and **dark**, and you retheme by overriding flat CSS custom properties, with no build step, plugin, or JavaScript. The same approach works in Next.js, plain HTML, WordPress, or PHP; only _where the CSS lives_ changes.

### 1. Load the stylesheet once

```html
<!-- plain HTML / WordPress / PHP, via CDN -->
<link
  rel="stylesheet"
  href="https://unpkg.com/@friday-sandbox/styles/dist/index.css"
/>
```

```css
/* Next.js or any bundler: app/globals.css, after Tailwind */
@import "tailwindcss";
@import "@friday-sandbox/styles";
```

### 2. Switch and scope with `data-theme`

Light is the default. Apply dark with the `.dark` class or `[data-theme="dark"]`, on `<html>` or any subtree, and themes nest:

```html
<html data-theme="dark">
  <aside data-theme="light">light only here</aside>
</html>
```

### 3. Author a custom theme

Write one flat block. Set the role and its `-foreground` together; every interaction state such as `--fri-primary-hover` and `--fri-primary-soft` derives automatically, so never set those by hand:

```css
[data-theme="brand"] {
  color-scheme: light;
  --fri-primary: oklch(55% 0.3 240);
  --fri-primary-foreground: oklch(98% 0 0);
  --fri-background: oklch(98% 0 0);
  --fri-foreground: oklch(20% 0 0);
}
```

```html
<html data-theme="brand"></html>
```

A custom theme uses its own name, so it never collides with the shipped `light` / `dark` blocks.

### 4. Override a few tokens for one region

A normal CSS rule, the everyday way. It uses the same idiom as the component-local `--grid-min` override described below:

```css
.promo {
  --fri-primary: oklch(60% 0.25 20);
  --fri-primary-foreground: oklch(98% 0 0);
}
```

```html
<section class="promo">
  <button class="fri-button fri-button-primary">Save</button>
</section>
```

Inline `style="--fri-primary: …; --fri-primary-foreground: …"` is reserved for a value known only at render time, such as a CMS field or a PHP `echo`. Set the role and its foreground together.

### The contract

Set these Tier-1 base tokens; the system derives every interaction state, surface, and tier from them. Override a fill and its `-foreground` as a pair.

| Group                         | Variables                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Ground                        | `--fri-background`, `--fri-foreground`, `--fri-neutral`                                                       |
| Brand (each `+ -foreground`)  | `--fri-primary`, `--fri-secondary`, `--fri-accent`                                                            |
| Status (each `+ -foreground`) | `--fri-info`, `--fri-success`, `--fri-warning`, `--fri-danger`                                                |
| Focus, links                  | `--fri-ring`, `--fri-link`                                                                                    |
| Geometry, type                | `--fri-radius-*`, `--fri-spacing-*`, `--fri-border-width`, `--fri-font-family-sans`, `--fri-font-family-mono` |

Everything else, such as `--fri-card`, `--fri-fill`, `--fri-foreground-muted`, `--fri-border`, and the 12-rung interaction ladder, is **derived** and recomputes when you change a base token. A copy-paste starter ships at `@friday-sandbox/styles/template`; the complete generated reference is in `design.md`. For drop-in shadcn/Tailwind unprefixed names, import `@friday-sandbox/styles/compat`.

### Three things to know

- **Contrast is yours to keep.** The shipped `light` / `dark` are contrast-checked at build time; a runtime override is not. Always set `--<role>-foreground` alongside `--<role>` so text stays legible; runtime does not repair it.
- **Cascade order.** Load the package CSS first and your overrides after; later rules win at equal specificity. Overriding the built-in `light` / `dark` from a bare `:root` while a `[data-theme]` is active loses to the more specific `[data-theme]` rule; override at the same level, or inline. This is the usual snag in WordPress/PHP, not the token values.
- **Component-local tokens** such as `--grid-min` are set on the element, not `:root`, where the component's own class would mask a `:root` value.

## CSS Variables

The complete, always-current token reference, every `--fri-*` token with its
default value, is generated, never hand-maintained, so it cannot drift from the
shipped CSS. Read it in [`design.md`](./design.md), or copy the starter
`src/theme-template.css` (exported as `@friday-sandbox/styles/template`).

## Troubleshooting

- **Styles are not applied.** The CSS import is missing. Add `@import "@friday-sandbox/styles";` after `@import "tailwindcss";` at your app root.
- **Utilities or tokens do not resolve.** The wrong Tailwind major is installed. This package requires Tailwind CSS v4.

## License

[Apache-2.0](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
