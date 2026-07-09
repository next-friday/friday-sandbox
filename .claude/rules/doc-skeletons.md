---
paths:
  - "**/*.{md,mdx}"
---

# Rule: doc skeletons — one fixed structure per document type

Each document type follows one fixed skeleton, so a reader learns the layout
once. A new component doc is scaffolded by `pnpm gen component` (templates in
[`turbo/generators/`](../../turbo/generators)) with the correct structure and
voice before the first review; the skeletons for the other types are the
section sets described below. The AI reviewer mirrors (`.coderabbit.yaml`,
`.gemini/styleguide.md`) restate these structures for review.

- Component doc (`apps/docs/content/docs/components/*.mdx`): the required spine is a
  `<SourceLinks>` header, then `Import`, `Usage`, `Purpose`, `When to use`,
  `When not to use`, the component's own feature sections (one demo each, every
  section mirroring a story export of the same name — the `Variants`/`Sizes`
  showcases, then one per use-case story; see stories-docs-sync), then
  `Props`, `Styling`, then `Accessibility` last. `Props` is one table for a
  single component; a compound splits it per part — `### <Name> Props` for a
  callable root, then `### <Name>.<Part> Props` per subpart. Every Props table
  uses the columns `Prop | Type | Default | Description`, one row per prop
  (`lint:symmetry` checks the headings and the column set).
- Package README: `<name>`, the canonical one-line summary (see below), then
  `Quick start`. A published package (`react`, `styles`) adds badges and a
  `Why <name>` section above `Quick start`; an internal package
  (`eslint-config`, `typescript-config`) lists its presets or configs after it.
- Skill (`.claude/skills/*/SKILL.md`): a normative specification for the LLM,
  not prose for a human — `Purpose`, `Input`, `Tasks` (ordered imperative steps),
  `Rules` (Must / Must-not / May), `Acceptance criteria`, then `Output` when the
  skill has a deliverable to summarize. State only what to do; omit rationale,
  history, and philosophy — a short clause disambiguating an ambiguous rule, kept
  next to it, is the only exception.
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

Pairs with prose-voice (the narrator inside these structures), vocabulary (the
terms), stories-docs-sync (which feature sections exist), and markdown-style
(the mechanical formatting a gate keeps).
