---
"@friday-sandbox/styles": patch
---

Renamed the component-local CSS custom properties: the per-size ramp `--_<name>-n` is now `--<name>-units` (the component's size in `--fri-spacing-xsmall` units) and the remaining `--_`-prefixed locals lost the underscore — the `--fri-*` namespace alone marks the themable API, and the rendered output is unchanged.
