---
"@friday-sandbox/react": minor
"@friday-sandbox/styles": minor
---

Add a pending state to `Button` through the react-aria `isPending` prop. It overlays the `Loading` spinner without shifting layout, blocks press and hover while keeping the button focusable, and announces the pending state to assistive technologies. The spinner inherits the button foreground color and scales with the button size. Styled in CSS through the `.fri-button[data-pending]` state.
