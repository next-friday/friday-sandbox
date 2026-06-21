---
"@friday-sandbox/styles": minor
"@friday-sandbox/react": minor
---

Add a dark theme and move the colour tokens to OKLCH.

- Every `:root` colour token is authored in OKLCH; the new `--surface` / `--surface-foreground` pair joins the scale.
- `.dark` / `[data-theme="dark"]` ships a tuned dark palette: flipped surfaces, lifted intent colours, and swapped `--surface` / `--accent`.
- Remove the unused `--muted-foreground` and `--neutral-foreground` tokens and the Button `neutral` colour.
- Storybook gains a light/dark theme toolbar that paints the preview from the package tokens.
