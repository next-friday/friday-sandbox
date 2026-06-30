---
"@friday-sandbox/styles": major
---

Drop the token codegen pipeline: the theme is now hand-authored CSS. Remove the spec (`tokens/default.spec.json`), its JSON Schema, and the build scripts that derived the theme (codegen, the APCA/WCAG contrast gate, and the color math behind it). The shipped token values are unchanged — base roles stay flat `oklch` and the interaction ladder, surfaces, and tiers still derive from them via runtime `color-mix`; only the build-time generation and validation steps are gone. Theming now means editing the theme CSS directly, keeping the `@theme` map in sync with the token names by hand.

BREAKING CHANGE: the `./schema` and `./tokens` package subpath exports are removed (they pointed at the deleted spec and JSON Schema). Customize the theme through the hand-authored CSS, not a spec file.
