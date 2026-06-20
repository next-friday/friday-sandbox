<p align="center">
  <a href="https://github.com/next-friday/friday-sandbox">
    <h1 align="center">Friday UI</h1>
  </a>
</p>

<p align="center">
  Accessible React 19 components on <code>react-aria-components</code> and Tailwind CSS v4 — friendly for first-time builders and AI helpers alike.
</p>

<p align="center">
  <a href="https://github.com/next-friday/friday-sandbox/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@friday-sandbox/react?style=flat" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/@friday-sandbox/react">
    <img src="https://img.shields.io/npm/dm/@friday-sandbox/react.svg?style=flat-round" alt="npm downloads">
  </a>
  <a href="https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml">
    <img src="https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
</p>

`friday-sandbox` is a pnpm + Turborepo monorepo. It ships a small, polished set of accessible React components and the design-token CSS, ESLint, and TypeScript foundations they stand on.

## Packages

| Package                                                           | What it is                                                  | npm       |
| ----------------------------------------------------------------- | ----------------------------------------------------------- | --------- |
| [`@friday-sandbox/react`](packages/react)                         | The components — button today, layout primitives, and more. | published |
| [`@friday-sandbox/styles`](packages/styles)                       | The look-and-feel — design tokens and Tailwind v4 layers.   | published |
| [`@friday-sandbox/eslint-config`](packages/eslint-config)         | Shared ESLint flat-config presets.                          | internal  |
| [`@friday-sandbox/typescript-config`](packages/typescript-config) | Shared TypeScript config presets.                           | internal  |

## Quick start

```bash
pnpm add @friday-sandbox/react @friday-sandbox/styles
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@friday-sandbox/styles";
```

```tsx
import { Button } from "@friday-sandbox/react";

export function Save() {
  return <Button onPress={() => save()}>Save changes</Button>;
}
```

Full install, theming, and component usage live in each package's README: [`@friday-sandbox/react`](packages/react/README.md) and [`@friday-sandbox/styles`](packages/styles/README.md).

## Playground

Every component renders in **Storybook** — each piece in every state, ready to explore. The playground is built from `packages/react` and deployed via [`vercel.json`](vercel.json).

## Contributing

Issues, ideas, and pull requests are welcome — start with [`CONTRIBUTING.md`](CONTRIBUTING.md). New to the codebase? [`docs/onboarding.md`](docs/onboarding.md) maps it and points you to the right document. Everyone here follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Report vulnerabilities privately through GitHub rather than a public issue — see [`.github/SECURITY.md`](.github/SECURITY.md).

## License

[Apache-2.0](LICENSE) — free to use, including commercially.
