---
"@friday-sandbox/react": patch
---

Import each react-aria-components part by its per-component subpath (`react-aria-components/Button`, `/Text`, `/Separator`, and the `composeRenderProps` helper) instead of the package barrel, so a consumer's bundler can drop the unused rest of the library. Storybook and the Vitest stories pin these subpaths via `optimizeDeps.include`. No public API or rendered output changes.
