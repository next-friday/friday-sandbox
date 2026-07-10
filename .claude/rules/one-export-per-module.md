---
paths:
  - "packages/**"
---

# Rule: one export per module — split standalone data, keep index a barrel

A module is one cohesive concern. Piling unrelated exports into a single file
because it is convenient is the default reflex — an LLM or a rushed dev drops
three constants into one file, or worse into an `index.ts`. Resist it: a file is
where a reader looks for one thing, and a pile buries each thing in the others.

Two halves, one gated and one not:

- **`index.ts` is a barrel** — imports, re-exports, and type declarations only,
  never a runtime value. Define the value in a sibling module and re-export it
  here. This half is enforced by `next-friday/index-export-only`: a runtime
  `export const` in an `index.ts` fails lint.
- **Standalone data gets its own file** — independent constants, option lists, or
  data tables are separate concerns, so each takes its own module named for it
  (`colors.ts`, `sizes.ts`, `spacing.ts`), re-exported from the folder's
  `index.ts`. Never collect them into one `constants.ts` grab-bag.

Cohesion, not a blanket count: a component module legitimately co-locates the
component, its `Props` type, and its `cva()` variant map — those are one concern,
so they stay together. The rule bans piling **unrelated** exports, not every
second export.

How to apply:

- Adding a second independent constant to a file? Give it its own file and
  re-export both from the folder's `index.ts`.
- Reaching for `index.ts` to hold a value? Stop — that is the barrel; put the
  value in a sibling module.

Pairs with no-redundancy and follow-local-pattern.
