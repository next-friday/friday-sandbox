# Accessibility and Stories

**Rule:** Every interactive component is keyboard-operable and screen-reader-correct, and every Storybook story proves it while reading as consumer documentation. Stories are the deployed reference for people using the component, never a contributor scratchpad.

## Why

A story is two things at once: the accessibility check `addon-a11y` runs against the real component, and the page a consumer reads to learn the component. Keeping both honest in one place means the docs cannot drift from the behaviour, and a regression in either fails the same review.

## Accessibility

### Bad

```tsx
// pointer-only: click works, keyboard does not
<div role="button" onClick={remove}>
  Delete
</div>
```

### Good

```tsx
// the primitive gives keyboard, focus ring, and ARIA for free
<Button onPress={remove}>Delete</Button>
```

- Keyboard reachable, focus visible, ARIA only where the DOM does not already convey intent.
- No pointer-only interactions. Every click target also responds to the keyboard.
- Motion respects `prefers-reduced-motion`.
- The component's story passes `addon-a11y`; a known violation blocks the PR.

## Stories

`button.stories.tsx` is the reference layout. It ships `Default` driven by the `args`, then one story per axis the component exposes: the `variant`, `color`, and `size` matrices, plus focused demos such as `WithIcon`, `IconOnly`, and the `PlainHtml` composition. Each carries a consumer-facing `description`.

### Bad

```tsx
// a single Default with no coverage of the variants the component ships
export const Default: Story = {};
```

### Good

```tsx
export const Default: Story = {};

export const Colors: Story = {
  render: (storyArgs) => (
    <Flex direction="column" gap="md">
      {COLORS.map((color) => (
        <Button key={color.value} {...storyArgs} color={color.value}>
          {color.label}
        </Button>
      ))}
    </Flex>
  ),
};
```

- Ship a `Default` plus a story for every visible axis the component exposes, including each color variant such as `danger`.
- Use real props, not mocked data, so `addon-a11y` exercises the real component.
- Tests run in Vitest browser mode via `@storybook/addon-vitest` with Playwright chromium.
- Where an interaction adds value the static render cannot show, such as a hover, focus, or pressed state, a `play` function with `userEvent` is recommended to drive and assert it. Cover keyboard paths alongside pointer paths.

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

In story and description copy, that is a `description`, a prop `description`, or `parameters.docs.description.story`, flag any of these:

- internal class names such as `fri-button-*` and `fri-flex-*`
- library names such as `tailwind-variants`, `react-aria`, `react-aria-components`, and `radix-ui`
- engine math such as `calc(var(--size-action) * N)`
- file paths, or QA notes that read like "Rendered in mobile viewport to verify …"

This flag is scoped to copy. The same library and class names are expected in the [Styles chapter](../../styles/README.md), [`CONTRIBUTING.md`](../../../CONTRIBUTING.md), and the other component rules.

### Generic over specific

Copy says what a prop _does_, not the concrete output it produces. A pixel size such as `36 px tall`, a baked-in default, or an exhaustive list of a prop's values all drift the moment the implementation changes, and every drift is a doc edit waiting to be forgotten. Describe the behavior in stable terms and let the stories demonstrate the values. Lead with the imperative second-person form a reader scanning a prop table expects: `Use the <code>size</code> prop to change the size of the button.`

#### Bad

```tsx
// brittle: restates values that drift
description: "`md` is the default at 36 px tall; `lg`/`xl` for hero actions.";
```

#### Good

```tsx
description: "Use the `size` prop to change the size of the button.";
```

Also flag in copy: pixel sizes or other concrete dimensions, and an exhaustive enumeration of a prop's values.

## How to apply

Keep the story shape symmetric across files. Each story starts with a one-line summary, then `## Import`, the import snippet, `## Anatomy`, and the anatomy snippet:

- The import snippet imports only the component value, never its prop types.
- The `## Anatomy` block is a `tsx` fence showing the component's named parts as a JSX tree: nest a part that owns child parts, self-close one that has none such as `<Button />`, and include a prop only where it distinguishes a part such as `orientation="vertical"`.
- The `## Import` and `## Anatomy` sections are required for every component.
- Use the same `gap` / `gapX` / `gapY` / `className` wording across the layout primitives.
- Use the same second-person tone throughout, such as "Pick …" or "Use …".
- One story drifting from the others is a finding.
