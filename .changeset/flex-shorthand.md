---
"@friday-sandbox/react": minor
"@friday-sandbox/styles": minor
---

Add a `flex` shorthand prop to `Flex` for `grow`, `shrink`, and `basis` in one value: `1`, `auto`, `initial`, or `none`. `flex={1}` gives a child an equal share of the space. Exposed in CSS as `.fri-flex-1`, `.fri-flex-auto`, `.fri-flex-initial`, and `.fri-flex-none`.

`flex` and the `grow` / `shrink` / `basis` longhand are mutually exclusive at the type level: passing both is a compile-time error, since the shorthand already sets all three.
