# @friday-sandbox/styles

Design tokens, themes, and component CSS for the `@friday-sandbox/react` design system. Built on Tailwind CSS v4 and framework-agnostic — drop it into any app that ships CSS.

## Installation

```bash
npm install @friday-sandbox/styles
# or
pnpm add @friday-sandbox/styles
# or
yarn add @friday-sandbox/styles
```

Peer dependency: `tailwindcss@^4`.

## Usage

### Basic Setup

Import the stylesheet once at the application root:

```css
@import "@friday-sandbox/styles";
```

```ts
// or as a side-effect import in JavaScript
import "@friday-sandbox/styles";
```

This pulls in:

- Tailwind CSS base styles
- Design tokens (default theme, light + dark)
- Tailwind theme registration (`@theme inline`)
- Status utility (`status-disabled`)
- Component styles (button, flex, grid, scroll-area)

### Plain HTML / no build step

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@friday-sandbox/styles/dist/index.css"
/>
```

### Package Structure

```
@friday-sandbox/styles/
├── index.css              # Main entry point
└── src/
    ├── theme/             # Design tokens (designer-facing, plain values only)
    │   ├── index.css      # Theme entry point
    │   └── default.css    # Default theme variables (light + dark)
    ├── system/            # Tailwind v4 glue
    │   ├── index.css      # System entry point
    │   ├── utilities.css  # @utility status-disabled
    │   └── theme.css      # @theme inline mappings
    └── components/        # Component classes
        ├── index.css
        ├── bases/         # Interactive primitives
        │   ├── index.css
        │   └── button.css
        └── layouts/       # Compositional primitives
            ├── index.css
            ├── flex.css
            ├── grid.css
            └── scroll-area.css
```

### Importing Specific Layers

Skip the bundle and pick what you need:

```css
@import "tailwindcss";

/* design tokens */
@import "@friday-sandbox/styles/src/theme" layer(theme);

/* Tailwind theme registration + custom utilities */
@import "@friday-sandbox/styles/src/system" layer(utilities);

/* only the components you use */
@import "@friday-sandbox/styles/src/components/bases/button.css"
  layer(components);
@import "@friday-sandbox/styles/src/components/layouts/flex.css"
  layer(components);
```

### Component Classes

Components use a kebab-case `fri-<component>-<modifier>` convention:

- Base: `.fri-button`
- Color variants: `.fri-button-primary`, `.fri-button-danger`
- Sizes: `.fri-button-sm`, `.fri-button-lg`

Every modifier has its own addressable class — no hidden defaults. Apply the base plus one of each axis.

#### Button Example

```html
<!-- base + primary intent + md size -->
<button class="fri-button fri-button-primary fri-button-md">Save</button>

<!-- destructive action -->
<button class="fri-button fri-button-danger fri-button-md">Delete</button>

<!-- compact secondary -->
<button class="fri-button fri-button-secondary fri-button-sm">Cancel</button>

<!-- works on any element -->
<a class="fri-button fri-button-primary fri-button-md" href="/">Go</a>
```

| Class                                                                                                        | Required | Pick   |
| ------------------------------------------------------------------------------------------------------------ | -------- | ------ |
| `fri-button`                                                                                                 | yes      | —      |
| `fri-button-primary` / `-secondary` / `-accent` / `-neutral` / `-info` / `-success` / `-warning` / `-danger` | one      | 1 of 8 |
| `fri-button-xs` / `-sm` / `-md` / `-lg` / `-xl`                                                              | one      | 1 of 5 |

## Themes

The default theme provides automatic light/dark mode support:

- **Light mode**: applied by default to `:root`
- **Dark mode**: applied with `.dark` class or `[data-theme="dark"]` attribute

```html
<!-- dark mode via class -->
<html class="dark"></html>

