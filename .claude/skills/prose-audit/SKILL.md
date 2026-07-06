---
name: prose-audit
description: Use to audit docs and mdx prose for one voice — every page, and every peer page beside it, reading as if one person wrote it, with no narrator drift and no off-vocabulary or marketing words (against `.claude/rules/prose-style.md`), and light enough on symbols that a human reads it without decoding. Read-only review that reports file:line findings with a fix. Triggers "audit the docs prose", "does this read on-voice", "is the tone consistent", "is this over-styled". Not for structural or factual sync — that is docs-follow-code.
---

# Prose audit

## Purpose

Audit docs and mdx prose for one voice: every page, and every peer page beside it, reads as if one person wrote it, with no narrator drift and no off-vocabulary or marketing word. Read-only — report `file:line` findings with a fix; rewrite only when asked.

## Input

- The docs page(s) or mdx to audit, plus their peer pages.

## Tasks

1. **Scope, with peers.** Take the files under review plus their peer set — a component doc against the other component docs, a README against the other READMEs. Read prose and table cells, not code fences or the JSX inside a `<Tab>` demo.
2. **Voice symmetry — one author across peers.** Line up the same section across every peer and check it reads the same:
   - **Same shape.** Every `Purpose` opens the same way; every `Applies` cell is a comma list or one sentence, not one clean list beside one semicolon-chain; every `When to use` keeps the same rhythm.
   - **One narrator.** The imperative, addressed to the reader, throughout — never a mix of "you", "the component provides", and "developers can".
   - **`.claude/rules/prose-style.md` vocabulary.** [`.claude/rules/prose-style.md`](../../rules/prose-style.md) is the single word source — component not widget, variant not kind. Read it and flag an off-vocabulary synonym or a banned marketing adjective (powerful, robust, seamless, intuitive, modern, and the like).
3. **Symbol restraint — a human reads it.** Grep the render-clutter patterns, then eyeball each hit. Prefer a plain sentence or a comma list; keep a code chip only for a real identifier — a class, prop, token, or type — never for an ordinary word.

   | pattern                                        | grep                                |
   | ---------------------------------------------- | ----------------------------------- |
   | a link wrapped in parens `([label](url))`      | `\(\[[^]]+\]\([^)]+\)\)`            |
   | three or more back-to-back code chips in prose | eyeball — three code spans in a row |
   | inline `(+ …)` or `("x"–"y")`                  | `\(\+ \|\("`                        |
   | a semicolon chaining two clauses in a cell     | `^\|.*; [a-z].*\|`                  |
   | a slash pair `a / b` in prose                  | `[a-z]+ / [a-z]+`                   |

   A range dash inside a value (`1–12`, `xs–xl`) and a single label–detail em-dash (`Base styles — …`) are fine. The defect is symbols _stacked_, not any one symbol.

## Rules

- Never audit a doc in isolation — read it beside its peers.
- Fix a drifting page toward the shared shape, not away from it.
- Correctness is not the axis — a technically-correct page that reads off-voice, to a human, is a finding.
- Never touch example or demo content.
- Never wrap an ordinary word in backticks — a code chip is for a real identifier only.
- Never re-list `.claude/rules/prose-style.md`'s banned words or vocabulary here; read it live.

## Acceptance criteria

Confirm the audit caught each baseline failure observed in this repo:

| failure                                                                                                       | counter                                                                         |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| One component's `Applies` cell is a clean comma list; the next component's is a semicolon-chained paragraph   | step 2 — line the peers up; hold every cell to the same shape                   |
| A page slips from the imperative "you" into "the component provides" halfway down                             | step 2 — one narrator across the whole page and its peers                       |
| `is styled through CSS classes ([source styles](url)), so …` — a parenthetical link duplicating a header link | step 3 — drop the parenthetical link; the SourceLinks header already carries it |
| `apply Tailwind utility classes (text-left, truncate, line-clamp-2, underline) directly` — a chip wall        | step 3 — plain words: `map to Tailwind utilities directly`                      |

## Output

One list, most-reader-hurting first: `file:line` — the offending text — the fix, or the rewritten line when asked. Name the axis (voice or symbols) and, for a voice finding, the peer it drifts from.
