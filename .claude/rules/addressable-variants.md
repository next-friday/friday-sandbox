---
paths:
  - "**/*.{ts,tsx,mts,cts,js,mjs,cjs,jsx}"
  - "**/*.css"
---

# Addressable Variants

**Rule:** Every named value — variant, size, color, mode, state — must exist as a real, addressable artifact (a class, prop value, or enum entry). A default baked into a base rule with no companion class is a ghost — unselectable and unoverridable. Forbidden in every dimension.

Canonical definition, read it before editing matching files: [`docs/styles/addressable-variants.md`](../../docs/styles/addressable-variants.md). This file is a Claude Code pointer that auto-loads the rule by path; the full text lives in `docs/`.
