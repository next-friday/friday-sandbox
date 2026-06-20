---
paths:
  - "**/*.{ts,tsx,mts,cts,js,mjs,cjs,jsx,mdx}"
  - "**/*.css"
---

# Canonical Tailwind Classes

**Rule:** When a CSS variable is registered in `@theme inline`, use its canonical Tailwind utility (`bg-muted`, `text-foreground`, `rounded-action`) — never the arbitrary-var fallback `bg-(--muted)`. The `*-(--var)` form is reserved for component-local vars that have no alias.

Canonical definition, read it before editing matching files: [`docs/conventions/canonical-tailwind.md`](../../docs/conventions/canonical-tailwind.md). This file is a Claude Code pointer that auto-loads the rule by path; the full text lives in `docs/`.
