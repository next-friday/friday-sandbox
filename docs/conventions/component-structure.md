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
- `"use client"` is the first line **only** when a client API is touched (state, effect, ref, event handler). No needless directive on a pure component.
- Variants live in `<name>.variants.ts` (tailwind-variants), never a `.styles.ts`. Variant classes are `fri-<component>-<variant>`.
- Reachability: the package `exports` map is `.` → `./src/index.ts` and `./*` → `./src/*/index.ts`. A file no `index.ts` re-exports is unreachable and does not ship — wire it or drop it.
- Multi-part primitives split into sibling files (`grid.item.tsx`, `scroll-area.types.ts`, `scroll-area.namespace.ts`). `samples` ship a two-file skeleton (`index.ts` + `<name>.tsx`) — no variants, no stories.
- New component: mirror the `button` folder so the shape stays symmetric.
