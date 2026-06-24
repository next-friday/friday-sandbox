---
"@friday-sandbox/styles": minor
---

Emit the generated theme as two explicit blocks — `:root, .light, [data-theme="light"]` and `.dark, [data-theme="dark"]` — instead of `light-dark()` pairs, so each mode is a readable, independently overridable block. Document a platform-agnostic consumer theming contract: override flat CSS variables from Next.js, plain HTML, WordPress, or PHP, with no build step, plugin, or JavaScript. Token names and the `.dark` / `[data-theme="dark"]` selectors are unchanged, so existing overrides keep working.
