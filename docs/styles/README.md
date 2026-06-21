# Styles

The CSS design system that `@friday-sandbox/styles` ships and every `@friday-sandbox/react` component consumes. This chapter explains how a component's colour and size are produced, gives the exact numbers in the place they are used, and ends with the rules that keep the system consistent.

## Dumb tokens, smart components

The system splits in two.

**Tokens are dumb.** `packages/styles/src/theme/default.css` holds plain values only: OKLCH literals, `rem` sizes, keywords. No `calc()`, no `color-mix()`, no relative-color syntax. A designer, or a Figma Variables collection mapped 1-to-1, reads numbers, never formulas. Every intent colour ships as a **pair**, the colour and a foreground partner authored for contrast:

```css
:root {
  --primary: oklch(54% 0.24 264);
  --primary-foreground: oklch(100% 0 0);
  --background: oklch(100% 0 0);
  --size-action: 0.25rem;
  --radius-action: 0.5rem;
}
```

**Components are smart.** Every derivation, sizing rhythm, hover shade, and focus ring, lives in the component's own CSS at `packages/styles/src/components/<tier>/<name>.css` and resolves at use time. There is no central engine to keep in sync; the logic travels with the component.

## How a component derives its look

A Smart Component reads a few inputs and computes the rest, through three mechanisms.

### Size rhythm

Height, padding-x, and radius are not hand-written per size. A component declares three `calc()` formulas once and turns a single knob, `--action-n`, per size variant. The formulas derive the pixels:

`--size-action = 0.25rem`, `--radius-action = 0.5rem`:

| Size | `--action-n` | Height       | Padding-x     | Radius           |
| ---- | ------------ | ------------ | ------------- | ---------------- |
| xs   | 7            | 1.75rem (28) | 0.625rem (10) | 0.389rem (6.22)  |
| sm   | 8            | 2rem (32)    | 0.75rem (12)  | 0.444rem (7.11)  |
| md   | 9            | 2.25rem (36) | 0.875rem (14) | 0.5rem (8)       |
| lg   | 11           | 2.75rem (44) | 1.125rem (18) | 0.611rem (9.78)  |
| xl   | 13           | 3.25rem (52) | 1.375rem (22) | 0.722rem (11.56) |

Pixels are at the 16px root. Override `--size-action` and the whole row scales; `--radius-action` scales only the radius column. The three formulas:

- **Height** = `--size-action × --action-n`
- **Padding-x** = `height / 2 − --size-action`, the `px-2 … px-6` Tailwind ladder.
- **Radius** = `--radius-action × height / (--size-action × 9)`. It equals `--radius-action` at `md`, shrinks below and grows above, so a 28px button is never a pill and a 52px button is never square.

The `field` and `box` scopes follow the same three formulas against their own `--size-*` / `--radius-*`.

### Foreground

Foreground is **not** computed. Each intent ships a partner token authored for AA contrast, and the component points at it. A colour variant swaps both halves of the pair, so contrast holds for any palette a consumer themes:

```css
--button-foreground: var(--primary-foreground);
```

### Hover and pressed

Derived inline with `color-mix()`, blending the background toward its paired **foreground**, the AA-contrast partner. Blending toward a guaranteed-contrasting colour gives a perceptible, correct-direction shift for any palette a consumer themes: a near-page-colour intent no longer washes out, and the direction never flips per theme, where a dark intent lightens and a light intent darkens. Pressed blends further than hover, so a press has its own feedback:

```css
--button-background-hover: color-mix(
  in oklab,
  var(--button-background),
  var(--button-foreground) 10%
);
--button-background-pressed: color-mix(
  in oklab,
  var(--button-background),
  var(--button-foreground) 18%
);
```

### Transitions

Timing is shared, not retyped. The `transition-base` utility carries the rhythm: `duration-100 ease-out`, plus `motion-reduce:transition-none` so reduced-motion users get none. A component adds only `transition-[…]` for the properties it animates.

`transform-gpu`, a forced compositing layer, is **not** part of `transition-base`. It belongs only on an element that animates `transform` or `opacity`, where the layer keeps the animation smooth. The scroll-area scrollbar fades opacity, so it opts in; a button transitions only colour, so it does not. A layer on a colour-only transition buys nothing and costs memory, risks blurred text, and multiplies layers across many instances.

### All together (Button)

```css
.fri-button {
  --action-n: 9; /* md */
  --action-height: calc(var(--size-action) * var(--action-n));
  --action-padding-x: calc(var(--action-height) / 2 - var(--size-action));
  --action-radius: calc(
    var(--radius-action) * var(--action-height) / (var(--size-action) * 9)
  );
  --button-background: var(--primary);
  --button-foreground: var(--primary-foreground);
  --button-background-hover: color-mix(
    in oklab,
    var(--button-background),
    var(--button-foreground) 10%
  );
  --button-background-pressed: color-mix(
    in oklab,
    var(--button-background),
    var(--button-foreground) 18%
  );
}

.fri-button-danger {
  --button-background: var(--danger);
  --button-foreground: var(--danger-foreground);
}

.fri-button-xs {
  --action-n: 7;
}
```

A colour variant swaps the intent pair; a size variant swaps `--action-n`; rhythm and colour re-derive automatically.

## Semantic scopes, not component names

Sizing tokens are scoped to a **semantic family**, never to a literal component: `action` for triggers, `field` for form entry, `box` for containers. A button is an action, so it derives from `--size-action` / `--radius-action`. It never defines a `--size-button`. New components join an existing family; a new family is added only when none fits.

## Dark mode

`.dark`, or `[data-theme="dark"]`, re-tunes the palette for a dark surface. See `theme/default.css` for the values. The surfaces flip: `--background` to a soft near-black, `--foreground` to an off-white, never pure black/white, which strain the eye; `--muted` inverts to a dark panel; `--surface` and `--accent` swap polarity with their `*-foreground`; the intent colours lift in lightness so they stay vivid on the dark surface, keeping a white foreground except where the colour is light enough to need a dark one, such as `--warning` and `--secondary`. Tokens whose value already reads in both modes inherit from `:root`. Because every component reads these tokens at use time, derived hover and focus states follow the theme automatically, with no per-component dark rules.

```css
.dark {
  color-scheme: dark;
  --background: oklch(18% 0 0);
  --foreground: oklch(95% 0 0);
  --surface: oklch(95% 0 0); /* swapped */
  --surface-foreground: oklch(20.9% 0 0);
  --primary: oklch(64% 0.18 257.52); /* lifted, keeps white foreground */
  --muted: oklch(30% 0.006 228.83); /* inverted panel */
}
```

## Rules in this chapter

Enforced gates for writing styles. CI and the PR reviewers hold you to them:

- [`canonical-tailwind.md`](rules/canonical-tailwind.md): use a mapped token's Tailwind alias such as `bg-muted`, not the `bg-(--var)` fallback.
- [`semantic-token-scope.md`](rules/semantic-token-scope.md): size/radius tokens scoped to `action` / `field` / `box`, never a literal component name.
- [`addressable-variants.md`](rules/addressable-variants.md): every named variant/size/state is a real, addressable class; no defaults hidden in a base rule.
- [`no-magic-values.md`](rules/no-magic-values.md): every value derives from an overridable token; no raw literals or magic numbers in component CSS.
