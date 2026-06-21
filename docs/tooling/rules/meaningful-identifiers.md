# Meaningful Identifiers

**Rule:** Every identifier names what it represents, whether a variable, parameter, generic, or callback arg. No single-letter or two-letter shorthands. No `tmp`, `val`, `obj`, `arr`, `fn`, `cb`, `el`, `tw`. And no prose comments: intent lives in names, not in remarks that restate the code.

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

The name comes from **what the thing is**, not where it sits or what type it has. `user`, not `obj`. `nextHandler`, not `fn2`. Pick the replacement by meaning; the table below maps the common offenders by category.

| Category    | Banned                                                           | Use instead                                                                                                   |
| ----------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Generics    | `T`, `U`, `K`, `V`, `E`, `R`, `S`, `P`, `N`, `I`                 | `RenderProps`, `Item`, `Key`, `Value`, `Element`, `Result`, `State`, `Props`, `Node`, `Input`                 |
| Parameters  | `v`, `e`, `i`, `s`, `c`, `t`, `o`, `a`                           | `value`, `event`, `index`, `state`, `child`, `target`, `option`, `accumulator`                                |
| Shortenings | `tw`, `cb`, `fn`, `arr`, `obj`, `el`, `tmp`, `val`, `str`, `num` | `tailwindClasses`, `callback`, `handler`, `items`, `options`, `element`, `previous`, `value`, `text`, `count` |

- Exceptions: `id`, which is universally read as "identifier"; `i` only as the loop counter in a tight `for (let i = 0; ...)` with a short loop body; `_` for explicitly-discarded args. Nothing else.
- Inner callbacks must not shadow outer names. Rename the inner one to the resolved meaning such as `resolved`, `current`, or `next`, not a one-letter alias.

## No prose comments

Intent lives in names, commits, and `docs/`, not in explanatory comments. A comment that restates what the code already says is noise; delete it and let a precise name carry the meaning. The only comment worth keeping encodes a **non-obvious invariant** the code cannot express, such as a threshold's rationale, a spec quirk, or an ordering constraint.

```ts
// bad: restates the code
const height = size * 9; // multiply size by nine

// good: encodes a non-obvious invariant
const height = size * 9; // N=9 is the md step; see docs/styles
```
