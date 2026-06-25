import { config } from "@friday-sandbox/eslint-config/base";

// Styles consumes the shared base preset. The `scripts/**` build tooling
// (codegen and the contrast gate) is internal and never shipped, so rules
// written for the published component API are relaxed there while every
// correctness, type-safety, import, and naming rule stays on: jsdoc tag
// completeness (these scripts document intent in prose), the readability-style
// rules and unicorn's array-construction opinions (codegen builds CSS by
// pushing lines into a local array), SCREAMING_SNAKE casing and type-declaration
// order (kept so module constants and types in formulas.ts stay symmetric),
// process.exit (correct for a CLI gate that must fail the build), and
// sonarjs/os-command (codegen runs prettier over its own hardcoded paths).

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
