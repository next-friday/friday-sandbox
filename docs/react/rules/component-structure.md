# Component Structure

**Rule:** Every `@friday-sandbox/react` component follows one symmetric folder skeleton under `src/components/<tier>/<name>/`. Same file shape, same naming, same export pattern across every component — `button` is the reference.

Tiers:

- `bases` — interactive primitives (button)
- `layouts` — compositional primitives (flex, grid, scroll-area)
- `samples` — Storybook-only demo components (box, long-list, wide-row); **not** re-exported from the public surface

## Bad

```tsx
// components/Button.tsx
export default function Button(props) {
  /* … */
}
```

PascalCase filename (`unicorn/filename-case` violation), default export, no colocated `Props`, variants inlined or hidden in a `*.styles.ts`, component reachable only by a deep file path.

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

- Lowercase kebab-case filenames (`button.tsx`, `scroll-area.tsx`), never PascalCase.
- Named export only — no `default` export. The `Props` type is colocated, suffixed `Props`, and exported beside the component.
- A component wrapping a headless primitive types its `Props` as `ComponentPropsWithRef<typeof Primitive>` (react-aria `AriaButton`, Radix `ScrollArea.Root`) intersected with its `*Variants` — it inherits the primitive's full surface (ref, ARIA, events, `data-*`) and never re-lists props by hand. A plain-element component uses `ComponentPropsWithRef<"div">`.
- A layout primitive that composes onto a consumer's element takes `asChild?: boolean` and renders Radix `Slot.Root` in place of its host tag (`const Component = asChild ? Slot.Root : "div"`), so its variant classes and props merge onto the single child. `Slot` is structural composition, not interaction, so it sits beside the react-aria rule rather than breaking it; it requires exactly one child element.
- `"use client"` is the first line **only** when a client API is touched (state, effect, ref, event handler). No needless directive on a pure component.
- Variants live in `<name>.variants.ts` (tailwind-variants), never a `.styles.ts`. Variant classes are `fri-<component>-<variant>`.
- Reachability: the package `exports` map is `.` → `./src/index.ts` and `./*` → `./src/*/index.ts`. A file no `index.ts` re-exports is unreachable and does not ship — wire it or drop it.
- A multi-part primitive keeps every part in the one `<name>.tsx`, sharing one `<name>.variants.ts` (Grid + GridItem; the ScrollArea parts) — only types and the namespace split into sibling files (`scroll-area.types.ts`, `scroll-area.namespace.ts`). `samples` ship a two-file skeleton (`index.ts` + `<name>.tsx`) — no variants, no stories.
- New component: mirror the `button` folder so the shape stays symmetric.
