import eslintReact from "@eslint-react/eslint-plugin";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nextFriday from "eslint-plugin-friday";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import reactDoctor from "eslint-plugin-react-doctor";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";

import { config as baseConfig } from "./base.mjs";

/**
 * Shared ESLint configuration for React libraries.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  ...storybook.configs["flat/recommended"],
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,
  reactDoctor.configs.recommended,
  reactRefresh.configs.recommended,
  eslintReact.configs["recommended-typescript"],
  eslintReact.configs["disable-conflict-eslint-plugin-react"],
  eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"],
  nextFriday.configs["react/recommended"],
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
    rules: {
      "unicorn/prevent-abbreviations": [
        "warn",
        {
          replacements: {
            props: false,
            args: false,
            ref: false,
            refs: false,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.stories.{ts,tsx}", "**/.storybook/**/*.{ts,tsx}"],
    rules: {
      "next-friday/jsx-no-data-array": "off",
      "next-friday/jsx-no-data-object": "off",
      "next-friday/jsx-spread-properties-last": "off",
    },
  },
];
