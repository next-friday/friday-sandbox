---
"@friday-sandbox/styles": minor
---

Register the theme's knob tokens with `@property` (generated `src/theme/registered.css`): the brand and surface-family colors as `<color>`, and `--space`, `--ring-width`, `--ring-offset-width`, `--disabled-opacity` as typed scalars. This gives the upcoming theme builder typed, animatable, guarded inputs, and lets browsers without `light-dark()` fall back to the light `initial-value` instead of dropping the declaration.
