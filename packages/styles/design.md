---
generated: true
namespace: --fri-*
pipeline: spec -> validate (schema) -> derive (formulas.js) -> emit (tokens.css, tailwind.css, registered.css)
---

# Friday Design System — token contract

Generated from `tokens/default.spec.json` through `scripts/formulas.js`. Every
token is `--fri-*` prefixed; every colour mix is `color-mix(in oklab, …)`. Edit
the spec or the formula table, never the generated CSS.

## Two tiers

- **Tier 1 (consumer base):** brand `primary/secondary/accent`, status `info/success/warning/danger` (each + `-foreground`); ground `background/foreground/neutral`; `ring`; the radius and spacing scales; type, motion, and z-index. A consumer sets these; the system derives the rest.
- **Tier 2 (derived):** the 12-rung interaction ladder (hover, pressed, soft, soft-hover, soft-pressed, surface, surface-hover, surface-pressed, border, outline-border, tint-hover, tint-pressed) per brand role; surfaces (card, popover, field, surface, surface-strong, inverse, overlay) derived from the ground; text tiers (foreground-muted, foreground-faint); border tiers (border-strong, border, border-subtle). Public and overridable, but names freeze only at the first stable release.

## Emission

Token definitions live in `@layer theme`; the derived system is emitted under
`:root, [data-theme]` so a nested `[data-theme]` scope recomputes its own
`color-mix` against that scope's ground. The `@theme inline` Tailwind map is
emitted unlayered in `tailwind.css`. `@property` registers the base colours as
progressive enhancement with a static `initial-value`.
