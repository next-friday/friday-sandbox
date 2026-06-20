# Conventions

The code conventions for this repository, one file per rule. They are **canonical and tool-agnostic** — every contributor follows them, whatever editor or AI assistant they use. CI and the PR reviewers ([`.coderabbit.yaml`](../../.coderabbit.yaml), [`.gemini/styleguide.md`](../../.gemini/styleguide.md)) enforce them.

| Convention                                                     | What it governs                                          |
| -------------------------------------------------------------- | -------------------------------------------------------- |
| [`component-structure.md`](component-structure.md)             | the symmetric React component folder skeleton            |
| [`compose-and-dry.md`](compose-and-dry.md)                     | composing `react-aria` + layout primitives; shared hooks |
| [`accessibility-and-stories.md`](accessibility-and-stories.md) | keyboard/ARIA, `addon-a11y`, story coverage and copy     |
| [`semantic-token-scope.md`](semantic-token-scope.md)           | `action` / `field` / `box` token scopes                  |
| [`canonical-tailwind.md`](canonical-tailwind.md)               | Tailwind aliases over arbitrary-var fallbacks            |
| [`no-ghosts.md`](no-ghosts.md)                                 | every variant/size/state is a real, addressable class    |
| [`meaningful-identifiers.md`](meaningful-identifiers.md)       | names over shorthands; no prose comments                 |
| [`no-default-noise.md`](no-default-noise.md)                   | no config key equal to the tool's documented default     |

> **Using Claude Code?** These same conventions are mirrored as thin pointers in [`.claude/rules/`](../../.claude/rules/), which auto-load into context when you edit a matching file. Those pointers are an editor affordance only — the canonical text lives here, and you do not need Claude Code (or any AI tool) to read it.
