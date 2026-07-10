---
paths:
  - "packages/**"
---

# Rule: class name contract — two packages linked by one class name

The visual contract is split across the two packages and linked **by the class
name**. `styles` owns the CSS half: each component's file
(`src/components/<name>.css`) defines the `fri-<name>` class plus
`fri-<name>-<value>` modifier classes under `@layer components`. `react` owns
the JS half: each component's `tv()` variant map (`<name>.styles.ts`,
co-located with `<name>.tsx` in `packages/react/src/components/bases/<name>/`)
maps its props to that same set of class names. The two halves are mirrored
1:1 across the package boundary — a deterministic gate fails on an orphan
class on either side, and on any variant value that is not a `fri-*` class
(a raw Tailwind utility in a variant map bypasses the whole contract).

The shared spacing utilities are the deliberate exception. Padding and gap live
in `layers/spacing.css` as global `fri-p-*`/`fri-gap-*` classes — not
`fri-<name>`-prefixed, one file every component shares — so a variant map
consumes them by spreading `paddingVariants`/`gapVariants` (and their slot forms)
from `components/utils/spacing-variants.ts`, not by declaring its own. Being
global they fall outside the per-component mirror gate; their `styles` ↔ `react`
parity rests on the shared map that names them.

`react` wraps its own variant map in an accessible component; it declares no
CSS of its own. Because the CSS half of the contract is a plain, framework-
agnostic class name, the same look applies to a hand-written element that
reproduces the class names by hand, not only the React component.

Pairs with styles-upstream (which package leads) and token-pipeline (what the
CSS half consumes).
