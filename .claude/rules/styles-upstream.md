---
paths:
  - "packages/**"
---

# Rule: styles upstream — styles feeds react, never the reverse

`friday-sandbox` is an accessible React component library paired with a
framework-agnostic design-token system: a component's look is driven entirely
by design tokens, so theming is plain CSS variables with no build step, and the
React API stays accessible (built on `react-aria-components`).

`@friday-sandbox/styles` is the **upstream source of truth** — design tokens,
the Tailwind v4 `@theme` map, shared utilities, and one CSS file per component
holding its visual rules. It ships **CSS only**, no JavaScript.
`@friday-sandbox/react` is a **downstream consumer**: accessible React
components that _use_ what `styles` defines, never redefining tokens or theme.
Build `styles` correct first; `react`, and any future package, consumes it.
`react` depends on `styles` as a peer dependency — for its CSS, not its JS.

A component that needs a token which does not exist yet adds that token
**upstream in `styles` first** — by hand-authoring it in the theme CSS — then
consumes it downstream. Reuse an existing token before inventing one.

Pairs with token-pipeline (where each token value lives) and
class-name-contract (how the two packages link).
