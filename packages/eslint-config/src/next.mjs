import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginNext from "@next/eslint-plugin-next";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import reactDoctor from "eslint-plugin-react-doctor";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";

import { config as baseConfig } from "./base.mjs";

/**
 * Shared ESLint configuration for Next.js apps.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,
  reactDoctor.configs.next,
  reactRefresh.configs.next,
  globalIgnores([
    ".next/**",
    ".source/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.serviceworker },
    },
    settings: { react: { version: "detect" } },
  },
  {
    plugins: { "react-hooks": pluginReactHooks },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    plugins: { "@next/next": pluginNext },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    rules: {
      "unicorn/prevent-abbreviations": [
        "warn",
        {
          replacements: {
            props: false,
            args: false,
            ref: false,
            refs: false,
            params: false,
          },
        },
      ],
    },
  },
  {
    files: ["mdx-components.tsx"],
    rules: {
      "next-friday/jsx-no-data-array": "off",
      "next-friday/jsx-no-data-object": "off",
      "next-friday/jsx-spread-properties-last": "off",
    },
  },
];
