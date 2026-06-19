import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import n from "eslint-plugin-n";
import nextFriday from "eslint-plugin-friday";
import onlyWarn from "eslint-plugin-only-warn";
import sonarjs from "eslint-plugin-sonarjs";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import turboPlugin from "eslint-plugin-turbo";
import unicorn from "eslint-plugin-unicorn";

/**
 * Shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  jsdoc.configs["flat/recommended"],
  n.configs["flat/recommended"],
  sonarjs.configs.recommended,
  stylistic.configs.recommended,
  unicorn.configs.recommended,
  nextFriday.configs["base/recommended"],
  eslintPluginPrettierRecommended,
  {
    plugins: { turbo: turboPlugin },
    rules: { "turbo/no-undeclared-env-vars": "warn" },
  },
  {
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
    },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "n/no-missing-import": "off",
    },
  },
  {
    plugins: { onlyWarn },
  },
  {
    ignores: ["dist/**"],
  },
];
