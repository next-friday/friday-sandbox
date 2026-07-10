# Issue-body skeleton — every field filled or asked, none guessed

Draft the `--body-file` on this skeleton. A field left open is a question for
the human, never a default. `component-implement` executes exactly what this
body says.

```md
# Component: <Name>

## Design

- **Primitive**: <library part + per-component import subpath, or native
  element, or the composed `bases/` component>. Generator kind: `<aria|native>`
  (interactivity, not library). Storybook category: `<Category>`.
  <Single | Compound callable-root with parts `<A,B>` | Namespace-of-parts>.
- **Ladder**: <colored/interactive (full color × variant vocabulary) or
  structural (domain axis only) — state which and why>. Per axis: every value,
  its `fri-<name>-<value>` class, the default. A size that cascades from a
  container part says so (the child then bakes no default).
- **Geometry**: ramp `--<name>-units` per size step; radius archetype
  (`action`/`field`/`box`) with the `/ <md-units>` divisor.
- **Base-look inventory** (per part): width behavior (`w-fit`/`w-full`/unset),
  position (`relative` only for a child overlay), `transition-[…]` = exactly
  the properties the state rules change, cursor.
- **Tokens**: every color/spacing mapped to an existing `--fri-*` token or
  semantic alias; a missing token is added upstream in `styles` first.
- **States**: the primitive's real data attributes (verified from its docs
  page or installed `.d.ts`) + native fallbacks; or "none (display component)".
- **Type notes**: prop collisions with native attributes (`size`), widened
  `ComponentPropsWithRef` source.
- **Accessibility**: the accessible-name requirement, alt policy, keyboard
  notes the docs section must state.
- **Docs note**: the Storybook URL; the headless docs URL, or "omit `headless`
  (no standalone page)".

## Global constraints

<copy the repo invariants verbatim — fri-<name> naming, styles ↔ react mirror,
semantic aliases only, @apply only, one changeset, contrast floor>

## Plan

- [ ] Scaffold with the generator (never hand-create the files).
- [ ] Swap the placeholder for the primitive; wire `optimizeDeps` when aria.
- [ ] Fill the ladder end to end (styles ↔ css mirror).
- [ ] Stories per the showcase contract (trio + sibling showcases).
- [ ] Docs page per the doc contract (per-part Props tables).
- [ ] `bash .claude/skills/component-implement/scripts/verify-component.sh <name>` passes.
```
