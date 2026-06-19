# Engine formulas

Every derivation a Smart Component applies, in one place. Use this as a lookup when wiring a new component.

Rhythm formulas (height, padding-x, radius) for the `action` scope are factored into the `action-rhythm` Tailwind utility in `packages/styles/src/utilities.css`. A new action component opts in with `@apply action-rhythm` and sets `--action-n` per size variant — it never needs to re-spell the rhythm math. Color formulas (foreground, hover) stay inline in each component because they are intent-driven, not rhythm-driven.

## Relation overview (`action` scope, default base)

`--size-action = 0.25rem`, `--radius-action = 0.5rem`.

| Size | N (height) | Height      | Padding-x    | Radius        |
| ---- | ---------- | ----------- | ------------ | ------------- |
| xs   | 6          | 1.5rem (24) | 0.5rem (8)   | 0.3rem (4.8)  |
| sm   | 8          | 2rem (32)   | 0.75rem (12) | 0.4rem (6.4)  |
| md   | 10         | 2.5rem (40) | 1rem (16)    | 0.5rem (8)    |
| lg   | 12         | 3rem (48)   | 1.25rem (20) | 0.6rem (9.6)  |
| xl   | 14         | 3.5rem (56) | 1.5rem (24)  | 0.7rem (11.2) |

Px values are at the browser default 16-px root. The whole row scales when `--size-action` is overridden; `--radius-action` only scales the radius column.

Derivations from the inputs:

- **Height** = `--size-action × N`
- **Padding-x** = `height / 2 - --size-action`
- **Radius** = `--radius-action × height / (--size-action × 10)`

## Auto-foreground (WCAG-safe text on intent)

```css
--{component}-foreground: oklch(
  from var(--{component}-background) clamp(0, calc((0.62 - l) * 100), 1) 0 0
);
```

| Input lightness (`l`) | Output                            |
| --------------------- | --------------------------------- |
| `l < 0.62`            | white (`L = 1`, `C = 0`, `H = 0`) |
| `l > 0.62`            | black (`L = 0`, `C = 0`, `H = 0`) |

Why pure black/white? OKLCH lightness `0.62` is the AA threshold where neither pure colour wins on every intent; clamping to the binary keeps every variant readable without per-intent overrides. Tune the threshold inline (it is hard-coded — change the literal `0.62`) if your component needs a different break.

## Auto-hover (intent blended with surface)

```css
--{component}-background-hover: color-mix(
  in oklab,
  var(--{component}-background) 88%,
  var(--background) 12%
);
```

| Theme | Resulting shift                  |
| ----- | -------------------------------- |
| light | hover is darker than the intent  |
| dark  | hover is lighter than the intent |

`--background` flips per theme, so the same recipe deepens in light mode and lightens in dark mode. Pressed/active typically reuses the hover value (`--{component}-background-pressed: var(--{component}-background-hover)`).

## Height rhythm

```css
--{component}-height: calc(var(--size-{scope}) * N);
```

`--size-{scope}` is the rhythm base (default `0.25rem`). `N` is the size variant's multiplier:

| Size | N   | Px (default base) |
| ---- | --- | ----------------- |
| xs   | 6   | 24                |
| sm   | 8   | 32                |
| md   | 10  | 40                |
| lg   | 12  | 48                |
| xl   | 14  | 56                |

A new component picks one scope (`action`, `field`, `box`) and inherits the rhythm — no per-component spacing tokens.

## Horizontal padding

```css
--{component}-padding-x: calc(var(--{component}-height) / 2 - var(--size-{scope}));
```

Padding-x sits at half the height minus one rhythm unit. At the default `--size-action: 0.25rem`:

| Size | Height | Padding-x |
| ---- | ------ | --------- |
| xs   | 24 px  | 8 px      |
| sm   | 32 px  | 12 px     |
| md   | 40 px  | 16 px     |
| lg   | 48 px  | 20 px     |
| xl   | 56 px  | 24 px     |

Matches the `px-2 … px-6` Tailwind ladder. Override `--size-action` and padding moves with it.

## Proportional radius

```css
--{component}-radius: calc(
  var(--radius-{scope}) * var(--{component}-height) / (var(--size-{scope}) * 10)
);
```

`--radius-{scope}` is the reference radius at `md`. The formula scales radius linearly with height so:

| Size | Height | Radius (at `--radius-action: 0.5rem`) |
| ---- | ------ | ------------------------------------- |
| xs   | 24 px  | 4.8 px                                |
| sm   | 32 px  | 6.4 px                                |
| md   | 40 px  | 8 px                                  |
| lg   | 48 px  | 9.6 px                                |
| xl   | 56 px  | 11.2 px                               |

The fix is for the failure mode where a small button (24 px) inherits a flat radius and looks like a pill, while a large button (56 px) looks square.

## Putting it together (Button)

```css
.fri-button {
  @apply h-(--action-height) rounded-(--action-radius) px-(--action-padding-x) action-rhythm ... ...;

  --action-n: 10;
  --button-background: var(--primary);
  --button-foreground: oklch(
    from var(--button-background) clamp(0, calc((0.62 - l) * 100), 1) 0 0
  );
  --button-background-hover: color-mix(
    in oklab,
    var(--button-background) 88%,
    var(--background) 12%
  );
  --button-background-pressed: var(--button-background-hover);
}

.fri-button-error {
  --button-background: var(--error);
}

.fri-button-xs {
  --action-n: 6;
}
```

Color variants swap `--{component}-background`. Size variants swap `--action-n`. Foreground, hover (color-driven) and height, padding-x, radius (rhythm-driven via `action-rhythm`) re-derive automatically.

## Browser support

Relative color syntax (`oklch(from …)`) and `color-mix()` are required. Supported on Safari 16.4+, Chrome 119+, Firefox 128+. Do not introduce code paths that lower this floor.
