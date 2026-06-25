# Rule: lean prose, no LLM writing tells

Write Markdown and prose the way a terse human engineer does, not the way a model
pads. The em-dash and the parenthetical aside are the two most common LLM tells,
and this repo's review guide flags both on sight, so producing them just means
fixing the same nit on the next PR. Fix it at the source: do not write them.

Applies to every artifact you author: READMEs, changesets, PR and issue bodies,
the generated docs emitted by `codegen.js`, and story copy.

- **No em-dash `—`, and no en-dash used as punctuation.** Use a period, comma, or
  colon, or fold the clause into the sentence.
- **No parenthetical aside.** Rewrite it as a plain clause. A parenthesised list
  of literal token or option names is an enumeration, not an aside, and stays.
- **No "not just X, but Y" cadence, no reflexive hedging** such as `arguably`,
  `essentially`, or `simply`, and no decorative intensifiers. One direct
  statement per point.

The repository review guide `.gemini/styleguide.md` is the enforced downstream
gate: "Prose is direct and token-lean." This rule is the upstream half. Stop
generating the pattern so the gate never has to catch it. Pairs with the
no-guessing and no-unprovable-llm-claims rules: say less, and only what holds.
