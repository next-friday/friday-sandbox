---
paths:
  - "**/*.json"
  - "**/*.jsonc"
  - "**/*.{yml,yaml}"
  - "**/.*rc*"
  - "**/*.config.{js,mjs,cjs,ts,mts,cts}"
---

# Lean Configuration

**Rule:** Do not write config keys whose value equals the tool's documented default. Empty arrays, empty objects, and explicit defaults are noise.

Canonical definition, read it before editing matching files: [`docs/tooling/rules/lean-config.md`](../../docs/tooling/rules/lean-config.md). This file is a Claude Code pointer that auto-loads the rule by path; the full text lives in `docs/`.
