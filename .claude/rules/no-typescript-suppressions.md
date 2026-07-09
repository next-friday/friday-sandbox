# Rule: no typescript suppressions — a type error is fixed in the types

A compiler error is the type system catching a real mismatch. Every silencer
keeps the mismatch and hides the evidence.

Never, in authored source (a generated or gitignored artifact — `.next/`,
`apps/docs/.source/` — is outside this rule):

- `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`
- an escape cast dodging an error — `any`, `as unknown as`; a plain `as T`
  assertion of a known shape is not an escape
- loosening `strict`, `noUncheckedIndexedAccess`, or any other check in a
  `tsconfig.json`

How to apply:

- The compiler complains? Correct the code until it type-checks — widen from
  the real source type (`ComponentPropsWithRef<typeof X>`), `Omit` the true
  conflict, narrow with a guard.
- A third-party type is genuinely wrong? Wrap it once at the boundary with a
  typed adapter and a stated reason in the commit body — never scatter casts.

Pairs with no-eslint-suppressions (the linter half) and no-code-comments (a
suppression is also a comment).
