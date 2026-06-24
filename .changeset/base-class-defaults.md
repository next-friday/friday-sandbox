---
"@friday-sandbox/styles": patch
---

Every base component class now renders its default variant on its own, so hand-written HTML needs no modifier classes for a usable default. A zero-specificity `:where(.fri-<name>)` selector bakes each component's default — button (solid / primary / md), spinner (primary / md), scroll-area (md), separator (horizontal), and grid (single column) — so any explicit modifier class, and any consumer override, still wins. The spinner's duplicated color default folds into the same mechanism. Fully-classed usage and the React component output are unchanged; flex and text already rendered their defaults (CSS-initial and inherited) and stay as-is.
