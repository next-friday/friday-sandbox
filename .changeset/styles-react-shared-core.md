---
"@friday-sandbox/styles": major
"@friday-sandbox/react": major
---

Make `@friday-sandbox/styles` the shared CSS + JS core and move the component variant maps into it.

- `@friday-sandbox/styles` now ships JavaScript: each component's `tv()` variant map lives at `src/components/<name>/<name>.styles.ts` and is exported from `@friday-sandbox/styles/components/<name>`. The package builds a JS bundle with `tsdown` alongside the CSS and gains `tailwind-variants` as a dependency.
- The theme layer is reorganized into a multi-theme-ready tree: `src/themes/shared/` (the `@theme` map, type scale, `@property` registrations, the shadcn/Tailwind `compat.css`) and `src/themes/default/` (token values). New `src/utilities/` (`@utility` helpers) and `src/variants/` (`@custom-variant` `dark`, `motion-reduce`, `motion-safe`) layers. The `./compat` export now resolves to `themes/shared/compat.css`.
- `@friday-sandbox/react` no longer declares component variant maps; each component imports its map from `@friday-sandbox/styles/components/<name>`, and the `tailwind-variants` dependency is dropped.

BREAKING CHANGE: `@friday-sandbox/styles` adds the `./components/*` export, ships JS, and moves the `./compat` export path. `@friday-sandbox/react` now requires `@friday-sandbox/styles` to provide the component variant maps.
