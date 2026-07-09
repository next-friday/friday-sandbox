import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

import type { StorybookConfig } from "@storybook/react-vite";

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
      optimizeDeps: {
        include: [
          "react-aria-components/Button",
          "react-aria-components/Input",
          "react-aria-components/Link",
          "react-aria-components/Separator",
          "react-aria-components/Text",
          "react-aria-components/composeRenderProps",
        ],
      },
      plugins: [tailwindcss()],
    }),
};

export default config;
