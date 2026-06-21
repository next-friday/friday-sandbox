# Component Structure

**Rule:** Every `@friday-sandbox/react` component follows one symmetric folder skeleton under `src/components/<tier>/<name>/`. Same file shape, same naming, same export pattern across every component. `button` is the reference.

Tiers:

- `bases`: interactive and compositional primitives such as button, flex, grid, and scroll-area
- `samples`: Storybook-only demo components such as box, long-list, and wide-row; **not** re-exported from the public surface

## Bad

```tsx
// components/Button.tsx
export default function Button(props) {
  /* … */
}
```

PascalCase filename that violates `unicorn/filename-case`, default export, no colocated `Props`, variants inlined or hidden in a `*.styles.ts`, component reachable only by a deep file path.

## Good

```text
src/components/bases/button/
  index.ts             # re-exports component + types from button.tsx
  button.tsx           # component; "use client" only when a client API is touched; Props colocated
  button.variants.ts   # tailwind-variants definition + *Variants types
  button.stories.tsx   # Storybook story
```

```tsx
// button.tsx
import { type ComponentPropsWithRef } from "react";
import { Button as AriaButton } from "react-aria-components";

import { buttonVariants, type ButtonVariants } from "./button.variants";

export interface ButtonProps
  extends ComponentPropsWithRef<typeof AriaButton>, ButtonVariants {
  className?: string;
}

export const Button = (props: Readonly<ButtonProps>) => {
  /* … */
};
```

## How to apply

- Lowercase kebab-case filenames such as `button.tsx` and `scroll-area.tsx`, never PascalCase.
- Named export only. No `default` export. The `Props` type is colocated, suffixed `Props`, and exported beside the component.
- A component wrapping a headless primitive types its `Props` as `ComponentPropsWithRef<typeof Primitive>`, such as the react-aria `AriaButton` or the Radix `ScrollArea.Root`, intersected with its `*Variants`. It inherits the primitive's full surface such as ref, ARIA, events, and `data-*`, and never re-lists props by hand. A plain-element component uses `ComponentPropsWithRef<"div">`.
- A layout primitive that can render as a different element is generic over `TElement extends ElementType` defaulting to `"div"` and types its `Props` with the shared `PolymorphicProps<TOwnProps, TElement>` helper from `components/utils/polymorphic-props.ts`, which merges the own props with `ComponentPropsWithRef<TElement>` and an `as?: TElement`. Consumers get the chosen element's full surface and never re-list props by hand. Resolve the tag through an explicit `ElementType` binding such as `const Component: ElementType = as ?? "div"`, then `<Component … />`. The annotation is required so the generic union is a constructable JSX type. Each part of a multi-part primitive such as Grid and GridItem is polymorphic on its own, so variant classes and props land on the chosen tag. Use it to keep semantic markup such as `<nav>`, `<section>`, `<ul>` / `<li>`.
- `"use client"` is the first line **only** when a client API is touched such as state, effect, ref, or event handler. No needless directive on a pure component.
- Variants live in `<name>.variants.ts` via tailwind-variants, never a `.styles.ts`. Variant classes are `fri-<component>-<variant>`.
- Reachability: the package `exports` map is `.` → `./src/index.ts` and `./*` → `./src/*/index.ts`. A file no `index.ts` re-exports is unreachable and does not ship. Wire it or drop it.
- A multi-part primitive keeps every part in the one `<name>.tsx`, sharing one `<name>.variants.ts`, such as Grid and GridItem, or the ScrollArea parts. Only types and the namespace split into sibling files such as `scroll-area.types.ts` and `scroll-area.namespace.ts`. `samples` ship a two-file skeleton of `index.ts` and `<name>.tsx`, with no variants and no stories.
- New component: mirror the `button` folder so the shape stays symmetric.
