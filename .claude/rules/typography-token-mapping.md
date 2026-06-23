# Rule: typography token mapping must stay UX/UI-distinct

When mapping a component prop (e.g. button `size` = xs/sm/md/lg/xl) onto the
typography tokens in `packages/styles/src/theme/typography.css`, **every step
must be visually distinct**. Do not collapse multiple sizes onto the same token
just because the token scale has fewer steps than the prop.

## Don't

```css
/* xs and sm look identical; lg and xl look identical — lazy, not UX-friendly */
.fri-button-xs {
  @apply text-label-sm;
}
.fri-button-sm {
  @apply text-label-sm;
}
.fri-button-lg {
  @apply text-label-lg;
}
.fri-button-xl {
  @apply text-label-lg;
}
```

## Do

- Give each size a distinct token so the scale reads as five real steps.
- If the token scale doesn't cover every step, **extend the scale** (add the
  missing token to `typography.css` and mirror it in the `@theme` block of
  `system/theme.css`) — never duplicate to fill the gap.
- Distinction can come from size, weight, or line-height — but adjacent sizes
  must not be pixel-identical.

UX/UI quality outranks the shortest mapping. A design system's job is visible
hierarchy; a lazy collapse erases it.
