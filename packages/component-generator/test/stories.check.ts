import assert from "node:assert";

import { emitStories } from "../src/emit/stories";

import type { ComponentSpec } from "../src/component-spec";

const SPEC: ComponentSpec = {
  schemaVersion: 1,
  name: "widget",
  primitive: { kind: "native", interactive: false, client: false },
  root: {
    role: "root",
    element: { native: "span" },
    variants: {
      variant: { values: { solid: "solid", ghost: "ghost" }, default: "solid" },
    },
  },
  prose: {
    purpose: "A synthetic test widget.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const output = emitStories(SPEC);

assert.ok(
  output.includes('variant="solid"'),
  "should render variant=solid explicitly",
);
assert.ok(
  output.includes('variant="ghost"'),
  "should render variant=ghost explicitly",
);
assert.ok(!output.includes(".map("), "should not use .map() for demo JSX");

const IMAGE_SPEC: ComponentSpec = {
  schemaVersion: 1,
  name: "picture",
  primitive: { kind: "native", interactive: false, client: false },
  root: { role: "root", element: { native: "img" }, required: ["alt"] },
  assets: [{ url: "https://example.com/picture.png", alt: "A test picture" }],
  prose: {
    purpose: "A synthetic image widget.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const imageOutput = emitStories(IMAGE_SPEC);

assert.ok(imageOutput.includes(`src: "https://example.com/picture.png"`));
assert.ok(imageOutput.includes(`alt: "A test picture"`));

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

const compoundOutput = emitStories(COMPOUND_SPEC);

assert.ok(
  compoundOutput.includes('<Widget.Image src="https://x/a.png" alt="A" />'),
  "should render composed image demo in default story",
);
assert.ok(
  compoundOutput.includes("<Widget.Fallback>JD</Widget.Fallback>"),
  "should render composed fallback demo in default story",
);
assert.ok(
  compoundOutput.includes('<Widget size="xs"'),
  "should wrap composed demo under the size showcase with axis prop on root",
);
assert.ok(
  compoundOutput.includes('<Widget variant="ghost"'),
  "should wrap composed demo under the variant showcase with axis prop on root",
);
assert.ok(
  !compoundOutput.includes(".map("),
  "should not use .map() for compound demo JSX",
);

console.log("stories.check ✓");
