---
paths:
  - "**/*.{ts,tsx,mts,cts,js,mjs,cjs,jsx}"
  - "**/*.css"
---

# No Ghosts

**Rule:** Every named value — variant, size, color, mode, state — must exist as a real, addressable artifact (class, prop value, enum entry). A default baked into a base rule with no companion class is a ghost. Forbidden in every dimension.

Canonical definition, read it before editing matching files: [`docs/conventions/no-ghosts.md`](../../docs/conventions/no-ghosts.md). This file is a Claude Code pointer that auto-loads the rule by path; the full text lives in `docs/`.
