---
name: prose-audit
description: Use to audit docs and mdx prose for one voice — every page, and every peer page beside it, reading as if one person wrote it, with no narrator drift and no off-vocabulary or marketing words (against `.claude/rules/prose-style.md`), and light enough on symbols that a human reads it without decoding. Read-only review that reports file:line findings with a fix. Triggers "audit the docs prose", "does this read on-voice", "is the tone consistent", "is this over-styled". Not for structural or factual sync — that is docs-follow-code.
---

# Prose audit

The test is **one voice**: every document, and every peer document beside it, reads as if a single person wrote it — and a human reads it without decoding symbols. Voice is judged by **comparison**, the way structural symmetry is: a component doc is audited against the other component docs, a README against the other READMEs. A page that drifts from its siblings — a different sentence shape, a switched narrator, an off-vocabulary word — is a defect the same as a broken structural mirror.

Two ways it fails, in priority order:

1. **Voice drift or asymmetry** — a doc or a section reads in a different shape or tone than its peers, or the narrator switches mid-page.
2. **Heavy symbols** — stacked punctuation, walls of code chips, and parenthetical links make the reader's eye work; a human reads this.

Read-only: report `file:line` and the fix; rewrite only when asked, and never touch example or demo content — that is the author's art.

## Steps

1. **Scope, with peers.** The files under review plus their peer set — audit a component doc against the other component docs, a README against the other READMEs. Read prose and table cells, not code fences or the JSX inside a `<Tab>` demo.

2. **Voice symmetry — one author across peers.** Line up the same section across every peer and check it reads the same:
   - **Same shape.** Every `Purpose` opens the same way; every `Applies` cell is a comma list or one sentence, not one clean list beside one semicolon-chain; every `When to use` keeps the same rhythm. Uneven shapes read as different authors.
   - **One narrator.** The imperative, addressed to the reader, throughout — never a mix of "you", "the component provides", and "developers can" within or across docs.
   - **`.claude/rules/prose-style.md` vocabulary.** [`.claude/rules/prose-style.md`](../../rules/prose-style.md) is the single word source — component not widget, variant not kind. Read it and flag an off-vocabulary synonym or a banned marketing adjective (powerful, robust, seamless, intuitive, modern, and the like).

   A page that reads differently from its siblings is the finding — fix it toward the shared shape, not away from it.

3. **Symbol restraint — a human reads it.** Grep the render-clutter patterns, then eyeball each hit. Prefer a plain sentence or a comma list; keep a code chip only for a real identifier — a class, prop, token, or type — never for an ordinary word.

   | pattern                                        | why it reads bad                                                        | grep                                |
   | ---------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------- |
   | a link wrapped in parens `([label](url))`      | link underline, parens, and a trailing comma stack; often a header dupe | `\(\[[^]]+\]\([^)]+\)\)`            |
   | three or more back-to-back code chips in prose | a wall of bordered pills                                                | eyeball — three code spans in a row |
   | inline `(+ …)` or `("x"–"y")`                  | nested parens, quotes, and a dash at once                               | `\(\+ \|\("`                        |
   | a semicolon chaining two clauses in a cell     | two sentences crammed into one Applies or Description cell              | `^\|.*; [a-z].*\|`                  |
   | a slash pair `a / b` in prose                  | reads as an equation, not a phrase                                      | `[a-z]+ / [a-z]+`                   |

   A range dash inside a value (`1–12`, `xs–xl`) and a single label–detail em-dash (`Base styles — …`) are fine. The defect is symbols _stacked_, not any one symbol.

4. **Report.** One list, most-reader-hurting first: `file:line` — the offending text — the fix, or the rewritten line when asked. Name the axis (voice or symbols) and, for a voice finding, the peer it drifts from. Leave example and demo copy alone unless the ask includes it.

## Baseline failures this counters (observed in this repo)

| failure                                                                                                       | counter                                                                         |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| One component's `Applies` cell is a clean comma list; the next component's is a semicolon-chained paragraph   | step 2 — line the peers up; hold every cell to the same shape                   |
| A page slips from the imperative "you" into "the component provides" halfway down                             | step 2 — one narrator across the whole page and its peers                       |
| `is styled through CSS classes ([source styles](url)), so …` — a parenthetical link duplicating a header link | step 3 — drop the parenthetical link; the SourceLinks header already carries it |
| `apply Tailwind utility classes (text-left, truncate, line-clamp-2, underline) directly` — a chip wall        | step 3 — plain words: `map to Tailwind utilities directly`                      |

## Red flags — STOP

- Auditing a doc in isolation — voice is a comparison; read it beside its peers.
- "It's technically correct" — correctness is not the axis; whether it reads as one author, to a human, is.
- Wrapping ordinary words in backticks to look precise — a chip is for an identifier, not for prose.
- Rewriting a demo's example copy to "fix the voice" — that is the author's art, not the audit's to touch.
- Re-listing `.claude/rules/prose-style.md`'s banned words or vocabulary in this skill — `.claude/rules/prose-style.md` is the single source; read it live.

## What this encodes

- `.claude/rules/prose-style.md` is the voice source; this skill is its read-time enforcement for prose, the way `lint:symmetry` enforces structural symmetry — one holds the shape of the code, this holds the shape of the sentences. It pairs with `docs-follow-code`, which syncs the facts; this holds the voice even.
- One author is the whole point: hold peer docs to the same sentence shapes, the same narrator, the same words. A reader should not be able to tell where one contributor stopped and the next began.
- Restraint rule of thumb: a symbol earns its place when it names a real thing — one identifier, one value, one range. Two symbols the reader must decode in a row is one too many.
