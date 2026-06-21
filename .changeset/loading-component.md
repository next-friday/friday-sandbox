---
"@friday-sandbox/react": minor
"@friday-sandbox/styles": minor
---

Add a `Loading` progress indicator. It composes the react-aria `ProgressBar` for the `role="progressbar"` ARIA contract, spins as an indeterminate spinner by default, and renders determinate progress from a `value` when `isIndeterminate` is `false`. It supports the seven semantic `color` values and five `size` steps and stops animating under reduced motion. Exposed in CSS as the addressable `.fri-loading` classes and a new `--size-feedback` scale unit.
