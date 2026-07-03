---
"@friday-sandbox/styles": minor
"@friday-sandbox/react": minor
---

Enforce two source conventions and restructure the docs around one canonical source. Add the `no-code-comments` rule and strip comments from all source, config, and scripts. Codify `@apply`-only styling: raw CSS properties in `.fri-*`/base rules move to named `@utility` helpers in `layers/utilities.css`. Add the `selection` token pair and re-add the radius and geometry-size scales to the default theme.
