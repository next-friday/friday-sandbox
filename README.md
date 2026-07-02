<div align="center">

# friday-sandbox

**Accessible React components and a framework-agnostic, CSS-variable design system.**

[![CI](https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml/badge.svg)](https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/next-friday/friday-sandbox?style=flat)](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)

[Packages](#packages) · [Quick start](#quick-start) · [Contributing](https://github.com/next-friday/friday-sandbox/blob/main/CONTRIBUTING.md)

</div>

## Why friday-sandbox

- **Accessible by default.** Components build on [react-aria-components](https://react-spectrum.adobe.com/react-aria/) and radix-ui, so keyboard and screen-reader support ship as standard.
- **Theme anywhere.** Styling is plain CSS variables. Retheme React, plain HTML, WordPress, or PHP by overriding tokens, with no build step, plugin, or JavaScript.
- **Hand-authored, derived tokens.** Set a handful of seed tokens per mode; surfaces, tiers, and interaction states derive automatically via `color-mix`. No spec, no build step.
- **Typed and tree-shakeable.** TypeScript throughout, `sideEffects: false`, so bundlers drop what you do not import.

## Packages

| Package                                                                                                     | Description                                                                     |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`@friday-sandbox/react`](./packages/react) · [npm](https://www.npmjs.com/package/@friday-sandbox/react)    | Accessible React components built on react-aria-components and Tailwind CSS v4. |
| [`@friday-sandbox/styles`](./packages/styles) · [npm](https://www.npmjs.com/package/@friday-sandbox/styles) | Framework-agnostic design tokens and Tailwind CSS v4 layers.                    |
| [`@friday-sandbox/eslint-config`](./packages/eslint-config)                                                 | Shared ESLint flat-config presets.                                              |
| [`@friday-sandbox/typescript-config`](./packages/typescript-config)                                         | Shared TypeScript config presets.                                               |

## Quick start

```sh
npm install @friday-sandbox/react @friday-sandbox/styles
```

Import the styles once at your app root, after Tailwind:

```css
@import "tailwindcss";
@import "@friday-sandbox/styles";
```

Render a component anywhere:

```tsx
import { Button } from "@friday-sandbox/react";

export function Save() {
  return <Button onPress={() => save()}>Save changes</Button>;
}
```

## Documentation

- **Components.** Browse and interact in Storybook, deployed on every push. Run it locally with `pnpm dev:storybook`.
- **Theming.** Tokens are hand-authored CSS variables — seeds you edit plus derived tokens; see [`@friday-sandbox/styles`](./packages/styles#theming) for the override template.
- **Contributing.** The issue → PR workflow and the full gate list are in [CONTRIBUTING.md](https://github.com/next-friday/friday-sandbox/blob/main/CONTRIBUTING.md).

## License

[MIT](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
