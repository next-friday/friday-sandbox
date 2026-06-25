---
"@friday-sandbox/styles": major
---

Namespace every design token as `--fri-*` and restructure the generated CSS into two public override tiers: a small Tier-1 base palette a consumer sets, and the Tier-2 derived system (the interaction ladder, surfaces, text and border tiers) computed from it. Surfaces derive from the ground so a single `--fri-background` override reflows the UI; tokens emit in `@layer theme` scoped per `[data-theme]` so nested themes recompute, and the `@theme inline` Tailwind map is emitted unlayered. Ships an opt-in unprefixed compatibility adapter (`@friday-sandbox/styles/compat`) and a copy-paste override template (`@friday-sandbox/styles/template`).

BREAKING CHANGE: every CSS custom property is renamed from `--<token>` to `--fri-<token>`. Migrate overrides, or import the compatibility adapter for the unprefixed shadcn/Tailwind names.
