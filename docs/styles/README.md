# Styles

The CSS design system that `@friday-sandbox/styles` ships and every `@friday-sandbox/react` component consumes. This chapter explains how a component's colour and size are produced, gives the exact numbers in the place they are used, and ends with the rules that keep the system consistent.

## Dumb tokens, smart components

The system splits in two.

**Tokens are dumb.** `packages/styles/src/theme/default.css` holds plain values only — OKLCH literals, `rem` sizes, keywords. No `calc()`, no `color-mix()`, no relative-color syntax. A designer, or a Figma Variables collection mapped 1-to-1, reads numbers, never formulas. Every intent colour ships as a **pair** — the colour and a foreground partner authored for contrast:

```css
:root {
  --primary: oklch(54% 0.24 264);
  --primary-foreground: oklch(100% 0 0);
  --background: oklch(100% 0 0);
  --size-action: 0.25rem;
  --radius-action: 0.5rem;
}
```

**Components are smart.** Every derivation — sizing rhythm, hover shade, focus ring — lives in the component's own CSS (`packages/styles/src/components/<tier>/<name>.css`) and resolves at use time. There is no central engine to keep in sync; the logic travels with the component.

## How a component derives its look

A Smart Component reads a few inputs and computes the rest, through three mechanisms.

### Size rhythm

Height, padding-x, and radius are not hand-written per size. A component declares three `calc()` formulas once and turns a single knob, `--action-n`, per size variant. The formulas derive the pixels:

`--size-action = 0.25rem`, `--radius-action = 0.5rem`:

| Size | `--action-n` | Height      | Padding-x    | Radius        |
| ---- | ------------ | ----------- | ------------ | ------------- |
| xs   | 6            | 1.5rem (24) | 0.5rem (8)   | 0.3rem (4.8)  |
| sm   | 8            | 2rem (32)   | 0.75rem (12) | 0.4rem (6.4)  |
| md   | 10           | 2.5rem (40) | 1rem (16)    | 0.5rem (8)    |
| lg   | 12           | 3rem (48)   | 1.25rem (20) | 0.6rem (9.6)  |
| xl   | 14           | 3.5rem (56) | 1.5rem (24)  | 0.7rem (11.2) |

Pixels are at the 16px root. Override `--size-action` and the whole row scales; `--radius-action` scales only the radius column. The three formulas:

- **Height** = `--size-action × --action-n`
- **Padding-x** = `height / 2 − --size-action` — the `px-2 … px-6` Tailwind ladder.
- **Radius** = `--radius-action × height / (--size-action × 10)` — equals `--radius-action` at `md`, shrinks below and grows above, so a 24px button is never a pill and a 56px button is never square.

The `field` and `box` scopes follow the same three formulas against their own `--size-*` / `--radius-*`.

### Foreground

Foreground is **not** computed. Each intent ships a partner token authored for AA contrast, and the component points at it. A colour variant swaps both halves of the pair, so contrast holds for any palette a consumer themes:

```css
--button-foreground: var(--primary-foreground);
```

### Hover and pressed

Derived inline with `color-mix()`, blending the background toward its paired **foreground** — the AA-contrast partner. Blending toward a guaranteed-contrasting colour gives a perceptible, correct-direction shift for any palette a consumer themes: a near-page-colour intent no longer washes out, and the direction never flips per theme (a dark intent lightens, a light intent darkens). Pressed blends further than hover, so a press has its own feedback:

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

### All together (Button)

```css
.fri-button {
  --action-n: 10; /* md */
  --action-height: calc(var(--size-action) * var(--action-n));
  --action-padding-x: calc(var(--action-height) / 2 - var(--size-action));
  --action-radius: calc(
    var(--radius-action) * var(--action-height) / (var(--size-action) * 10)
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
  --action-n: 6;
}
```

A colour variant swaps the intent pair; a size variant swaps `--action-n`; rhythm and colour re-derive automatically.

## Semantic scopes, not component names

Sizing tokens are scoped to a **semantic family**, never to a literal component: `action` (triggers), `field` (form entry), `box` (containers). A button is an action, so it derives from `--size-action` / `--radius-action` — it never defines a `--size-button`. New components join an existing family; a new family is added only when none fits.

## Dark mode

`.dark` (or `[data-theme="dark"]`) overrides only the four surface tokens — `--background`, `--foreground`, `--muted`, `--muted-foreground`. Intent colours are untouched. Because every component reads `--background` at use time, derived hover and focus states follow the theme automatically, with no per-component dark rules.

```css
.dark {
  color-scheme: dark;
  --background: oklch(18% 0.006 285);
  --foreground: oklch(95% 0.006 285);
  --muted: oklch(28% 0.006 285);
  --muted-foreground: oklch(70% 0.006 285);
}
```

## Rules in this chapter

Enforced gates for writing styles — CI and the PR reviewers hold you to them:

- [`canonical-tailwind.md`](rules/canonical-tailwind.md) — use a mapped token's Tailwind alias (`bg-muted`), not the `bg-(--var)` fallback.
- [`semantic-token-scope.md`](rules/semantic-token-scope.md) — size/radius tokens scoped to `action` / `field` / `box`, never a literal component name.
- [`addressable-variants.md`](rules/addressable-variants.md) — every named variant/size/state is a real, addressable class; no defaults hidden in a base rule.
- [`no-magic-values.md`](rules/no-magic-values.md) — every value derives from an overridable token; no raw literals or magic numbers in component CSS.
