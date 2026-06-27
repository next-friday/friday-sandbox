<div align="center">

# @friday-sandbox/react

**Accessible React components built on react-aria-components and Tailwind CSS v4.**

[![npm version](https://img.shields.io/npm/v/@friday-sandbox/react?style=flat)](https://www.npmjs.com/package/@friday-sandbox/react)
[![npm downloads](https://img.shields.io/npm/dm/@friday-sandbox/react.svg?style=flat)](https://www.npmjs.com/package/@friday-sandbox/react)
[![License](https://img.shields.io/npm/l/@friday-sandbox/react?style=flat)](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
[![CI](https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml)

[Components](#components) · [Quick start](#quick-start) · [Contributing](https://github.com/next-friday/friday-sandbox/blob/main/CONTRIBUTING.md)

</div>

## Why

- **Accessible by default.** Interactive components wrap [react-aria-components](https://react-spectrum.adobe.com/react-aria/) and radix-ui; layout and text components use semantic HTML. Keyboard and screen-reader support come standard.
- **Themeable without forking.** Components read their styling from the CSS variables in `@friday-sandbox/styles`. Restyle by overriding tokens, not by overriding components.
- **Polymorphic components.** `Flex`, `Grid`, and `Text` render as any element through an `as` prop, with the correct typed props forwarded.
- **Tiny by default.** Written in TypeScript with `sideEffects: false`, so bundlers keep only what you import.

## Installation

```sh
npm install @friday-sandbox/react @friday-sandbox/styles
# or
pnpm add @friday-sandbox/react @friday-sandbox/styles
# or
yarn add @friday-sandbox/react @friday-sandbox/styles
```

Requires React 19 and Tailwind CSS v4. `@friday-sandbox/styles` is a peer dependency and supplies the component CSS.

## Quick start

Import Tailwind and the styles once at your app root:

```css
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

Browse every component, its props, and live examples in Storybook, deployed on every push. Run it locally with `pnpm dev:storybook`.

## License

[MIT](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
