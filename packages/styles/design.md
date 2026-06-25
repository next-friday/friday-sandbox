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
- **Tier 2 (derived):** the 12-rung interaction ladder (hover, pressed, soft, soft-hover, soft-pressed, surface, surface-hover, surface-pressed, border, outline-border, tint-hover, tint-pressed) per brand role; surfaces (card, popover, field, fill, fill-strong, inverse, overlay) derived from the ground; text tiers (foreground-muted, foreground-faint); border tiers (border-strong, border, border-subtle). Public and overridable, but names freeze only at the first stable release.

## Emission

Token definitions live in `@layer theme`; the derived system is emitted under
`:root, [data-theme]` so a nested `[data-theme]` scope recomputes its own
`color-mix` against that scope's ground. The `@theme inline` Tailwind map is
emitted unlayered in `tailwind.css`. `@property` registers the base colours as
progressive enhancement with a static `initial-value`.

## Declared grammar exceptions

These irregularities are intentional and declared, not accidental:

- **Scale vocabularies.** `spacing` is the full scale (2xs to 4xl). `gap` is a deliberate subset of it (xs to xl). `radius` carries the semantic endpoints `none` and `full` around an xs to xl range. The differences are by design, not omissions.
- **Dark re-declarations.** `background`, `foreground`, `accent` and `accent-foreground` are emitted twice, once light and once under the dark scope, because they flip with the ground.
- **Geometry archetypes.** `--fri-<archetype>-radius` and `--fri-<archetype>-size` (action, field, box, feedback) are single default values, role-led to mirror the colour grammar. `size` is the default block-axis control dimension, that is a control height, not an icon size, a width, or a spacing unit. Per-size variants are produced inside each component from local `--_*` variables and are not public tokens.
- **Interaction ladder state coverage.** `soft` and `surface` are stateful fills with base, hover and pressed rungs. `tint` is an interaction-only overlay with hover and pressed and no base, by design. `border` and `outline-border` are static line colours with no interaction rungs.
- **Private variables.** Custom properties beginning `--_` are component-internal and carry no SemVer guarantee. Only `--fri-*` is the public contract.
