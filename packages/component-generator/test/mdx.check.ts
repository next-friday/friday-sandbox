import assert from "node:assert";

import { emitMdx } from "../src/emit/mdx";

import type { ComponentSpec } from "../src/component-spec";

const SPEC: ComponentSpec = {
  schemaVersion: 1,
  name: "widget",
  primitive: { kind: "native", interactive: false, client: false },
  compound: "namespace-of-parts",
  root: {
    role: "root",
    element: { native: "div" },
    variants: {
      size: { values: { sm: "sm", md: "md" }, default: "md" },
    },
  },
  parts: [
    {
      role: "item",
      element: { native: "div" },
    },
  ],
  prose: {
    purpose: "A synthetic test widget with a subpart.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const output = emitMdx(SPEC);

const propTableCount = (output.match(/\| Prop \|/g) ?? []).length;
assert.equal(propTableCount, 2, "should emit one Props table per part");

const headings = [
  "<SourceLinks",
  "## Import",
  "## Usage",
  "## Purpose",
  "## When to use",
  "## When not to use",
  "## Props",
  "## Styling",
  "## Accessibility",
];
let cursor = -1;
for (const heading of headings) {
  const index = output.indexOf(heading);
  assert.ok(index !== -1, `missing heading: ${heading}`);
  assert.ok(index > cursor, `heading out of order: ${heading}`);
  cursor = index;
}

console.log("mdx.check ✓");
