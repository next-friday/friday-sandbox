# Architecture

The design system follows a **Dumb Tokens, Smart Components** model — pure CSS, no build script.

For a quick reference of every derivation a Smart Component applies, see [`formulas.md`](formulas.md).

## 1. Dumb Tokens

`packages/styles/src/themes.css` exposes only plain values: OKLCH literals, `rem` sizes, keywords. **No `calc()`, no `color-mix()`, no relative color syntax at this layer.** The file maps 1-to-1 to a Figma Variables collection so designers read numbers, not formulas.

```css
:root {
  --primary: oklch(54% 0.24 264);
  --background: oklch(100% 0 0);
  --foreground: oklch(21% 0.006 285);
  --radius-action: 0.5rem;
}
```

## 2. Smart Components

Each component CSS file owns its own derivation. A base rule defines the engine once; variants only swap the input.

```css
/* packages/styles/src/components/bases/button.css */
.fri-button {
  --button-background: var(--primary);
  --button-foreground: oklch(
    from var(--button-background) clamp(0, calc((0.62 - l) * 100), 1) 0 0
  );
  --button-background-hover: color-mix(
    in oklab,
    var(--button-background) 88%,
    var(--background) 12%
  );
}
.fri-button-error {
  --button-background: var(--error);
}
```

- **Auto-foreground.** `oklch(from … clamp(…))` picks pure black or white based on the input lightness. Threshold `0.62` is WCAG-tuned.
- **Auto-hover.** `color-mix()` blends the input with the page `--background`. Hover deepens in light mode and lightens in dark mode automatically.

A new component repeats this pattern in its own CSS file. The engine is not centralized — it travels with the component.

## 3. Intent-Based Sizing

Tokens are scoped to a semantic family, not a literal component:

| Scope    | Tokens                             | Component family                         |
| -------- | ---------------------------------- | ---------------------------------------- |
| `action` | `--size-action`, `--radius-action` | button, icon-button, link-button         |
| `field`  | `--size-field`, `--radius-field`   | input, textarea, select, checkbox, radio |
| `box`    | `--size-box`, `--radius-box`       | card, modal, alert, popover              |

Each scope owns its own base unit and radius. `--size-{scope}` is the rhythm base (default `0.25rem`); component CSS computes heights inline as `calc(var(--size-{scope}) * N)` with N ∈ {6, 8, 10, 12, 14} for xs/sm/md/lg/xl (24 / 32 / 40 / 48 / 56 px at the default base).

`--radius-{scope}` is the **reference radius at `md`**. Components with size variants derive their radius linearly from height so corners stay visually proportional:

```css
.fri-button {
  --button-radius: calc(
    var(--radius-action) * var(--button-height) / (var(--size-action) * 10)
  );
}
```

At md the radius equals `--radius-action` exactly. xs/sm shrink, lg/xl grow in the same ratio. The fix is for the failure mode where a small button (24 px tall) inherits a flat radius (8 px) and looks like a pill, while a large button (56 px tall) looks square.

A new scope is added only when no existing family fits; never use a literal component name as a scope.

## 4. Minimalist Dark Mode

`.dark` (or `[data-theme="dark"]`) overrides only the four surface tokens. Intent colors stay the same. Component-derived foreground and hover follow automatically because they read `--background` at use time.

```css
.dark {
  color-scheme: dark;
  --background: oklch(18% 0.006 285);
  --foreground: oklch(95% 0.006 285);
  --muted: oklch(28% 0.006 285);
  --muted-foreground: oklch(70% 0.006 285);
}
```

## Layer locations

| Layer                  | File                                                     | Audience             |
| ---------------------- | -------------------------------------------------------- | -------------------- |
| Token source           | `packages/styles/src/themes.css`                         | designer             |
| Tailwind utility map   | `packages/styles/index.css` (`@theme inline`)            | build system         |
| Component engine + CSS | `packages/styles/src/components/<tier>/<name>.css`       | contributor          |
| Component React        | `packages/react/src/components/<tier>/<name>/<name>.tsx` | contributor          |
| Consumer docs          | `packages/react/src/stories/*.mdx`                       | consumer (Storybook) |
