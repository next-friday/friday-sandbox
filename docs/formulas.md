# Formulas

Every derivation a Smart Component applies, in one place — the lookup when wiring a new component. The rhythm (height, padding-x, radius) is factored into the `action-rhythm` utility in `packages/styles/src/system/utilities.css`; a component `@apply`s it and sets `--action-n`. Color (hover, pressed) stays inline because it is intent-driven, not rhythm-driven. For _why_ the system is built this way, see [`architecture.md`](architecture.md).

## Rhythm reference (`action` scope, default base)

`--size-action = 0.25rem`, `--radius-action = 0.5rem`. One knob — `--action-n` — drives the whole row:

| Size | `--action-n` | Height      | Padding-x    | Radius        |
| ---- | ------------ | ----------- | ------------ | ------------- |
| xs   | 6            | 1.5rem (24) | 0.5rem (8)   | 0.3rem (4.8)  |
| sm   | 8            | 2rem (32)   | 0.75rem (12) | 0.4rem (6.4)  |
| md   | 10           | 2.5rem (40) | 1rem (16)    | 0.5rem (8)    |
| lg   | 12           | 3rem (48)   | 1.25rem (20) | 0.6rem (9.6)  |
| xl   | 14           | 3.5rem (56) | 1.5rem (24)  | 0.7rem (11.2) |

Pixels are at the 16px root. Override `--size-action` and the whole row scales; `--radius-action` scales only the radius column. The other scopes (`field`, `box`) follow the same three formulas against their own `--size-*` / `--radius-*`.

The derivations the `action-rhythm` utility computes:

- **Height** = `--size-action × --action-n`
- **Padding-x** = `height / 2 − --size-action` — matches the `px-2 … px-6` Tailwind ladder.
- **Radius** = `--radius-action × height / (--size-action × 10)` — equals `--radius-action` exactly at `md`, shrinks below and grows above, so a 24px button is never a pill and a 56px button is never square.

## Foreground (paired token)

Foreground is **not** computed. Each intent ships a partner token, authored for AA contrast, that the component points at:

```css
--button-foreground: var(--primary-foreground);
```

A color variant swaps both halves of the pair (`--button-background` and `--button-foreground`), so contrast holds for any palette a consumer themes.

## Hover and pressed (`color-mix`)

```css
--button-background-hover: color-mix(
  in oklab,
  var(--button-background) 88%,
  var(--background) 12%
);
--button-background-pressed: var(--button-background-hover);
```

`--background` flips per theme, so the one recipe deepens the hover in light mode and lightens it in dark mode. Pressed reuses the hover value.

## Putting it together (Button)

```css
.fri-button {
  @apply action-rhythm ...; /* height, padding-x, radius from --action-n */

  --action-n: 10; /* md */
  --button-background: var(--primary);
  --button-foreground: var(--primary-foreground);
  --button-background-hover: color-mix(
    in oklab,
    var(--button-background) 88%,
    var(--background) 12%
  );
  --button-background-pressed: var(--button-background-hover);
}

.fri-button-danger {
  --button-background: var(--danger);
  --button-foreground: var(--danger-foreground);
}

.fri-button-xs {
  --action-n: 6;
}
```

A color variant swaps the intent pair; a size variant swaps `--action-n`; rhythm and color re-derive automatically.
