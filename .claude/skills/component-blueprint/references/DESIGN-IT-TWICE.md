# Design it twice

Your first idea is rarely the best. For a non-trivial component — a new prop or compound API, or a visual structure that isn't obvious — diverge before you converge. Skip this when grilling already settled the shape in one pass (a trivial variant-only component): say so and go straight to the primitive.

## API axis — parallel sub-agents

Fix the constraints first (which primitive, which states, controlled vs uncontrolled, compound parts), then dispatch 2–3 sub-agents, each designing a deliberately different interface. They return designs only — no file edits.

- **Minimal surface** — 1–3 props, lean on `tailwind-variants` defaults.
- **Maximal composability** — compound parts plus render-props / `as`.
- **Optimize the common caller** — the trivial default just works (e.g. `<Tooltip>text</Tooltip>`).

Compare on three lenses: leverage per prop; locality (does a change land in one `.styles.ts`/`.css` pair); seam placement (react-aria vs radix vs native). Recommend one, or hybridize — "the header from B with the sidebar from C" is often the real design.

## Visual axis — Storybook is the switcher

Put N structurally-different takes as variants on one story and flip them in Storybook. Structurally different means different layout or affordance, not a different `--fri-role` — three tweaked card grids is wallpaper, not a prototype.

## Disposal

Each candidate is throwaway code that answers a question. Keep the winning rationale (record an ADR when the decision is hard to reverse, surprising without context, and a real trade-off), then delete the losers — exploratory stories never enter the published `bases/` barrel; they rot fast.
