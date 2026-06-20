# Accessibility and Stories

**Rule:** Every interactive component is keyboard-operable and screen-reader-correct, and every Storybook story proves it while reading as consumer documentation. Stories are the deployed reference for people using the component — never a contributor scratchpad.

## Accessibility

- Keyboard reachable, focus visible, ARIA only where the DOM does not already convey intent.
- No pointer-only interactions — every click target also responds to the keyboard.
- Motion respects `prefers-reduced-motion`.
- The component's story passes `addon-a11y`; a known violation blocks the PR.

## Stories

- A new or changed visible behavior ships story coverage of the main states: `Default`, `Hovered` (`play` + `userEvent.hover`), `Focused` (`play` + `element.focus()`), `Disabled`, and every color variant including `danger`. `button.stories.tsx` is the reference layout.
- Use real props, not mocked data, so `addon-a11y` exercises the real component.
- Tests run in Vitest browser mode via `@storybook/addon-vitest` with Playwright chromium. Prefer Storybook `play` functions over imperative DOM assertions; cover keyboard paths alongside pointer paths.

## Consumer-facing copy

Story copy is written for someone using the component in their own app.

### Bad

```tsx
// description that leaks internals
description: "Maps to .fri-button-danger. tailwind-variants computes calc(var(--size-action) * N).";
```

### Good

```tsx
description: "Use the danger color for destructive actions like delete.";
```

Flag any of these in a description, prop `description`, or `parameters.docs.description.story`: internal class names (`fri-button-*`, `fri-flex-*`), library names (`tailwind-variants`, `react-aria`, `react-aria-components`), engine math (`calc(var(--size-action) * N)`), file paths, or QA notes ("Rendered in mobile viewport to verify …"). Those belong in [the Styles chapter](../../styles/README.md) and [`CONTRIBUTING.md`](../../../CONTRIBUTING.md).

## How to apply

- Keep the story shape symmetric across files: one-line summary → `## Import` → import snippet → `## Anatomy` → anatomy snippet. The import snippet imports only the component value, never its prop types; the `## Anatomy` block is a `tsx` fence showing the component's named parts as a JSX tree — nest a part that owns child parts, self-close one that has none (`<Button />`), and include a prop only where it distinguishes a part (`orientation="vertical"`). Required for every component. Same `gap` / `gapX` / `gapY` / `className` wording across layout primitives; same second-person tone ("Pick …", "Use …"). One story drifting from the others is a finding.
