---
"@friday-sandbox/react": major
"@friday-sandbox/styles": major
---

Rework the design-token roles, slots, and derivations. Add a `secondary` color role and `--fri-surface`/`--fri-field` seeds; consolidate `ring` and `selection` into `--fri-focus`; give the separator its own `--fri-separator`. Remove `--fri-link` (and `Text`'s `link` tone), `--fri-border-strong`, `--fri-border-subtle`, the native-scrollbar utilities, and `::selection` styling. Fix the `primary` role's border and outline to derive from its own color, and point `card`/`popover`/`field` at `--fri-surface`.
