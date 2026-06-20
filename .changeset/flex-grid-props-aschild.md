---
"@friday-sandbox/react": minor
"@friday-sandbox/styles": minor
---

Expand the Flex and Grid layout primitives and add `asChild` composition.

- **Flex**: `inline`, `grow`, `shrink`, `basis`, and `asChild`.
- **Grid**: `inline`, responsive `cols="auto-fit"` / `"auto-fill"` (track width from the new element-local `--grid-min` token), `autoRows`, `autoCols`, and `asChild`.
- **GridItem**: `colSpan="full"`, `colStart` / `colEnd`, `rowStart` / `rowEnd`, and `asChild`.

The `cols` union is widened additively — the existing `1`–`12` values are unchanged.
