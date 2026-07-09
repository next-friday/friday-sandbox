---
paths:
  - "**/*.{md,mdx}"
---

# Rule: prose voice — one narrator for one reader

Every README, doc page, changeset, story copy, and generated document reads as
if one person wrote it. For generic editorial questions this repo adopts the
[Google developer documentation style guide](https://developers.google.com/style)
as its base — grammar, punctuation, capitalization, and any word choice not
fixed by vocabulary. Do not re-derive generic editorial rules here; cite the
base.

## Audience

A document addresses exactly one reader. State the reader, then write only what
that reader needs. Keep maintainer-internal detail out of consumer docs.

| Surface                                                                      | Reader                                       | Writes about                           |
| ---------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------- |
| `apps/docs/content/docs/**`, package READMEs                                 | Consumer: an engineer using the package      | the public API and how to use it       |
| Root `README.md`                                                             | Evaluator: someone deciding whether to adopt | what the project is and what it offers |
| `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `AGENTS.md`, `.github/**`           | Contributor                                  | how to work in the repo                |
| `CLAUDE.md`, `.claude/rules/**`, `.gemini/styleguide.md`, `.coderabbit.yaml` | Maintainer and agents                        | how the repo governs itself            |

A sentence about a component's internals, for example "internally it composes a
press responder", belongs in maintainer docs, never in a consumer page.

## Principles

Each principle states the rule and a Do/Don't pair. The sourced principles cite
the Anthropic guidance they derive from.

1. **Clarity.** Write so a reader with minimal context can follow on the first
   pass. Source: [be clear and direct](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct), "Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too."
   - Do: "Pass `size` to set the control height."
   - Don't: "The sizing can be adjusted as needed via the relevant prop."

2. **Imperative voice, one narrator.** Address the reader with the imperative.
   Do not switch between "the component provides", "this lets developers", and
   "you can".
   - Do: "Use `Button` for the primary action on a view."
   - Don't: "Developers are able to leverage Button to perform primary actions."

3. **Describe behavior, not quality.** State what something does. Drop marketing
   adjectives. Source: [Claude Code best practices](https://code.claude.com/docs/en/best-practices), "fact-based progress reports rather than self-celebratory updates".
   - Do: "`Button` collects a single user action."
   - Don't: "A powerful, intuitive, seamless Button for modern apps."

4. **Structure over dense prose.** Group with headings; give the reader
   something to scan rather than a wall of sentences. Use a **table** for
   multi-column or reference data — a prop with its type and default, a
   use-it-when versus reach-for-something-else split, or a component's modifier
   classes and state selectors: enumerate each named class (a color, variant, or
   size step) as its own `| Class | Type | Description |` row, compacting only a
   dense integer sequence into a single range row. Use a **bulleted list** for a
   short run of discrete points, such as when-to-use cases. Reserve prose for
   rationale and narrative that neither would flatten.
   Source: [memory](https://code.claude.com/docs/en/memory), "organized sections are easier to follow than dense paragraphs."
   - Do: `| Prop | Type | Default | Description |` for props; ``| `fri-button-solid` | Variant | Solid variant. |`` for a class list.
   - Don't: a paragraph that lists three props and their defaults in sentences.

5. **Even depth.** Comparable items get comparable length. Document every
   component against the same section set, so none is twelve paragraphs while its
   neighbor is one sentence. Source: [memory](https://code.claude.com/docs/en/memory), "write instructions that are concrete enough to verify."

6. **One word per concept.** Pick the canonical term and never its synonyms —
   the vocabulary rule holds the table. Source: [memory](https://code.claude.com/docs/en/memory), "if two rules contradict each other, [the reader] may pick one arbitrarily."

7. **Examples carry the weight.** Show the real exported API, not prose about it.
   Source: [be clear and direct](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct), "Examples are one of the most reliable ways to steer ... output format, tone, and structure."

Anthropic publishes no guidance on a single editorial voice or a per-doc-type
audience matrix. Principles 1 and 2 and the Audience map are authored here from
the clarity principle and are not attributed to Anthropic. The property this
voice gives the repo is regularity: a fixed voice and structure let generators
and contributors infer the expected shape of any document; it makes no claim
about what any model will write on its own.

Pairs with vocabulary (the canonical terms), doc-skeletons (the per-type
structure), and markdown-style (the mechanical formatting a gate keeps).
