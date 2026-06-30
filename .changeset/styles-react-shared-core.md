---
"@friday-sandbox/styles": major
"@friday-sandbox/react": major
---

Make `@friday-sandbox/styles` the shared CSS + JS core and adopt a layered, per-mode theme architecture.

- **Variant maps in the core.** Each component's `tv()` variant map lives at `src/components/<name>/<name>.styles.ts` and is exported from `@friday-sandbox/styles/components/<name>`. The package builds a JS bundle (Rollup) alongside its CSS and gains `tailwind-variants` as a dependency; `@friday-sandbox/react` imports each map from here and drops `tailwind-variants`.
- **Root CSS layout.** The CSS lives at the package root in `base/`, `components/` (one file per component), `themes/`, `utilities/`, and `variants/`; `src/` holds only TypeScript (the variant maps, `src/index.ts`, `src/utils/`). The build copies the CSS tree into `dist/` and emits a per-component JS bundle.
- **Per-mode token model.** `themes/default/variables.css` declares the base roles, surfaces, and emphasis tiers explicitly in the light and dark blocks; only the per-role interaction ladder derives via runtime `color-mix`. `themes/shared/` holds the `@theme` map; `utilities/` and `variants/` add `@utility` helpers and the `dark`/`motion-reduce`/`motion-safe` variants.

BREAKING CHANGE: `@friday-sandbox/styles` adds the `./components/*` export and ships JS. `@friday-sandbox/react` now requires `@friday-sandbox/styles` to provide the component variant maps.
