import { config } from "@friday-sandbox/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "jsdoc/require-param": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-returns-description": "off",
      "next-friday/no-inline-return-properties": "off",
      "next-friday/prefer-destructuring-parameters": "off",
      "next-friday/no-complex-inline-return": "off",
      "next-friday/no-logic-in-parameters": "off",
      "next-friday/no-misleading-constant-case": "off",
      "next-friday/type-declaration-order": "off",
      "n/no-process-exit": "off",
      "unicorn/no-process-exit": "off",
      "unicorn/prefer-single-call": "off",
      "unicorn/no-immediate-mutation": "off",
      "unicorn/consistent-function-scoping": "off",
      "sonarjs/os-command": "off",
    },
  },
];
