---
paths:
  - "**/*.{md,mdx}"
---

# Rule: prose style — one voice across every doc

Every README, doc page, changeset, story copy, and generated document follows
this guide. The goal: the whole repo reads as if one person wrote it.

For generic editorial questions this guide adopts the [Google developer documentation style guide](https://developers.google.com/style) as its base — grammar, punctuation, capitalization, and any word choice not fixed below. What follows is only what is specific to this repository: its audience map, vocabulary, document structure, and the conventions a gate or an AI reviewer enforces. Do not re-derive generic editorial rules here; cite the base.

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
   - Do: `| Prop | Default | Type |` for props; ``| `fri-button-solid` | Variant | Solid variant. |`` for a class list.
   - Don't: a paragraph that lists three props and their defaults in sentences.

5. **Even depth.** Comparable items get comparable length. Document every
   component against the same section set, so none is twelve paragraphs while its
   neighbor is one sentence. Source: [memory](https://code.claude.com/docs/en/memory), "write instructions that are concrete enough to verify."

6. **One word per concept.** Pick the canonical term and never its synonyms. See
   Vocabulary below. Source: [memory](https://code.claude.com/docs/en/memory), "if two rules contradict each other, [the reader] may pick one arbitrarily."

7. **Examples carry the weight.** Show the real exported API, not prose about it.
   Source: [be clear and direct](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct), "Examples are one of the most reliable ways to steer ... output format, tone, and structure."

Anthropic publishes no guidance on a single editorial voice or a per-doc-type
audience matrix. Principles 1 and 2 and the Audience map are authored here from
the clarity principle and are not attributed to Anthropic.

## Vocabulary

Use the canonical term. Examples:

| Canonical        | Not                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| component        | widget, control, element (when it means a component)                                                             |
| variant          | kind, flavor, style (when it means a `tv()` variant)                                                             |
| token            | theme variable, custom property (when it means a design token)                                                   |
| prop             | option, parameter (when it means a component prop)                                                               |
| size             | sizing, dimension (when it means the `size` prop or token)                                                       |
| gates            | checks, quality checks (when it means the CI and hook verification step)                                         |
| primitive        | base component (when it means the platform tech a component wraps: react-aria-components, radix-ui, native HTML) |
| layout component | primitive (when it means `Flex`, `Grid`, or `Text` — a published component)                                      |
| Tailwind CSS v4  | Tailwind v4, Tailwind 4                                                                                          |
| radix-ui         | radix, Radix (when it means the package)                                                                         |

Words with a distinct technical meaning keep it. `element` for a DOM element and
`property` for a CSS property are correct in their own context; treat the small,
unambiguous set as fixed and the rest as a review judgment against this guide.

Marketing words are banned outright:
powerful, robust, seamless, intuitive, modern, elegant, blazing, effortless,
cutting-edge, world-class, and the like.

## Document structure

Each document type follows one fixed skeleton, so a reader learns the layout
once. A component doc is emitted by the `component-generator` engine from the
component's `ComponentSpec`; the skeletons for the other types are the section
sets described below.

- Component doc (`apps/docs/content/docs/components/*.mdx`): the required spine is a
  `<SourceLinks>` header, then `Import`, `Usage`, `Purpose`, `When to use`,
  `When not to use`, the component's own feature sections (one demo each),
  `Props`, `Styling`, then `Accessibility` last.
- Package README: `<name>`, the canonical one-line summary (see below), then
  `Quick start`. A published package (`react`, `styles`) adds badges and a
  `Why <name>` section above `Quick start`; an internal package
  (`eslint-config`, `typescript-config`) lists its presets or configs after it.
- Skill (`.claude/skills/*/SKILL.md`): `When to use`, `Steps`, `Done — the
contract`, `Verify`, `Red flags — STOP`, `What this encodes`, then an optional
  trailing appendix (such as `Running unattended`) when the skill needs one.
- Guide or how-to: a task title, then numbered steps.

Every package table across the repo uses the columns `Package | Description` and
copies these canonical one-line descriptions verbatim:

| Package                             | Description                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `@friday-sandbox/react`             | Accessible React components built on react-aria-components and Tailwind CSS v4. |
| `@friday-sandbox/styles`            | Framework-agnostic design tokens and Tailwind CSS v4 layers.                    |
| `@friday-sandbox/eslint-config`     | Shared ESLint flat-config presets.                                              |
| `@friday-sandbox/typescript-config` | Shared TypeScript config presets.                                               |

Keep the required heading set for each documented surface.

## Enforcement

This guide is upheld in review:

- **Generator** (the `component-generator` engine, run via its `cli.ts`): a
  component doc is emitted with the correct structure and voice from the spec,
  before the first review.
- **AI reviewers** (`.coderabbit.yaml`, `.gemini/styleguide.md`): point at this
  guide's sections for voice, audience, the banned marketing words, and the
  required structure.

The property this guide gives the repo is regularity: a fixed vocabulary and a
fixed structure let generators and contributors infer the expected
shape of any document. It makes no claim about what any model will write on its
own.

Pairs with markdown-style, which holds the mechanical formatting conventions.
