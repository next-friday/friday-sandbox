---
"@friday-sandbox/styles": minor
---

Move component computation (color-mix, calc, gradients) into the semantic layer and consume it through the Tailwind mapping, so component CSS only references finished tokens. Define the `--surface`/`--surface-foreground` tokens and add the `bg-scroll-thumb`, `bg-scroll-thumb-hover`, and `bg-scroll-track` utilities.
