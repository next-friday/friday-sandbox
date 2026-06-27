# @friday-sandbox/eslint-config

Shared ESLint flat-config presets (base, next-js, react-internal) for @friday-sandbox packages and apps.

> Internal workspace preset. This package is private and is not published to npm. It is consumed only within this monorepo through `workspace:*`.

## Presets

| Subpath            | Named export   | Use it for                                            |
| ------------------ | -------------- | ----------------------------------------------------- |
| `./base`           | `config`       | Any TypeScript package: JS, imports, JSDoc, Prettier. |
| `./next-js`        | `nextJsConfig` | Next.js apps: adds React, a11y, and Next rules.       |
| `./react-internal` | `config`       | React libraries: adds React, a11y, and Storybook.     |

`next-js` and `react-internal` both extend `base`.

## Installation

```jsonc
// package.json
{
  "devDependencies": {
    "@friday-sandbox/eslint-config": "workspace:*",
    "eslint": "^9",
    "typescript": "^5",
  },
}
```

## Usage

Create an `eslint.config.mjs` and re-export the preset for your package type.

Base preset:

```js
// eslint.config.mjs
export { config as default } from "@friday-sandbox/eslint-config/base";
```

Next.js apps:

```js
// eslint.config.mjs
export { nextJsConfig as default } from "@friday-sandbox/eslint-config/next-js";
```

React libraries:

```js
// eslint.config.mjs
export { config as default } from "@friday-sandbox/eslint-config/react-internal";
```

To extend a preset, spread it into your own flat config:

```js
// eslint.config.mjs
import { config } from "@friday-sandbox/eslint-config/react-internal";

export default [
  ...config,
  {
    rules: {
      // project overrides
    },
  },
];
```

## License

[MIT](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
