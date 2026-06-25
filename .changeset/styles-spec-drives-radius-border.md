---
"@friday-sandbox/styles": patch
---

Make the theme spec drive what ships. `tokens/default.spec.json` now sets `radius` as a concrete `rem` base that `scripts/formulas.js` derives the t-shirt ladder from, and `border` drives the emitted `border-width` in both the shipped `tokens.css` and the override template. The `radiusScale`, `density`, `typeScale`, and `intensity` knobs are removed from the spec and the JSON Schema, since codegen never read them. The generated override template now emits a concrete `ring` value rather than a `var()` pointer and carries a generated-file header so a hand edit is not silently overwritten. Generated CSS output is unchanged.
