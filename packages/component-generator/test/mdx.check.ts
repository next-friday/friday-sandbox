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

const COMPOUND_SPEC: ComponentSpec = {
  schemaVersion: 1,
  name: "widget",
  primitive: { kind: "native", interactive: false, client: false },
  compound: "callable-root",
  root: {
    role: "root",
    element: { native: "div" },
    variants: {
      variant: { values: { solid: "solid", ghost: "ghost" }, default: "solid" },
      size: { values: { xs: "xs", md: "md" }, default: "md" },
    },
  },
  parts: [
    { role: "image", element: { native: "img" } },
    { role: "fallback", element: { native: "span" } },
  ],
  assets: [{ url: "https://x/a.png", alt: "A" }],
  demo: {
    tree: [
      { part: "Image", content: { asset: 0 } },
      { part: "Fallback", content: { text: "JD" } },
    ],
  },
  prose: {
    purpose: "A synthetic compound widget.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const compoundOutput = emitMdx(COMPOUND_SPEC);

assert.ok(
  compoundOutput.includes('<Widget.Image src="https://x/a.png" alt="A" />'),
  "should render composed image demo in usage section",
);
assert.ok(
  compoundOutput.includes("<Widget.Fallback>JD</Widget.Fallback>"),
  "should render composed fallback demo in usage section",
);

const variantStart = compoundOutput.indexOf("## Variant");
const sizeStart = compoundOutput.indexOf("## Size");
assert.ok(
  variantStart !== -1 && sizeStart > variantStart,
  "should emit per-axis Variant and Size feature-demo sections",
);
const variantSection = compoundOutput.slice(variantStart, sizeStart);
assert.ok(
  variantSection.includes('<Widget.Image src="https://x/a.png" alt="A" />'),
  "should compose the image demo in the per-axis Variant section",
);
assert.ok(
  variantSection.includes("<Widget.Fallback>JD</Widget.Fallback>"),
  "should compose the fallback demo in the per-axis Variant section",
);
assert.ok(
  variantSection.includes('<Widget variant="ghost">'),
  "should carry the axis prop on the composed root in the Variant section",
);

const sizeSection = compoundOutput.slice(sizeStart);
assert.ok(
  sizeSection.includes('<Widget.Image src="https://x/a.png" alt="A" />'),
  "should compose the image demo in the per-axis Size section",
);
assert.ok(
  sizeSection.includes("<Widget.Fallback>JD</Widget.Fallback>"),
  "should compose the fallback demo in the per-axis Size section",
);
assert.ok(
  sizeSection.includes('<Widget size="xs">'),
  "should carry the axis prop on the composed root in the Size section",
);

assert.ok(
  !compoundOutput.includes(".map("),
  "should not use .map() for compound demo JSX",
);

console.log("mdx.check ✓");
