# Rule: docs follow code — never let an artifact go out of date

The code is the source of truth; every doc and artifact that describes it must
match it. This repo's architecture is designed for contributors — human and LLM
— so a doc that lags the code misleads them and corrupts the next change.
Keeping the two in sync is not optional cleanup; it is part of the change that
touched the code.

**Change code → update its docs in the SAME change.** When a change alters
behavior, structure, a path, an export, a token, a build step, a config, or any
fact a doc states, find and update every artifact that describes it, in the same
commit/PR. Treat an out-of-date doc as a bug introduced by that change.

Artifacts to keep in sync with the code:

- **LLM docs** — `CLAUDE.md`, `.coderabbit.yaml`, `.gemini/styleguide.md`, and
  every skill under `.claude/skills/`. These steer human and LLM contributors; a
  stale instruction makes them build the wrong thing.
- **Prose docs** — `ARCHITECTURE.md`, `CONTRIBUTING.md`, `STYLE.md`, every
  `README.md`, and the docs site under `apps/docs/` (`.mdx`).
- **Everything else that references the changed thing** — changesets, generator
  templates, config and code comments, examples, and links.

How to apply:

- After a code change, grep the repo for the names, paths, exports, and terms
  you changed; update every hit that is now wrong. A change is not done while a
  doc still describes the old state.
- When a doc and the code disagree, the code is right and the doc is the bug —
  fix the doc to match (or fix the code if the doc states the intended contract).
- Mirrors stay 1:1: a `src` ↔ `exports` surface, a skill ↔ the code it
  describes, a generator ↔ what it scaffolds — change one side, align the other
  in the same change.

Pairs with no-redundancy: a single canonical source is only "single" if every
artifact pointing at it is updated together with it.
