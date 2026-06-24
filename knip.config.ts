import { type KnipConfig } from "knip";

const cssImportPattern = /@import\s+["']([^"']+)["']/g;

const config: KnipConfig = {
  compilers: {
    css: (text) =>
      [...text.matchAll(cssImportPattern)]
        .map(([, importPath]) => `import "${importPath}";`)
        .join("\n"),
  },
  workspaces: {
    "packages/styles": {
      entry: ["scripts/{codegen,validate}.js"],
      project: ["**/*.css", "scripts/**/*.js"],
    },
    "packages/eslint-config": {
      ignoreDependencies: ["eslint-import-resolver-typescript"],
    },
    "packages/react": {
      ignore: ["vitest.shims.d.ts"],
    },
  },
};

export default config;
