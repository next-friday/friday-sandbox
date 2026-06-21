# Semantic Token Scope

**Rule:** Size and radius tokens are scoped to a **semantic family**, never to a literal component name. Place a new component in the family it belongs to; add a new family only when none fits. Every size dimension derives from its family unit `calc(var(--size-{scope}) * N)`: a raw length literal in component CSS is a forked scale and forbidden.

Three scopes:

- `action`: clickable triggers such as button, icon-button, and link-button → `--size-action`, `--radius-action`
- `field`: form data entry such as input, textarea, select, checkbox, and radio → `--size-field`, `--radius-field`
- `box`: containers such as card, modal, alert, and popover → `--size-box`, `--radius-box`

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
  --action-n: 9; /* button is an action; it inherits the action scope */
}
```

Heights derive inline as `calc(var(--size-{scope}) * N)` with N ∈ {7, 8, 9, 11, 13} for xs/sm/md/lg/xl; radius scales linearly from `--radius-{scope}`, the reference radius at `md`. The math is component-local: there are no `--spacing-{scope}-{size}` tokens.

## How to apply

- Before adding a component's CSS, pick its family: is it a trigger for `action`, a data entry for `field`, or a container for `box`? Use that scope's `--size-*` / `--radius-*`.
- Never introduce a token named after the component. If no family fits, add a new **semantic** scope, not a literal one.
- A scrollbar thickness, divider weight, or any other dimension still derives from a family unit via `calc()`, written `calc(var(--size-box) * N)`, never a raw literal. The general form is [`no-magic-values.md`](no-magic-values.md).
- The full engine and the per-size formulas live in [the Styles chapter](../README.md).
