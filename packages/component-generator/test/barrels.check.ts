import assert from "node:assert";

import { emitBarrels } from "../src/emit/barrels";

import type { ComponentSpec } from "../src/component-spec";

const COMPOUND: ComponentSpec = {
  schemaVersion: 1,
  name: "widget",
  primitive: { kind: "native", interactive: false, client: false },
  compound: "callable-root",
  root: { role: "root", element: { native: "div" } },
  parts: [{ role: "item", element: { native: "div" } }],
  prose: {
    purpose: "A synthetic test widget.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const SINGLE: ComponentSpec = {
  schemaVersion: 1,
  name: "widget",
  primitive: { kind: "native", interactive: false, client: false },
  root: { role: "root", element: { native: "div" } },
  prose: {
    purpose: "A synthetic test widget.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const compoundResult = emitBarrels(COMPOUND);
const { namespace } = compoundResult;
assert.ok(namespace);
assert.ok(namespace.includes("Object.assign(WidgetBase"));
assert.ok(namespace.includes("Item: WidgetItem"));

const singleResult = emitBarrels(SINGLE);
assert.equal(singleResult.namespace, undefined);
assert.ok(singleResult.index.includes(`export { Widget } from "./widget";`));

console.log("barrels.check ✓");
