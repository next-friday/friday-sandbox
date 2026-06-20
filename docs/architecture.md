# Architecture

Why the design system is shaped the way it is. This page explains the model; the numbers behind it live in [`formulas.md`](formulas.md), the rules that enforce it in [`conventions/`](conventions/), and where each layer sits in [`build.md`](build.md#where-each-layer-lives).

## Dumb tokens, smart components

The system splits cleanly in two.

**Tokens are dumb.** `packages/styles/src/theme/default.css` holds plain values only — OKLCH literals, `rem` sizes, keywords. No `calc()`, no `color-mix()`, no relative-color syntax. A designer, or a Figma Variables collection mapped 1-to-1, reads numbers, never formulas.

```css
:root {
  --primary: oklch(54% 0.24 264);
  --primary-foreground: oklch(100% 0 0);
  --background: oklch(100% 0 0);
  --radius-action: 0.5rem;
}
```

**Components are smart.** Every derivation — sizing rhythm, hover shade, focus ring — lives in the component's own CSS and resolves at use time. There is no central engine to keep in sync; the logic travels with the component.

## How a component derives

A Smart Component reads a few inputs and computes the rest:

- **Rhythm** (height, padding-x, radius) comes from a shared scope utility. An action component writes `@apply action-rhythm` and sets one knob — `--action-n` — per size variant; the utility derives the pixels.
- **Foreground** is a paired token: each intent color ships a `--<color>-foreground` partner authored for AA contrast, and the component points at it. Contrast is a design decision, not a runtime computation.
- **Hover and pressed** are derived inline with `color-mix()`, blending the intent with the page `--background`.

```css
.fri-button {
  @apply action-rhythm ...;
  --action-n: 10; /* md */
  --button-background: var(--primary);
  --button-foreground: var(--primary-foreground);
  --button-background-hover: color-mix(
    in oklab,
    var(--button-background) 88%,
    var(--background) 12%
  );
}
.fri-button-danger {
  --button-background: var(--danger);
  --button-foreground: var(--danger-foreground);
}
```

A color variant swaps the intent pair; a size variant swaps `--action-n`; everything else re-derives. The exact math is in [`formulas.md`](formulas.md).

## Semantic scopes, not component names

Sizing tokens are scoped to a **semantic family**, never to a literal component: `action` (triggers), `field` (form entry), `box` (containers). A button is an action, so it inherits `--size-action` / `--radius-action` and the `action-rhythm` utility — it never defines a `--size-button`. New components join an existing family; a new family is added only when none fits. Enforced by [`conventions/semantic-token-scope.md`](conventions/semantic-token-scope.md).

## Minimal dark mode

`.dark` (or `[data-theme="dark"]`) overrides only the four surface tokens — `--background`, `--foreground`, `--muted`, `--muted-foreground`. Intent colors are untouched. Because every component reads `--background` at use time, derived hover and focus states follow the theme automatically, with no per-component dark rules.

```css
.dark {
  color-scheme: dark;
  --background: oklch(18% 0.006 285);
  --foreground: oklch(95% 0.006 285);
  --muted: oklch(28% 0.006 285);
  --muted-foreground: oklch(70% 0.006 285);
}
```
