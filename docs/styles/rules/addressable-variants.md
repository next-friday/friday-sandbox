# Addressable Variants

**Rule:** Every named value, whether variant, size, color, mode, or state, must exist as a real, **addressable** artifact: a class, prop value, or enum entry. A default baked into a base rule with no companion class is a **ghost**: the system claims to support it, but it cannot be inspected, selected, or overridden. Forbidden in every dimension.

## Bad

`tailwind-variants` with phantom defaults:

```ts
variants: {
  variant: {
    primary: "",                       // ← ghost. primary has no real class.
    secondary: "fri-button-secondary",
  },
  size: {
    md: "",                            // ← ghost. md has no real class.
    lg: "fri-button-lg",
  },
},
```

CSS with baked-in defaults:

```css
.fri-button {
  /* layout */
  --button-color: var(
    --primary
  ); /* ← ghost. primary lives here, not a class. */
  --action-n: 10; /* ← ghost. md lives here, not in a class. */
}
.fri-button-secondary {
  /* override */
}
.fri-button-lg {
  /* override */
}
```

`<Button />` renders `class="fri-button"`. Where is `primary`? Where is `md`? They are nowhere. Override paths are asymmetric.

## Good

Every variant value is a real class. Defaults are applied by tooling, not by hiding:

```ts
variants: {
  variant: {
    primary: "fri-button-primary",
    secondary: "fri-button-secondary",
  },
  size: {
    md: "fri-button-md",
    lg: "fri-button-lg",
  },
},
defaultVariants: { variant: "primary", size: "md" },
```

```css
.fri-button {
  /* structural only */
}
.fri-button-primary {
  /* color tokens */
}
.fri-button-secondary {
  /* color tokens */
}
.fri-button-md {
  --action-n: var(--action-n-md);
  @apply text-sm;
}
.fri-button-lg {
  --action-n: var(--action-n-lg);
  @apply text-base;
}
```

`<Button />` renders `class="fri-button fri-button-primary fri-button-md"`. Every value has a home.

## Why

Ghosts cause:

- **Bugs.** Override paths are asymmetric. `.fri-button-primary { ... }` from a user theme silently does nothing because the class is never emitted.
- **Test confusion.** Cannot assert "renders primary" by class selector, the class isn't there.
- **Documentation drift.** A README that lists "primary, secondary" and more can name a value whose class is missing from CSS. A future reader cannot grep what was never emitted.
- **Broken symmetry.** Some variants render a class, others don't. The shape of the system depends on a default, not on the variant.
- **Hidden mental model.** "primary is the default" is invisible knowledge. New devs must read source to discover it.

Each failure is the same root cause: a value that is named but not addressable. Making every dimension self-describing, one class per value, removes all five at once.

## How to apply

- Before declaring a variant `""` in `tailwind-variants`, ask: does the matching class exist in CSS? If no → write the class. If yes → the empty string is wrong.
- Before baking a "default" set of tokens into a base class, ask: is there an explicit class with the same name as the default? If no → extract the tokens to that class.
- Defaults belong in the `defaultVariants` of `tailwind-variants` or in tooling, not in CSS base rules.
- Raw HTML use, meaning `<button class="fri-button">` with no variant class, must still resolve. Pick one of the next two strategies for the base and document the choice.
  - **Neutral base:** the base carries no default tokens, so the bare element renders unstyled and every look comes from an addressable class.
  - **Self-applying base:** the base carries an explicit duplicate of the default class's tokens, so the bare element resolves to the default while the named class still exists for selection and override.
- Applies to every dimension: color, size, variant, shape, mode, theme, state. Not just buttons.
