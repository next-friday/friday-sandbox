import assert from "node:assert";

import { MINIMAL } from "./fixtures";
import { emitStyles } from "../src/emit/styles";

import type { ComponentSpec } from "../src/component-spec";

const flat = emitStyles(MINIMAL);

assert.ok(flat.includes(`import { tv } from "tailwind-variants/lite";`));
assert.ok(
  flat.includes(`import type { VariantProps } from "tailwind-variants/lite";`),
);
assert.ok(flat.includes(`base: "fri-widget"`));
assert.ok(flat.includes(`a: "fri-widget-a"`));
assert.ok(flat.includes(`b: "fri-widget-b"`));
assert.ok(flat.includes(`defaultVariants: {`));
assert.ok(flat.includes(`tone: "a"`));
assert.ok(
  flat.includes(
    `export type WidgetVariants = VariantProps<typeof widgetVariants>;`,
  ),
);

const COMPOUND: ComponentSpec = {
  schemaVersion: 1,
  name: "gizmo",
  primitive: { kind: "native", interactive: false, client: false },
  compound: "namespace-of-parts",
  root: {
    role: "root",
    element: { native: "div" },
    variants: {
      size: { values: { sm: "sm", md: "md" }, default: "md" },
      isDisabled: { values: { true: "disabled" }, boolean: true },
    },
  },
  parts: [
    {
      role: "icon",
      element: { native: "span" },
    },
  ],
  prose: {
    purpose: "A synthetic compound widget.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const slotted = emitStyles(COMPOUND);

assert.ok(slotted.includes(`slots: {`));
assert.ok(slotted.includes(`root: "fri-gizmo"`));
assert.ok(slotted.includes(`icon: "fri-gizmo-icon"`));
assert.ok(slotted.includes(`sm: { root: "fri-gizmo-sm" }`));
assert.ok(slotted.includes(`true: { root: "fri-gizmo-disabled" }`));
assert.ok(!slotted.includes(`false:`));
assert.ok(slotted.includes(`defaultVariants: {`));
assert.ok(slotted.includes(`size: "md"`));
assert.ok(!slotted.includes(`isDisabled: "true"`));
assert.ok(
  slotted.includes(
    `export type GizmoVariants = VariantProps<typeof gizmoVariants>;`,
  ),
);

const FLAT_SPACING: ComponentSpec = {
  ...MINIMAL,
  name: "surface",
  root: {
    ...MINIMAL.root,
    spacing: ["padding"],
  },
};

const flatSpacing = emitStyles(FLAT_SPACING);

assert.ok(
  flatSpacing.includes(
    `import { paddingVariants } from "../../utils/spacing-variants";`,
  ),
);
assert.ok(flatSpacing.includes(`...paddingVariants,`));
assert.ok(!flatSpacing.includes(`gapVariants`));

const SLOTTED_SPACING: ComponentSpec = {
  ...COMPOUND,
  name: "layout",
  root: { ...COMPOUND.root, spacing: ["gap", "padding"] },
  parts: [{ ...COMPOUND.parts![0]!, spacing: ["padding"] }],
};

const slottedSpacing = emitStyles(SLOTTED_SPACING);

assert.ok(
  slottedSpacing.includes(
    `import { gapSlotVariants, paddingSlotVariants } from "../../utils/spacing-variants";`,
  ),
);
assert.ok(slottedSpacing.includes(`...gapSlotVariants,`));
assert.ok(slottedSpacing.includes(`...paddingSlotVariants,`));

console.log("styles.check ✓");
