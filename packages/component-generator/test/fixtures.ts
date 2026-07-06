import type { ComponentSpec } from "../src/component-spec";

export const MINIMAL: ComponentSpec = {
  schemaVersion: 1,
  name: "widget",
  primitive: { kind: "native", interactive: false, client: false },
  root: {
    role: "root",
    element: { native: "div" },
    variants: { tone: { values: { a: "a", b: "b" }, default: "a" } },
  },
  prose: {
    purpose: "A synthetic test widget.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

export const BAD_DEFAULT: ComponentSpec = {
  ...MINIMAL,
  root: {
    ...MINIMAL.root,
    variants: { tone: { values: { a: "a" }, default: "b" } },
  },
};
