import { type KnipConfig } from "knip";

const cssImportPattern = /@import\s+["']([^"']+)["']/g;
const mdxImportPattern = /import\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g;

const config: KnipConfig = {
  ignore: ["turbo/generators/**"],
  ignoreDependencies: ["@turbo/gen", "@friday-sandbox/typescript-config"],
  compilers: {
    css: (text) =>
      [...text.matchAll(cssImportPattern)]
        .map(([, importPath]) => `import "${importPath}";`)
        .join("\n"),
    mdx: (text) =>
      [...text.matchAll(mdxImportPattern)]
        .map(([, importPath]) => `import "${importPath}";`)
        .join("\n"),
  },
  workspaces: {
    "packages/component-generator": {
      entry: ["src/cli.ts", "src/axes.ts", "test/*.check.ts"],
      project: ["src/**/*.ts", "test/**/*.ts"],
    },
    "packages/styles": {
      entry: ["scripts/copy-css.ts", "scripts/fix-css-attributes.ts"],
      project: ["scripts/**/*.ts", "**/*.css", "*.mjs"],
      ignoreDependencies: ["@tailwindcss/cli"],
    },
    "packages/eslint-config": {
      ignoreDependencies: ["eslint-import-resolver-typescript"],
    },
    "packages/react": {
      ignore: ["vitest.shims.d.ts"],
    },
    "packages/typescript-config": {
      ignoreUnresolved: ["next"],
    },
    "apps/docs": {
      entry: ["source.config.ts", "mdx-components.tsx", "content/**/*.mdx"],
      project: ["**/*.{ts,tsx}", "content/**/*.mdx"],
    },
  },
};

export default config;
