---
$schema: ./theme-spec.schema.json
generated: true
pipeline: spec → validate (schema) → expand (formulas.js) → emit (color.css, theme.css, registered.css)
tier_a:
  [
    name,
    mode,
    color,
    radiusScale,
    border,
    density,
    typeScale,
    intensity,
    fontSans,
    fontMono,
  ]
derived_per_role:
  [
    hover,
    pressed,
    soft,
    soft-hover,
    soft-pressed,
    surface,
    surface-hover,
    surface-pressed,
    border,
    outline-border,
    tint-hover,
    tint-pressed,
  ]
---

# Friday Design System — theme contract

This file is the human- and machine-readable contract for a Friday theme. A theme is a
small spec validated against `theme-spec.schema.json`; `scripts/codegen.js` expands it
through `scripts/formulas.js` into the full token system — no hand-authored color
values. Edit the spec or the formula table, never the generated CSS.

## Roles

- Brand roles (each owns a full interaction ladder): primary, secondary, accent, info, success, warning, danger.
- Ground: background, foreground, neutral.
- Surface family (shadcn-compatible): muted, card, popover, input.
- `destructive` aliases `danger` (danger owns the ladder).

Every brand role derives 12 interaction rungs: hover, pressed, soft, soft-hover, soft-pressed, surface, surface-hover, surface-pressed, border, outline-border, tint-hover, tint-pressed.

## Status hue locks (enforced by the schema)

| role    | hue band |
| ------- | -------- |
| danger  | 15–35    |
| warning | 60–95    |
| success | 140–165  |
| info    | 220–260  |

An agent may tune a status role's L and C, but its hue stays in band — so red stays red.

## Invariants

- Every `--<role>` has a `--<role>-foreground` chosen for legible contrast; never set by hand.
- Button labels are five distinct sizes (xs < sm < md < lg < xl); no two adjacent sizes are pixel-identical.
- Dark mode is an explicit `.dark, [data-theme="dark"]` block (emitted after the light block), so the interaction ladder reflows per `color-scheme`.

## Worked example — "a calm fintech dark theme"

calm → low chroma (C ≤ 0.12) · fintech → blue family (hue 220–260) · dark → `mode: "dark"`.

```json
{
  "name": "Calm Fintech",
  "mode": "dark",
  "color": {
    "primary": { "l": 0.62, "c": 0.11, "h": 245 },
    "neutral": { "l": 0.65, "c": 0.01, "h": 245 },
    "background": { "l": 0.17, "c": 0, "h": 0 },
    "foreground": { "l": 0.96, "c": 0, "h": 0 }
  },
  "radiusScale": 0.75
}
```

Validate it against the schema, then run codegen to expand it into palette, ladder,
surfaces, and dark values.
