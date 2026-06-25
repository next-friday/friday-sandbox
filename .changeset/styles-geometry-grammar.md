---
"@friday-sandbox/styles": major
---

Regularize the geometry token grammar so component implementation details no longer sit in the public `--fri-*` contract. Per-component geometry ramps (`--fri-button-*`, `--fri-scroll-area-*`, `--fri-spinner-*`, `--fri-separator-*`) move into component-local `--_*` variables, and the redundant `--fri-size` base unit is dropped in favour of `--fri-spacing-xs`. Geometry archetypes become role-led to mirror the colour grammar (`--fri-radius-action` becomes `--fri-action-radius`) and gain a symmetric default-size set (`--fri-action-size`, `--fri-field-size`, `--fri-box-size`, `--fri-feedback-size`). The neutral fill tiers rename from `--fri-surface`/`--fri-surface-strong` to `--fri-fill`/`--fri-fill-strong`, reserving `surface` for the per-role interaction ladder rung. The declared grammar exceptions (scale subsets, semantic endpoints, ladder state coverage, and the `--_` private-variable convention) are published in `design.md`.

BREAKING CHANGE: the public `--fri-button-*`, `--fri-scroll-area-*`, `--fri-spinner-*`, `--fri-separator-*` and `--fri-size` tokens are removed and are now component-internal; `--fri-radius-<archetype>` is renamed to `--fri-<archetype>-radius`; `--fri-surface`/`--fri-surface-strong` are renamed to `--fri-fill`/`--fri-fill-strong`.
