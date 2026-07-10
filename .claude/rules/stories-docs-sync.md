---
paths:
  - "**/*.stories.tsx"
  - "apps/docs/content/docs/**/*.mdx"
---

# Rule: stories docs sync — a fixed showcase trio, use cases mirrored by name

A component's stories split into two tiers with different owners. Mixing them —
a scaffolded story per state, per value, per boolean — is how a story file
grows seventeen exports no doc section mirrors: each extra story is a silent
asymmetry the reader can't tell apart from a designed use case.

- **Showcase stories — at most three, fixed names.** `Default` (every
  component), `Variants` (only when the component has a `variant` axis), and
  `Sizes` (only when it has a `size` axis). A showcase lays out every value of
  its axis with `Flex`/`Grid`, written as explicit unrolled JSX — never a
  `.map()` over the axis (an `argTypes` options array may map; bulk placeholder
  content belongs inside a `samples/` component). Another enum axis (a color, a
  shape) joins the `Variants` grid when one exists, or waits for a use case
  otherwise. The scaffold emits this tier ready to ship, and `lint:symmetry`
  gates it: axis → story → doc section, exact names, no-map-demos.
- **Independent sibling part — one showcase of its own.** A namespace part
  with its own `cva()` map whose CSS styles the roots it contains (base
  `fri-<name>-<part>` plus a descendant rule back onto `.fri-<name>` — a
  `Group`, not a slot like an `Icon`) gets one showcase story named after the
  part, carrying a `play` that asserts every mechanic the design gives the
  part — the size cascade and the paint order each get an assertion, never a
  sample of one — plus a same-named `##` section. `lint:symmetry` derives the
  pair from the namespace, the second `cva()` map, and the descendant rule.
- **Use-case stories — the designer's, any number.** Every story beyond the
  trio and the sibling showcases is a use case a human authors to taste,
  after the component ships. A
  state (`isDisabled`, `data-invalid`) is demonstrated by a use case or
  documented in the doc's State selectors table — never a scaffolded showcase.
- **Demo copy is neutral.** The component's own name, the value's own label
  (`Extra small`), or `samples/` content (`Lorem`, `Boxes`) — never a domain
  sample (an email address, a brand, a person's name); those belong to a
  designer's use case.

The doc page mirrors the stories by name, 1:1:

- `## Variants` and `## Sizes` sections mirror their showcase stories (gated).
- Every use-case story gets one `##` feature section with the **same name as
  the story export**, placed before `## Props`, in the Preview + Code `<Tabs>`
  shape the other sections use; every feature section names an existing story.
  Adding, renaming, or deleting a use-case story updates its section in the
  same change — `component-docs` is the sync procedure.

How to apply:

- Scaffolding or implementing? Ship exactly the trio the axes call for; add no
  per-state, per-value, or speculative story.
- Adding a use-case story? Add the same-named `##` section in the same change.
- Renaming a story export? Grep the doc page and rename its section with it.

The trio half is gated by `lint:symmetry`; the use-case half is held by
`component-docs` and review.

Pairs with minimal-examples (what a demo may set) and follow-local-pattern
(the shape neighbors use).
