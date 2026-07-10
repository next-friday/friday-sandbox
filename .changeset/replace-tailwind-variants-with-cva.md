---
"@friday-sandbox/react": patch
---

Replaced `tailwind-variants` with `class-variance-authority` as the variant-map engine: every `<name>.styles.ts` is a flat `cva(base, { variants })` map, multi-part components carry one map per part, and the rendered `fri-*` class names are unchanged.
