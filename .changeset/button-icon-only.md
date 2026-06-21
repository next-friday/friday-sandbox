---
"@friday-sandbox/react": minor
"@friday-sandbox/styles": minor
---

Add an `isIconOnly` prop to `Button` for square, single-icon buttons.

Sets a square footprint equal to the button height (reusing `--action-height`, so it scales with every size) and drops the horizontal padding. Exposed in CSS as the addressable `.fri-button-icon-only` class. Pair it with an `aria-label`, since an icon-only button has no text for screen readers.
