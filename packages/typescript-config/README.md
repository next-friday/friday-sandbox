# @friday-sandbox/typescript-config

Shared TypeScript config presets.

> Internal workspace preset. This package is private and is not published to npm. It is consumed only within this monorepo through `workspace:*`.

## Configs

| Subpath                | Use it for                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `./base.json`          | Any TypeScript package. Strict, `NodeNext`, ES2022. Emits declarations.                  |
| `./nextjs.json`        | Next.js apps. Extends base, adds the Next plugin and `Bundler` resolution with `noEmit`. |
| `./react-library.json` | React libraries. Extends base, sets `jsx: "react-jsx"`.                                  |

`nextjs.json` and `react-library.json` both extend `base.json`.

## Installation

```jsonc
// package.json
{
  "devDependencies": {
    "@friday-sandbox/typescript-config": "workspace:*",
    "typescript": "^5",
  },
}
```

## Quick start

Extend the config that matches your package type from `tsconfig.json`.

Base config:

```jsonc
// tsconfig.json
{
  "extends": "@friday-sandbox/typescript-config/base.json",
  "include": ["src"],
}
```

Next.js apps:

```jsonc
// tsconfig.json
{
  "extends": "@friday-sandbox/typescript-config/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
}
```

React libraries:

```jsonc
// tsconfig.json
{
  "extends": "@friday-sandbox/typescript-config/react-library.json",
  "include": ["src"],
}
```

## License

[MIT](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE)
