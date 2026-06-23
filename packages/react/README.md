# @friday-sandbox/react

Accessible React UI components built on react-aria-components and Tailwind CSS v4.

<p>
  <a href="https://www.npmjs.com/package/@friday-sandbox/react">
    <img src="https://img.shields.io/npm/v/@friday-sandbox/react?style=flat" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@friday-sandbox/react">
    <img src="https://img.shields.io/npm/dm/@friday-sandbox/react.svg?style=flat" alt="npm downloads">
  </a>
  <a href="https://github.com/next-friday/friday-sandbox/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@friday-sandbox/react?style=flat" alt="License">
  </a>
  <a href="https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml">
    <img src="https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
</p>

## Features

- **Accessible by default.** Interaction, focus, and ARIA are handled by [react-aria-components](https://react-spectrum.adobe.com/react-aria/), so keyboard and screen-reader support ship with every component.
- **Tailwind CSS v4 styling.** Components consume the design tokens and component classes from `@friday-sandbox/styles`, themeable through CSS variables.
- **Polymorphic layout primitives.** `Flex` and `Grid` render as any element via an `as` prop and forward the correct typed props.
- **Typed and tree-shakeable.** Written in TypeScript with `sideEffects: false`, so bundlers drop what you do not import.

## Requirements

- React 19
- Tailwind CSS v4
- `@friday-sandbox/styles` (peer dependency, supplies the component CSS)

## Installation

```bash
npm install @friday-sandbox/react @friday-sandbox/styles
# or
pnpm add @friday-sandbox/react @friday-sandbox/styles
# or
yarn add @friday-sandbox/react @friday-sandbox/styles
```

## Usage

Import Tailwind and the styles package once at your application root:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@friday-sandbox/styles";
```

Then render a component anywhere:

```tsx
import { Button } from "@friday-sandbox/react";

export function Save() {
  return <Button onPress={() => save()}>Save changes</Button>;
}
```

## Components

| Export             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `Button`           | Accessible button with color, variant, and size props. |
| `Flex`             | Polymorphic flexbox primitive.                         |
| `Grid`, `GridItem` | Polymorphic grid primitive and its item.               |
| `ScrollArea`       | Styled, accessible scroll container.                   |

Every component renders to a Storybook story. Storybook is built from this package and deployed on every push. The setup lives in [`packages/react`](https://github.com/next-friday/friday-sandbox/tree/main/packages/react); run it locally with `pnpm dev:storybook`.

## Troubleshooting

- **Styles are not applied.** The CSS import is missing. Add `@import "@friday-sandbox/styles";` after `@import "tailwindcss";` at your app root.
- **Build or type errors on import.** React 19 and Tailwind CSS v4 are required. Older majors are not supported.

## License

[Apache-2.0](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
