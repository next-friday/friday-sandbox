---
paths:
  - "**/*.{md,mdx}"
---

# Rule: markdown style — mechanical conventions a gate keeps

Markdown formatting is mechanical, so a gate enforces it and review need not.
The gate is [`.markdownlint-cli2.jsonc`](../../.markdownlint-cli2.jsonc), run by
`pnpm lint:md`; this rule states its conventions in prose and adds the two a
markdownlint code cannot express.

- Headings are sentence case: capitalize the first word and proper nouns only
  (`## Quick start`, not `## Quick Start`). One `#` H1 per document.
- Every fenced code block declares a language. Shell is `sh`, a literal, template,
  or diagram block is `text`; never an empty fence.
- A heading is a real `#` heading, never a bold paragraph (`**Label:**`) standing
  in for one.

`pnpm lint:md` (markdownlint, wired into the hooks and CI) checks the fence
language, the single H1, heading punctuation, and heading increment. It enforces
only these mechanical rules and defers all formatting to Prettier, so it never
overrides an authored Markdown pattern.

Pairs with prose-style, which holds the voice these conventions carry.
