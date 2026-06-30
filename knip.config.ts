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
    "packages/styles": {
      project: ["src/**/*.ts", "**/*.css"],
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
