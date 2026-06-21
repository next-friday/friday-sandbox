# React

The components in `@friday-sandbox/react`, accessible primitives built on `react-aria-components` and styled with the tokens from the [Styles](../styles/) chapter. This chapter covers how a component is shaped, composed, and tested; the enforced rules are at the end.

## Anatomy of a component

Every component is a symmetric folder under `src/components/<tier>/<name>/`, where the tier is its category:

- `bases`: interactive and compositional primitives such as button, flex, grid, and scroll-area
- `samples`: Storybook-only demos such as box, long-list, and wide-row; not part of the public surface

A `bases` component ships four files, mirroring `button`:

```text
src/components/bases/button/
  index.ts             # re-exports component + types
  button.tsx           # the component; "use client" only when a client API is touched; Props colocated
  button.variants.ts   # tailwind-variants definition + *Variants types
  button.stories.tsx   # Storybook story
```

Filenames are lowercase, the export is named rather than a default, and the `Props` type lives beside the component. A component reaches the consumer only through the package `exports` map, where `.` → `./src/index.ts` and `./*` → `./src/*/index.ts`; a file no `index.ts` re-exports does not ship.

## Compose, don't reinvent

Reach for what already exists before writing new behaviour:

- **Interaction:** focus, selection, and keyboard handling come from `react-aria-components`. Do not hand-roll what a primitive already provides.
- **Structure:** rows, columns, grids, and scrollable regions use the layout primitives `Flex`, `Grid`, `GridItem`, and `ScrollArea`, not raw `<div className="flex …">`.
- **Shared logic:** focus management, ARIA wiring, controlled-vs-uncontrolled state, and event coalescing belong in a reusable hook under `src/`. A second component solving the same problem is the signal to extract.

## Accessibility and stories

Every interactive component is keyboard-operable and screen-reader-correct: reachable by keyboard, focus visible, ARIA only where the DOM does not already convey intent, motion respecting `prefers-reduced-motion`.

Its Storybook story proves this while doubling as the deployed consumer reference. A story covers `Default`, `Hovered`, `Focused`, `Disabled`, and every colour variant including `danger`, using real props so `addon-a11y` exercises the real component. Story copy is written for someone using the component in their own app, never internal class names, library names, or engine math.

## Rules in this chapter

Enforced gates for writing components. CI and the PR reviewers hold you to them:

- [`component-structure.md`](rules/component-structure.md): the symmetric folder skeleton, lowercase filenames, named export, `*.variants.ts`, exports-map reachability.
- [`composition.md`](rules/composition.md): compose `react-aria-components` and the layout primitives; extract shared logic into a hook.
- [`accessibility-and-stories.md`](rules/accessibility-and-stories.md): keyboard/focus/ARIA, `addon-a11y`, required story states, consumer-facing story copy.
