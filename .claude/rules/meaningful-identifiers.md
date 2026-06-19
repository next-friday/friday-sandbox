---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.mts"
  - "**/*.cts"
  - "**/*.js"
  - "**/*.jsx"
  - "**/*.mjs"
  - "**/*.cjs"
---

# Meaningful Identifiers

**Rule:** Every identifier — variable, parameter, generic, callback arg — names what it represents. No single-letter or two-letter shorthands. No `tmp`, `val`, `obj`, `arr`, `fn`, `cb`, `el`, `tw`.

## Bad

```ts
export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (c) => clsx(tw, c));
}
```

`T`, `v`, `tw`, `c` carry zero meaning. Reader must scroll, infer, and re-read every time.

## Good

```ts
export function composeTailwindRenderProps<RenderProps>(
  className: string | ((renderProps: RenderProps) => string) | undefined,
  tailwindClasses: string,
): string | ((renderProps: RenderProps) => string) {
  return composeRenderProps(className, (resolved) =>
    clsx(tailwindClasses, resolved),
  );
}
```

Names read straight: `RenderProps` is the render-prop value, `tailwindClasses` is the Tailwind class string, `resolved` is the resolved className from the callback.

## Why

Identifier length is the cheapest possible documentation. `v: T` forces every reader to reverse-engineer the type system; `renderProps: RenderProps` says it once. Renames cost nothing at write time and save reading time forever.

## How to apply

- Generics: `T`, `U`, `K`, `V`, `E`, `R`, `S`, `P`, `N`, `I` → name them (`RenderProps`, `Item`, `Key`, `Value`, `Element`, `Result`, `State`, `Props`, `Node`, `Input`).
- Parameters: `v`, `e`, `i`, `s`, `c`, `t`, `o`, `a` → name them (`value`, `event`, `index`, `state`, `child`, `target`, `option`, `accumulator`).
- Shortenings: `tw`, `cb`, `fn`, `arr`, `obj`, `el`, `tmp`, `val`, `str`, `num` → spell out (`tailwindClasses`, `callback`, `handler`, `items`, `options`, `element`, `previous`, `value`, `text`, `count`).
- Exceptions: `id` (universally read as "identifier"), `i` only as the loop counter in a tight `for (let i = 0; ...)` whose body fits on screen, `_` for explicitly-discarded args. Nothing else.
- A new name must describe **what the thing is**, not **what type it has**. `user`, not `obj`. `nextHandler`, not `fn2`.
- Inner callbacks must not shadow outer names. Rename the inner one to the resolved meaning (`resolved`, `current`, `next`), not a one-letter alias.
