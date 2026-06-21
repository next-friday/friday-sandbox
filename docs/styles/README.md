# Styles

The CSS design system that `@friday-sandbox/styles` ships and every `@friday-sandbox/react` component consumes. This chapter explains how a component's color and size are produced, gives the exact numbers in the place they are used, and ends with the rules that keep the system consistent.

## Dumb tokens, smart components

The system splits in two.

**Tokens are dumb.** `packages/styles/src/theme/default.css` holds plain values only: OKLCH literals, `rem` sizes, keywords. No `calc()`, no `color-mix()`, no relative-color syntax. A designer, or a Figma Variables collection mapped 1-to-1, reads numbers, never formulas. Every intent color ships as a pair: the color and a foreground partner authored for contrast.

```css
:root {
  --primary: oklch(57.49% 0.2084 257.52);
  --primary-foreground: oklch(100% 0 0);
  --background: oklch(100% 0 0);
  --size-action: 0.25rem;
  --radius-action: 0.5rem;
}
```

**Components are smart.** Every derivation, the sizing rhythm, the hover shade, and the focus ring, lives in the component's own CSS at `packages/styles/src/components/<tier>/<name>.css` and resolves at use time. There is no central engine to keep in sync; the logic travels with the component.

## How a component derives its look

A Smart Component reads a few inputs and computes the rest, through four mechanisms.

### Size rhythm

Height, padding-x, and radius are not hand-written per size. A component declares three `calc()` formulas once and turns a single knob, `--action-n`, per size variant. The per-size steps are themselves a named scale, so no size class carries a raw number:

```css
.fri-button {
  --action-n-xs: 7;
  --action-n-sm: 8;
  --action-n-md: 9;
  --action-n-lg: 11;
  --action-n-xl: 13;
  --action-n: var(--action-n-md); /* base default = md */
}
.fri-button-xs {
  --action-n: var(--action-n-xs);
}
```

With `--size-action: 0.25rem` and `--radius-action: 0.5rem`, the formulas derive the pixels:

| Size | `--action-n`         | Height       | Padding-x     | Radius           |
| ---- | -------------------- | ------------ | ------------- | ---------------- |
| xs   | `--action-n-xs` (7)  | 1.75rem (28) | 0.625rem (10) | 0.389rem (6.22)  |
| sm   | `--action-n-sm` (8)  | 2rem (32)    | 0.75rem (12)  | 0.444rem (7.11)  |
| md   | `--action-n-md` (9)  | 2.25rem (36) | 0.875rem (14) | 0.5rem (8)       |
| lg   | `--action-n-lg` (11) | 2.75rem (44) | 1.125rem (18) | 0.611rem (9.78)  |
| xl   | `--action-n-xl` (13) | 3.25rem (52) | 1.375rem (22) | 0.722rem (11.56) |

Pixels are at the 16px root. Override `--size-action` and the whole row scales; `--radius-action` scales only the radius column. The three formulas:

- **Height** = `--size-action × --action-n`.
- **Padding-x** = `height / 2 - --size-action`, the `px-2` to `px-6` Tailwind ladder.
- **Radius** = `--radius-action × height / (--size-action × --action-n-md)`. The divisor is pinned to the `md` step, so radius equals `--radius-action` at `md`, shrinks below, and grows above. A 28px button is never a pill and a 52px button is never square.

`action` is the only scope that currently demonstrates this rhythm. The `box` scope ships a scroll-area that derives its thickness from `--size-box` through its own `--scroll-area-n` scale, not these three formulas, and there is no `field` component yet. The shared invariant is the [semantic scope](rules/semantic-token-scope.md): each scope multiplies its own `--size-*` / `--radius-*` unit and bakes no raw length.

### Color: intent and variant

A button reads two color inputs and derives the rest. The intent pair sets the source color, then the variant decides how that color becomes a background, a foreground, and a border:

```css
.fri-button {
  --button-color: var(--primary); /* intent color */
  --button-color-foreground: var(--primary-foreground); /* its paired fg */
  --button-background: var(--button-color); /* solid default */
  --button-foreground: var(--button-color-foreground);
}
```

`--button-color` / `--button-color-foreground` are the single source. A color variant swaps both halves of that pair at once, so the foreground stays the AA-contrast partner for any palette a consumer themes. `--button-background` / `--button-foreground` / `--button-border-color` are what the rule actually paints, and the variant computes them from the pair.

#### Foreground is not computed

Foreground is never auto-derived from the background. Each intent ships a partner token authored for AA contrast, and the variant points at it:

```css
--button-color-foreground: var(--primary-foreground);
```

#### Variant axis

Six variants reshape the same intent color. The default is `solid`.

- **solid:** background is the intent color, foreground is its paired foreground, border is transparent. The filled, high-emphasis button.
- **subtle:** background is the intent color mixed toward transparent, foreground is the intent color, no border. A tinted wash.
- **surface:** background is the intent color mixed toward `--background`, foreground is the intent color, border is the intent color mixed toward transparent. A raised card-like tint.
- **outline:** background is transparent, foreground is the intent color, border is the intent color mixed toward transparent. A bordered button.
- **ghost:** background is transparent, foreground is the intent color, border is transparent. Reveals a tint only on interaction.
- **plain:** background and border are transparent with no hover or pressed change. A bare text trigger.

### Hover and pressed

Hover and pressed are derived inline with `color-mix()`. The mix percentages are named tokens, `--button-bg-mix-hover` and `--button-bg-mix-pressed`, so a consumer retunes the feel from one place. Pressed always mixes further than hover, so a press has its own feedback.

