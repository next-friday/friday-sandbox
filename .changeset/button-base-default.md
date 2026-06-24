---
"@friday-sandbox/styles": patch
---

A `fri-button` base class with no modifier classes now renders the default solid, primary, medium button on the plain-HTML surface — `:where(.fri-button)` applies the default color, variant, and size at zero specificity, so any explicit modifier class still overrides it. Fully-classed buttons, the modifier classes, and the React component output are unchanged.
