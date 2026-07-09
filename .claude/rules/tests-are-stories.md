---
paths:
  - "packages/react/**"
---

# Rule: tests are stories — no test files

There are **no `*.test` files.** Vitest runs every `*.stories.tsx` in real
Chromium via Playwright. A story is its own test; writing a story gives you a
test.

Pairs with stories-docs-sync (which stories exist) and minimal-examples (what
a story may set).
