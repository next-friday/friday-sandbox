---
"@friday-sandbox/styles": minor
---

Add a `--ring` focus-color token, its `outline-ring` and `ring-ring` Tailwind aliases, and a global `focus-ring` utility, then give `Button` a visible focus ring built from them. The ring shows on keyboard focus through both the native `:focus-visible` pseudo-class and the `data-focus-visible` attribute, so it works for the React component and for plain HTML. The previous styles removed the outline without restoring a focus indicator.
