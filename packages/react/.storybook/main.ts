import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Resolve the directory of a package by name — robust under pnpm/monorepo hoisting.
 * @param {string} value - The package name to resolve.
 * @returns {string} The absolute path to the package's directory.
 */
function getAbsolutePath(value: string): string {
  return path.dirname(
    fileURLToPath(import.meta.resolve(`${value}/package.json`)),
  );
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mcp"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
    }),
};

export default config;