For the `solid` variant the mix blends the background toward its paired **foreground**, the AA-contrast partner:

```css
--button-bg-mix-hover: 14%;
--button-bg-mix-pressed: 24%;
--button-background-hover: color-mix(
  in srgb,
  var(--button-background),
  var(--button-color-foreground) var(--button-bg-mix-hover)
);
--button-background-pressed: color-mix(
  in srgb,
  var(--button-background),
  var(--button-color-foreground) var(--button-bg-mix-pressed)
);
```

The mix runs `in srgb`, not `in oklab`. An `oklab` mix toward a near-black foreground crushes the result toward black and reads as a flat darken; `srgb` keeps the shift perceptible. Because the blend targets a guaranteed-contrasting color, the direction is correct for any palette: a near-page-color intent no longer washes out, and the direction never flips per theme, where a dark intent lightens and a light intent darkens.

The translucent variants derive their states differently. `subtle`, `surface`, `outline`, and `ghost` mix `--button-color` toward `transparent` or toward `--background`, raising opacity on hover and again on pressed, while `plain` keeps both states transparent.

### Transitions

Timing is shared, not retyped. The `transition-base` utility carries the rhythm: `duration-100 ease-out`, plus `motion-reduce:transition-none` so reduced-motion users get none. A component adds only a `transition-[property]` utility for the properties it animates.

`transform-gpu`, a forced compositing layer, is **not** part of `transition-base`. It belongs only on an element that animates `transform` or `opacity`, where the layer keeps the animation smooth. The scroll-area scrollbar fades opacity, so it opts in; a button transitions only color, so it does not. A layer on a color-only transition buys nothing and costs memory, risks blurred text, and multiplies layers across many instances.

### All together (Button)

```css
.fri-button {
  --action-n-xs: 7;
  --action-n-sm: 8;
  --action-n-md: 9;
  --action-n-lg: 11;
  --action-n-xl: 13;
  --action-n: var(--action-n-md); /* base default = md */
  --action-height: calc(var(--size-action) * var(--action-n));
  --action-padding-x: calc(var(--action-height) / 2 - var(--size-action));
  --action-radius: calc(
    var(--radius-action) * var(--action-height) /
      (var(--size-action) * var(--action-n-md))
  );
  --button-color: var(--primary);
  --button-color-foreground: var(--primary-foreground);
  --button-bg-mix-hover: 14%;
  --button-bg-mix-pressed: 24%;
  --button-background: var(--button-color);
  --button-foreground: var(--button-color-foreground);
  --button-background-hover: color-mix(
    in srgb,
    var(--button-background),
    var(--button-color-foreground) var(--button-bg-mix-hover)
  );
  --button-background-pressed: color-mix(
    in srgb,
    var(--button-background),
    var(--button-color-foreground) var(--button-bg-mix-pressed)
  );
}

.fri-button-danger {
  --button-color: var(--danger);
  --button-color-foreground: var(--danger-foreground);
}

.fri-button-xs {
  --action-n: var(--action-n-xs);
}
```

A color variant swaps the intent pair, a size variant swaps `--action-n`, and rhythm plus color re-derive automatically.

## Semantic scopes, not component names

Sizing tokens are scoped to a **semantic family**, never to a literal component: `action` for triggers, `field` for form entry, `box` for containers. A button is an action, so it derives from `--size-action` / `--radius-action`. It never defines a `--size-button`. New components join an existing family; a new family is added only when none fits. The full rule is [`semantic-token-scope.md`](rules/semantic-token-scope.md).

## Dark mode

`.dark`, or `[data-theme="dark"]`, re-tunes the palette for a dark surface. See `theme/default.css` for the values. In dark mode the surfaces flip: `--background` becomes a soft near-black and `--foreground` an off-white, neither one pure black or white, which strain the eye. `--muted` inverts to a dark panel, and `--surface` and `--accent` swap polarity with their `*-foreground`. The intent colors lift in lightness so they stay vivid on the dark surface, keeping a white foreground except where the color is light enough to need a dark one, such as `--warning` and `--secondary`. Tokens whose value already reads in both modes inherit from `:root`.

Because every component reads these tokens at use time, derived hover and focus states follow the theme automatically, with no per-component dark rules.

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

## Theming as a consumer

Re-theming is a token override, never an edit to `components/*.css`. Set any `:root` variable in your app's CSS and every component that reads it retunes. The consumer-facing reference lives outside this handbook: see the [`@friday-sandbox/styles` README](../../packages/styles/README.md#css-variables) for the full token list and the [Themes section](../../packages/styles/README.md#themes) for light/dark setup, and browse the deployed Storybook to see each token applied across components in every state.

## Rules in this chapter

Enforced gates for writing styles. CI and the PR reviewers hold you to them:

- [`canonical-tailwind.md`](rules/canonical-tailwind.md): use a mapped token's Tailwind alias such as `bg-muted`, not the `bg-(--var)` fallback.
- [`semantic-token-scope.md`](rules/semantic-token-scope.md): size/radius tokens scoped to `action` / `field` / `box`, never a literal component name.
- [`addressable-variants.md`](rules/addressable-variants.md): every named variant/size/state is a real, addressable class; no defaults hidden in a base rule.
- [`no-magic-values.md`](rules/no-magic-values.md): every value derives from an overridable token; no raw literals or magic numbers in component CSS.

---

**Handbook:** [Hub](../README.md) · [Styles](README.md) · [React](../react/README.md) · [Tooling](../tooling/README.md) · [Contributing](../../CONTRIBUTING.md)
