---
paths:
  - "packages/styles/src/**/*.css"
  - "packages/react/src/**/*.variants.ts"
---

# Semantic Token Scope

**Rule:** Size and radius tokens are scoped to a **semantic family**, never to a literal component name. Place a new component in the family it belongs to; add a new family only when none fits.

Three scopes:

- `action` — clickable triggers (button, icon-button, link-button) → `--size-action`, `--radius-action`
- `field` — form data entry (input, textarea, select, checkbox, radio) → `--size-field`, `--radius-field`
- `box` — containers (card, modal, alert, popover) → `--size-box`, `--radius-box`

## Bad

```css
.fri-button {
  --size-button: 0.25rem; /* ← literal-component scope */
  --radius-button: 0.5rem;
}
```

A `--*-button-*`, `--*-input-*`, or `--*-card-*` token forks the rhythm per component and breaks the shared scale.

## Good

```css
.fri-button {
  --action-n: 10; /* button is an action; it inherits the action scope */
}
```

Heights derive inline as `calc(var(--size-{scope}) * N)` with N ∈ {6, 8, 10, 12, 14} for xs/sm/md/lg/xl; radius scales linearly from `--radius-{scope}` (the reference radius at `md`). The math is component-local — there are no `--spacing-{scope}-{size}` tokens.

## How to apply

- Before adding a component's CSS, pick its family: is it a trigger (`action`), a data entry (`field`), or a container (`box`)? Use that scope's `--size-*` / `--radius-*`.
- Never introduce a token named after the component. If no family fits, add a new **semantic** scope, not a literal one.
- The full engine and the per-size formulas live in [`docs/architecture.md`](../../docs/architecture.md) and [`docs/formulas.md`](../../docs/formulas.md).
