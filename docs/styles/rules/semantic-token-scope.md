# Semantic Token Scope

**Rule:** Size and radius tokens are scoped to a **semantic family**, never to a literal component name. Place a new component in the family it belongs to; add a new family only when none fits. Every size dimension derives from its family unit `calc(var(--size-{scope}) * N)`: a raw length literal in component CSS is a forked scale and forbidden.

Three scopes. The shipped component for each is named first; the rest are illustrative of what the family is for:

- `action`: clickable triggers, e.g. button, icon-button, link-button → `--size-action`, `--radius-action`
- `field`: form data entry, e.g. input, textarea, select, checkbox, radio → `--size-field`, `--radius-field`
- `box`: containers, e.g. scroll-area, card, modal, popover → `--size-box`, `--radius-box`

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

Heights derive inline as `calc(var(--size-{scope}) * N)` with N ∈ {7, 8, 10, 11, 12} for xs/sm/md/lg/xl. Radius derives as `--radius-{scope} * height / (--size-{scope} * N_md)`, so it equals `--radius-{scope}` at `md` and curves with height, smaller below and larger above. The math is component-local: there are no `--spacing-{scope}-{size}` tokens.

## Why

The scope unit is the single knob that tunes a whole family. Override `--size-action` once and every action component, at every size, rescales in step, because they all multiply that one unit. A literal `--size-button` forks the button out of the family: it no longer follows the shared rhythm, and a consumer who retunes `--size-action` to resize their triggers finds the button left behind. Naming the token after the component also leaks an implementation detail that a sibling component cannot reuse. A semantic scope keeps the unit shared, re-themable from one place, and open for the next component to join.

## How to apply

- Before adding a component's CSS, pick its family: is it a trigger for `action`, a data entry for `field`, or a container for `box`? Use that scope's `--size-*` / `--radius-*`.
- Never introduce a token named after the component. If no family fits, add a new **semantic** scope, not a literal one.
- A scrollbar thickness, divider weight, or any other dimension still derives from a family unit via `calc()`, written `calc(var(--size-box) * N)`, never a raw literal. The general form is [`no-magic-values.md`](no-magic-values.md).
- The full engine and the per-size formulas live in [the Styles chapter](../README.md).
