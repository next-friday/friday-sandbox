---
"@friday-sandbox/react": minor
"@friday-sandbox/styles": minor
---

Expand the Flex and Grid layout primitives and add a polymorphic `as` prop.

- **Flex**: `inline`, `grow`, `shrink`, `basis`, and `as`.
- **Grid**: `inline`, responsive `cols="auto-fit"` / `"auto-fill"` with track width from the new element-local `--grid-min` token, `autoRows`, `autoCols`, and `as`.
- **GridItem**: `colSpan="full"`, `colStart` / `colEnd`, `rowStart` / `rowEnd`, and `as`.

The `cols` union is widened additively. The existing `1` to `12` values are unchanged.
