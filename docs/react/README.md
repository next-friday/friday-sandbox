# React

The components in `@friday-sandbox/react`, accessible primitives styled with the tokens from the [Styles](../styles/) chapter. Interaction comes primarily from `react-aria-components`, with Radix where it supplies the primitive, such as `ScrollArea`. This chapter covers how a component is shaped, composed, and tested; the enforced rules are at the end.

## Quickstart

Consumers install both packages, import the styles once, then use a component:

```sh
pnpm add @friday-sandbox/react @friday-sandbox/styles
```

```css
/* your global stylesheet */
@import "tailwindcss";
@import "@friday-sandbox/styles";
```

```tsx
import { Button } from "@friday-sandbox/react";

export function Save() {
  return <Button onPress={() => save()}>Save changes</Button>;
}
```

Full install, theming, and the live component gallery are in the [package README](../../packages/react/README.md) and the deployed Storybook.

## Anatomy of a component

Every component is a symmetric folder under `src/components/<tier>/<name>/`, where the tier is its category:

- `bases`: interactive and compositional primitives such as button, flex, grid, and scroll-area
- `samples`: Storybook-only demos such as box and long-list; not part of the public surface

A `bases` component ships four files by default, mirroring `button`:

```text
src/components/bases/button/
  index.ts             # re-exports component + types
  button.tsx           # the component; "use client" only when a client API is touched; Props colocated
  button.variants.ts   # tailwind-variants definition + *Variants types
  button.stories.tsx   # Storybook story
```

A multi-part primitive adds two files. `scroll-area` ships six: the four above plus `scroll-area.types.ts` for its per-part `Props` and `scroll-area.namespace.ts` for the `ScrollArea.Root` / `.Viewport` / `.Scrollbar` dotted export.

Filenames are lowercase, the export is named rather than a default, and the `Props` type lives beside the component. A component reaches the consumer only through the package `exports` map, where `.` resolves to `./src/index.ts` and `./*` to `./src/*/index.ts`; a file no `index.ts` re-exports does not ship.

The layout primitives `Flex`, `Grid`, and `GridItem` are polymorphic via an `as` prop, typed through the shared `PolymorphicProps` helper so the chosen element keeps its full DOM surface.

## Compose, don't reinvent

Reach for what already exists before writing new behaviour:

- **Interaction:** focus, selection, and keyboard handling come from `react-aria-components`, or from Radix where it owns the primitive. Do not hand-roll what a primitive already provides.
- **Structure:** rows, columns, grids, and scrollable regions use the layout primitives `Flex`, `Grid`, `GridItem`, and `ScrollArea`, not raw `<div className="flex …">`.
- **Shared logic:** focus management, ARIA wiring, and controlled-vs-uncontrolled state belong in a reusable hook under `src/`. A second component solving the same problem is the signal to extract.

Contributors share cross-component helpers from `components/utils/`: `compose-tailwind-render-props` merges a render-prop `className` with variant classes, and `polymorphic-props` types the `as` prop. Reuse them rather than re-deriving the same logic.

## Accessibility and stories

Every interactive component is keyboard-operable and screen-reader-correct: reachable by keyboard, focus visible, ARIA only where the DOM does not already convey intent, motion respecting `prefers-reduced-motion`.

Its Storybook story proves this while doubling as the deployed consumer reference. A story covers `Default` plus the color and variant matrices, with `addon-a11y` exercising the real component through real props. Story copy is written for someone using the component in their own app, never internal class names, library names, or engine math.

## Rules in this chapter

Enforced gates for writing components. CI and the PR reviewers hold you to them:

- [`component-structure.md`](rules/component-structure.md): the symmetric folder skeleton, lowercase filenames, named export, `*.variants.ts`, polymorphic typing, exports-map reachability.
- [`composition.md`](rules/composition.md): compose `react-aria-components` and the layout primitives; extract shared logic into a hook.
- [`accessibility-and-stories.md`](rules/accessibility-and-stories.md): keyboard/focus/ARIA, `addon-a11y`, story coverage, consumer-facing story copy.

---

[Handbook hub](../README.md) · [Styles](../styles/) · React · [Tooling](../tooling/) · [Contributing](../../CONTRIBUTING.md)
