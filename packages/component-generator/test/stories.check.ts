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

console.log("stories.check ✓");
