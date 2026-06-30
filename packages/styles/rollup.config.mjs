import fs from "node:fs";
import path from "node:path";

import nodeResolvePlugin from "@rollup/plugin-node-resolve";
import typescriptPlugin from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const componentsRoot = "./src/components";

const hasIndexEntry = (name) => {
  const fullPath = path.join(componentsRoot, name);
  const isDirectory = fs.statSync(fullPath).isDirectory();
  const hasIndex = fs.existsSync(path.join(fullPath, "index.ts"));
  const isEntry = isDirectory && hasIndex;
  return isEntry;
};

const toComponentEntry = (name) => [
  `components/${name}/index`,
  `src/components/${name}/index.ts`,
];

const componentEntries = Object.fromEntries(
  fs
    .readdirSync(componentsRoot)
    .filter((name) => hasIndexEntry(name))
    .map((name) => toComponentEntry(name)),
);

const input = {
  index: "src/index.ts",
  ...componentEntries,
};

const peerDependencies = packageJson.peerDependencies ?? {};
const dependencies = packageJson.dependencies ?? {};
const external = [
  ...Object.keys(peerDependencies),
  ...Object.keys(dependencies),
  /^tailwind-variants/,
];

const resolveOptions = {
  extensions: [".js", ".ts"],
};

const typescriptOptions = {
  declaration: false,
  declarationMap: false,
  exclude: ["node_modules", "dist"],
  tsconfig: "./tsconfig.json",
};

export default defineConfig({
  external,
  input,
  output: {
    dir: "dist",
    entryFileNames: "[name].mjs",
    exports: "named",
    format: "es",
    hoistTransitiveImports: false,
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: false,
  },
  plugins: [
    peerDepsExternal(),
    nodeResolvePlugin(resolveOptions),
    typescriptPlugin(typescriptOptions),
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
  },
});