<!-- dark mode via data attribute -->
<html data-theme="dark"></html>
```

Toggle is scopable — apply `.dark` to any subtree to flip only that subtree.

## CSS Variables

Override any of these in your app's CSS to retheme.

### Intent Colors

Eight semantic colors. Each is paired with a foreground that components use for readable text:

```css
:root {
  --primary: oklch(0 0 0);
  --primary-foreground: oklch(100% 0 0);

  --secondary: oklch(0.44 0.02 239.55);
  --secondary-foreground: oklch(100% 0 0);

  --accent: oklch(0.56 0.18 255.25);
  --accent-foreground: oklch(100% 0 0);

  --neutral: oklch(0.27 0.02 248);
  --neutral-foreground: oklch(100% 0 0);

  --info: oklch(58% 0.12 247);
  --info-foreground: oklch(100% 0 0);

  --success: oklch(58% 0.11 163);
  --success-foreground: oklch(100% 0 0);

  --warning: oklch(77% 0.15 62);
  --warning-foreground: oklch(21% 0.006 285);

  --danger: oklch(60% 0.19 21);
  --danger-foreground: oklch(100% 0 0);
}
```

Components compute their own hover state from the intent — change `--primary` and `.fri-button-primary` (plus its hover, focus ring, and pressed states) follows automatically.

### Surface Colors

Light by default; flipped by `.dark` or `[data-theme="dark"]`:

```css
:root {
  --background: oklch(100% 0 0);
  --foreground: oklch(21% 0.006 285);
  --muted: oklch(95% 0 0);
  --muted-foreground: oklch(45% 0.006 285);
}

.dark,
[data-theme="dark"] {
  --background: oklch(18% 0.006 285);
  --foreground: oklch(100% 0 0);
  --muted: oklch(28% 0.006 285);
  --muted-foreground: oklch(70% 0.006 285);
}
```

### Sizing Tokens

Three semantic scopes — `action` (clickable triggers), `field` (form data entry), `box` (containers):

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

Override `--size-{scope}` and every size (`xs` → `xl`) for that scope rescales together — you don't have to touch each variant.

`--radius-{scope}` is the reference at `md`. Smaller sizes get proportionally smaller corners, larger sizes get larger ones, so a pill never collapses to a square at `xs` or stretches at `xl`.

### Component-Local Tokens

A few tokens are scoped to a component rather than the global theme — override them **on the element**, not at `:root` (where the component's own class declaration would mask them).

`--grid-min` sets the minimum track width of a responsive grid (`fri-grid-cols-auto-fit` / `fri-grid-cols-auto-fill`). It defaults to `16rem` on `.fri-grid`; retune it per instance with an inline style or a selector that targets the grid:

```html
<div class="fri-grid fri-grid-cols-auto-fit" style="--grid-min: 20rem">…</div>
```

```css
.product-grid.fri-grid {
  --grid-min: 20rem;
}
```

### Tailwind Utility Aliases

Every theme variable is registered with `@theme inline`, so Tailwind v4 emits a canonical utility class for it. Use the alias instead of the arbitrary-var fallback:

```html
<!-- ✓ canonical -->
<div class="rounded-md bg-muted px-4 py-2 text-sm text-foreground">…</div>
<div class="border border-primary">…</div>

<!-- ✗ v3-era arbitrary var (still works, but verbose) -->
<div class="rounded-md bg-(--muted) px-4 py-2 text-sm text-(--foreground)">
  …
</div>
```

Available aliases:

- **Colors**: `bg-<intent>`, `text-<intent>`, `border-<intent>`, `ring-<intent>`, `fill-<intent>`, `stroke-<intent>` for every intent + foreground pair (`primary`, `primary-foreground`, …, `danger`, `danger-foreground`, `background`, `foreground`, `muted`, `muted-foreground`).
- **Radius**: `rounded-action`, `rounded-field`, `rounded-box`.
- **Border**: `border` width from `--border`.

The arbitrary-var form (`bg-(--button-background)`) stays correct for **component-local** variables that are not registered in `@theme inline`.

## Dependencies

- **tailwindcss** `^4.0.0` — required peer dependency

## Build Output

The package ships:

- `index.css` — main unminified entry point (source CSS modules under `src/`)
- `dist/index.css` — pre-compiled production bundle (generated by `pnpm build`)

## Framework Integration

Framework-agnostic — drop the stylesheet into any app that ships CSS. For React, use `@friday-sandbox/react`, which exports typed components that compose these classes.
