# Rule: no eslint suppressions — a firing rule is fixed in the code

A firing ESLint rule marks a defect in the code, never in the rule. Silencing
it moves the defect out of sight and ships it: the next reader inherits a file
that claims to be clean and is not.

Never, in authored source (a generated or gitignored artifact is outside this
rule):

- an inline suppression — `eslint-disable`, `eslint-disable-next-line`,
  `eslint-disable-line`
- a rule turned off, downgraded, or overridden in an ESLint config **in
  response to a firing violation**
- a path added to `globalIgnores` to dodge a rule — ignoring a build artifact
  is configuration, not suppression

Not a suppression — preset design: `packages/eslint-config` deliberately
selects its rule set (the `jsdoc/*` set off in `base.mjs`, the demo-JSX rules
off for stories in `react-internal.mjs`). Changing that selection is a design
decision with its reason in the commit body, made while no violation is
firing — never a reaction to one.

How to apply:

- `pnpm lint` fails? Change the code until it passes clean — rename, split,
  restructure; never annotate.
- Convinced a rule is wrong for the whole repo? That is a preset change in its
  own commit with a stated reason — and the tree passes before and after it.

Pairs with no-typescript-suppressions (the compiler half) and
no-code-comments (a suppression is also a comment).
