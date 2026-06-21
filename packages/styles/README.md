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

The default variant is `solid` and the default color is `primary`, baked into `.fri-button`. `fri-button-icon-only` makes a square button to pair with an `aria-label`, `fri-button-full-width` makes the button span its container, and `fri-button-rounded-full` makes it fully rounded.

## Themes

The default theme provides light and dark modes:

- **Light mode** is applied by default to `:root`.
- **Dark mode** is applied with the `.dark` class or the `[data-theme="dark"]` attribute.

```html
<!-- dark mode via class -->
<html class="dark"></html>

<!-- dark mode via data attribute -->
<html data-theme="dark"></html>
```

The toggle is scopable. Apply `.dark` to any subtree to flip only that subtree.

## CSS Variables

Override any token in your app's CSS to retheme.

### Colors

Semantic colors, each paired with a foreground that components use for readable text:

```css
:root {
  --primary: oklch(57.49% 0.2084 257.52);
  --primary-foreground: oklch(100% 0 0);

  --secondary: oklch(43.92% 0.0192 239.51);
  --secondary-foreground: oklch(100% 0 0);

  --accent: oklch(0 0 0);
  --accent-foreground: oklch(100% 0 0);

  --info: oklch(55.53% 0.175 255.24);
  --info-foreground: oklch(100% 0 0);

  --success: oklch(53.24% 0.1205 159.6);
  --success-foreground: oklch(100% 0 0);

  --warning: oklch(73.3% 0.1596 63.45);
  --warning-foreground: oklch(100% 0 0);

  --danger: oklch(56.13% 0.1887 21.51);
  --danger-foreground: oklch(100% 0 0);
}
```

Components compute their own hover and pressed states from the color. Change `--primary` and `.fri-button-primary`, plus its hover, focus ring, and pressed states, follows automatically.

### Surfaces

Light by default, flipped by `.dark` or `[data-theme="dark"]`:

```css
:root {
  --background: oklch(100% 0 0);
  --foreground: oklch(0 0 0);
  --surface: oklch(20.9% 0 0);
  --surface-foreground: oklch(100% 0 0);
  --neutral: oklch(65.47% 0.0208 248.15);
  --muted: oklch(89.2% 0.0051 228.83);
  --ring: oklch(57.49% 0.2084 257.52);
}
```

`--surface` and `--surface-foreground` are an inverted surface pair, such as a tooltip, with `bg-surface` and `text-surface-foreground` utilities. `--neutral` is a standalone mid-tone with no foreground token and is the only color identical in light and dark. `--ring` is the focus ring color, applied through the `focus-ring` utility and the `ring-ring` alias.

### Sizing

Three semantic scopes: `action` for clickable triggers, `field` for form data entry, and `box` for containers:

```css
:root {
  --size-action: 0.25rem;
  --radius-action: 0.5rem;

  --size-field: 0.25rem;
  --radius-field: 0.375rem;

  --size-box: 0.25rem;
  --radius-box: 0.75rem;

  --border: 1px;
}
```

Override `--size-{scope}` and every size from `xs` to `xl` for that scope rescales together, so you do not have to touch each variant. `--radius-{scope}` is the reference at `md`. Smaller sizes get proportionally smaller corners and larger sizes get larger ones, so a pill never collapses to a square at `xs` or stretches at `xl`.

### Component-local tokens

A few tokens are scoped to a component rather than the global theme. Override them on the element, not at `:root`, where the component's own class declaration would mask them. `--grid-min` sets the minimum track width of a responsive grid built with `fri-grid-cols-auto-fit` or `fri-grid-cols-auto-fill`. It defaults to `16rem` on `.fri-grid`:

```html
<div class="fri-grid fri-grid-cols-auto-fit [--grid-min:20rem]">…</div>
```

```css
.product-grid.fri-grid {
  --grid-min: 20rem;
}
```

### Tailwind utility aliases

Every color token is registered with `@theme inline`, so Tailwind v4 emits a canonical utility class for each. Use the alias, not the arbitrary-var fallback:

```html
<!-- canonical -->
<div class="rounded-md bg-muted px-4 py-2 text-sm text-foreground">…</div>
<div class="border border-primary">…</div>

<!-- avoid: arbitrary-var form for a registered token -->
<div class="rounded-md bg-(--muted) px-4 py-2 text-sm text-(--foreground)">
  …
</div>
```

Available aliases:

- **Colors**: `bg-<color>`, `text-<color>`, `border-<color>`, `ring-<color>`, `fill-<color>`, `stroke-<color>` for every intent and its foreground pair, plus `background`, `foreground`, `surface` and its foreground, `neutral`, and `muted`. `neutral` has an alias but no foreground token.
- **Radius**: `rounded-action`, `rounded-field`, `rounded-box`.
- **Border**: `border` width from `--border`.

Component-local variables such as `--grid-min` are not registered in `@theme inline`, so they have no alias. Reference them with the arbitrary-var form, for example `bg-(--grid-min)`.

## Troubleshooting

- **Styles are not applied.** The CSS import is missing. Add `@import "@friday-sandbox/styles";` after `@import "tailwindcss";` at your app root.
- **Utilities or tokens do not resolve.** The wrong Tailwind major is installed. This package requires Tailwind CSS v4.

## License

[Apache-2.0](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
