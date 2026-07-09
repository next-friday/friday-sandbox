---
paths:
  - "**/*.{ts,tsx,mjs,cjs,css,sh,yaml,yml}"
---

# Rule: no code comments — intent lives in names and commits

Source and config carry no comments. The "why" of a change lives in the commit
body; the "what" is the code and its names. A line that needs a comment to be
understood is a naming or structure problem — rename or split it, do not
annotate it. A comment is unenforced prose: no gate checks it against the code,
so it rots into a lie — the docs-follow-code failure at line granularity. Names
are checked by the compiler, the linter, and the symmetry gate; commits are
immutable and tied to the change. Put intent where a machine keeps it honest.

Never write:

- an explanatory comment — why the code does X, or a restated what
- a section-header essay, a TODO narrative, a banner
- a **suppression** — every silencer is banned by its own rule:
  no-eslint-suppressions, no-typescript-suppressions, and
  no-prettier-suppressions. A suppression hides a real failure; fix the root
  cause, never silence the gate.

Not a comment — a machine directive the toolchain reads, keep it:

- a shebang (`#!/usr/bin/env bash`)
- a TypeScript triple-slash directive (`/// <reference … />`)
- a `@type` JSDoc annotation (`/** @type {…} */`) — the type-checker reads it
- a bundler annotation (`/* @__PURE__ */`)

Templates are the one place a fill-in instruction belongs — it guides the next
author, and a handlebars `{{!-- … --}}` strips from the generated output:
`turbo/generators/templates/**`, `.github/ISSUE_TEMPLATE/**`, and any scaffold a
contributor edits per template.

Applies to every author — you, sub-agents, and generated output.

Pairs with no-eslint-suppressions, no-typescript-suppressions, and
no-prettier-suppressions (the per-tool silencer bans) and follow-local-pattern
(names carry the intent a comment would have restated).
