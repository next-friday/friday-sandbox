---
paths:
  - "packages/**"
---

# Rule: token pipeline — four layers, one job each

The theme is **hand-authored CSS variables** organised into four layers, each
with one job. A value lives in one place by its nature — a **color seed** in a
theme's `tokens.css`, a theme-agnostic **scale** in `shared/scales.css`, a
**derivation** in `shared/variables.css` — and `theme.css` bridges them to
Tailwind. The pipeline never redefines a Tailwind theme variable, save
the `--font-sans`/`--font-mono` exception.

1. **`src/themes/<name>/tokens.css` — the theme's color seeds.** Base, constant
   `--fri-*` colors with **no `calc()` or `var()`**: the ground (background,
   stroke, the foreground text tiers), the surface fills (base and
   `-secondary`), the brand/status roles (each seeding its base, `-foreground`,
   `-secondary`, `-secondary-foreground`), and focus. Declared per mode in the
   light/dark blocks; a new theme is one such file under its own
   `[data-theme="<name>"]` selector, and everything below applies to it
   unchanged. `src/themes/shared/scales.css` holds the theme-agnostic
   constants — the spacing / type / motion / radius scales and the radius
   archetypes (`--fri-action/field/box-radius`, set directly) — declared once
   on `:root`.
2. **`src/themes/shared/variables.css` — computed + semantic.** Everything derived
   from the color seeds through runtime `color-mix()`/`var()`: the per-role
   interaction ladder (hover and pressed for the base and `-secondary` pairs,
   border, outline-border, tint), the surface outline-border (an alias of
   `--fri-stroke`), and the stroke-derived
   lines (`--fri-border`, `--fri-separator`, the scroll tokens). Its selectors
   (`:root`, `.light`, `.dark`, `[data-theme]`) match every theme, so any theme
   defining the seeds gets the ladder free —
   a family itself is a seed in `tokens.css`, only its ladder is derived
   here. The interaction mix ratios (`--fri-mix-*`) also live here, declared per
   mode: internal constants the `color-mix()` derivations consume, not consumer
   seeds — the one non-derived value the file holds.
3. **`src/tailwind/theme.css` — the Tailwind bridge.** One `@theme inline`
   block maps `--fri-*` onto Tailwind theme variables (`--color-*`,
   `--spacing-*`, `--radius-action/…`, `--text-*`) so they
   emit semantic utilities (`bg-primary`, `gap-small`, `rounded-action`). It
   **adds new names only** — Tailwind's own defaults
   (`--radius-sm`, `--ease-*`, bare `--spacing`) stay native
   so a consumer can still use them — save the `--font-sans`/`--font-mono`
   exception.
4. **`src/components/<name>.css` — consume + component-local calc.**
   Components apply the semantic utilities and add only the arithmetic unique to
   that component, driven by a local ramp (`--<name>-units` — the component's
   size in `--fri-spacing-xsmall` units). Component-local custom properties are
   bare `--<name>-*` names: the `--fri-*` namespace alone marks what a consumer
   may override, so internals never carry it. Every
   `.fri-*` rule (and every base element rule) styles through `@apply` **only** —
   a raw CSS property is a bug when a utility exists. A property Tailwind has no
   utility for (`grid-template-columns: repeat(auto-fit…)`,
   `font: inherit`) is defined once as a named `@utility` in `layers/utilities.css`
   (see `status-disabled`) and `@apply`-ed; raw declarations live
   only in `@utility` bodies and the token layer. Custom-property defs (`--*`, the
   ramp multiplier) are var machinery and stay. The `lint:symmetry` apply-only
   dimension enforces this.

**Worked example — radius.** `shared/scales.css` holds two static sets: the generic
scale (`--fri-radius-xsmall … xlarge`; for a `radius` prop or a consumer's own
`rounded-(--fri-radius-medium)`) and the per-component archetypes
(`--fri-action-radius`, `--fri-box-radius`) a consumer sets directly.
`theme.css` maps the archetypes to `rounded-action/field/box`; `button.css`
scales its archetype per size:

```css
--button-radius: calc(var(--fri-action-radius) * var(--button-units) / 10);
```

Radius is fully static, so it never touches `shared/variables.css`.

Components consume spacing and size through the **semantic Tailwind alias** —
`gap-small`, `p-medium`, `bg-primary` — never a raw numeric (`gap-2`) or a bare
`gap-(--fri-*)` var form when an alias exists. There is no spec, no codegen, no
generated file — edit the CSS directly. A11y contrast is the author's
responsibility — verify text/surface pairs against the APCA/WCAG floor when
changing a color.

Pairs with styles-upstream (a missing token is added upstream first) and
class-name-contract (where the consumed utilities land).
