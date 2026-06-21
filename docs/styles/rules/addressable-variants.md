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
  /* layout… */
  --button-background: var(
    --color-primary
  ); /* ← ghost. primary lives here, not in a class. */
  @apply h-field-md; /* ← ghost. md lives here, not in a class. */
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
  @apply h-field-md px-4 text-sm;
}
.fri-button-lg {
  @apply h-field-lg px-5 text-base;
}
```

`<Button />` renders `class="fri-button fri-button-primary fri-button-md"`. Every value has a home.

## Why

Ghosts cause:

- **Bugs.** Override paths are asymmetric. `.fri-button-primary { ... }` from a user theme silently does nothing because the class is never emitted.
- **Test confusion.** Cannot assert "renders primary" by class selector, the class isn't there.
- **Documentation drift.** README lists "primary, secondary, …" but only 7 of 8 classes exist in CSS. Future reader cannot grep.
- **Broken symmetry.** Some variants render a class, others don't. The shape of the system depends on a default, not on the variant.
- **Hidden mental model.** "primary is the default" is invisible knowledge. New devs must read source to discover it.

Symmetry is a property of code, not of style preference. Every dimension must be self-describing.

## How to apply

- Before declaring a variant `""` in `tailwind-variants`, ask: does the matching class exist in CSS? If no → write the class. If yes → the empty string is wrong.
- Before baking a "default" set of tokens into a base class, ask: is there an explicit class with the same name as the default? If no → extract the tokens to that class.
- Defaults belong in the `defaultVariants` of `tailwind-variants` or in tooling, not in CSS base rules.
- Raw HTML use, meaning `<button class="fri-button">` alone, is fine, but the base must be either fully neutral so it works alone and looks unstyled, OR carry an explicit duplicate of the default class's tokens so raw use still resolves. Choose one, document it.
- Applies to every dimension: color, size, variant, shape, mode, theme, state. Not just buttons.
