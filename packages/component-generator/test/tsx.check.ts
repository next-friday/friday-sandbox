import assert from "node:assert";

import { MINIMAL } from "./fixtures";
import { emitTsx } from "../src/emit/tsx";

import type { ComponentSpec } from "../src/component-spec";

const native = emitTsx(MINIMAL);

assert.ok(!native.includes(`"use client";`));
assert.ok(
  native.includes(`import type { ComponentPropsWithRef } from "react";`),
);
assert.ok(native.includes(`export interface WidgetProps`));
assert.ok(native.includes(`ComponentPropsWithRef<"div">, WidgetVariants`));
assert.ok(native.includes(`export const Widget`));
assert.ok(native.includes(`data-slot="widget"`));
assert.ok(native.includes(`widgetVariants({`));
assert.ok(native.includes(`class: className,`));

const INTERACTIVE: ComponentSpec = {
  schemaVersion: 1,
  name: "chip",
  primitive: {
    kind: "react-aria",
    part: "Button",
    interactive: true,
    client: true,
  },
  root: {
    role: "root",
    element: { wraps: "Button" },
    variants: { size: { values: { sm: "sm", md: "md" }, default: "md" } },
  },
  prose: {
    purpose: "A synthetic interactive chip.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const interactive = emitTsx(INTERACTIVE);

assert.ok(interactive.includes(`"use client";`));
assert.ok(
  interactive.includes(
    `import { Button as AriaButton } from "react-aria-components/Button";`,
  ),
);
assert.ok(
  interactive.includes(
    `import { composeTailwindRenderProps } from "../../utils/compose-tailwind-render-props";`,
  ),
);
assert.ok(interactive.includes(`export interface ChipProps`));
assert.ok(
  interactive.includes(
    `ComponentPropsWithRef<typeof AriaButton>, ChipVariants`,
  ),
);
assert.ok(interactive.includes(`export const Chip`));
assert.ok(interactive.includes(`composeTailwindRenderProps(`));
assert.ok(interactive.includes(`chipVariants({ size })`));
assert.ok(interactive.includes(`<AriaButton data-slot="chip"`));

const COMPOUND: ComponentSpec = {
  schemaVersion: 1,
  name: "gizmo",
  primitive: { kind: "radix", part: "Gizmo", interactive: false, client: true },
  compound: "namespace-of-parts",
  root: {
    role: "root",
    element: { wraps: "Root" },
    variants: { size: { values: { sm: "sm" }, default: "sm" } },
  },
  parts: [{ role: "icon", element: { wraps: "Icon" } }],
  prose: {
    purpose: "A synthetic compound gizmo.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const compound = emitTsx(COMPOUND);

assert.ok(compound.includes(`import { Gizmo as RadixGizmo } from "radix-ui";`));
assert.ok(compound.includes(`export const Gizmo`));
assert.ok(compound.includes(`export const GizmoIcon`));
assert.ok(compound.includes(`export interface GizmoIconProps`));
assert.ok(compound.includes(`ComponentPropsWithRef<typeof RadixGizmo.Icon>`));
assert.ok(compound.includes(`<RadixGizmo.Root data-slot="gizmo"`));
assert.ok(compound.includes(`<RadixGizmo.Icon data-slot="gizmo-icon"`));
assert.ok(compound.includes(`const slots = gizmoVariants({ size });`));
assert.ok(compound.includes(`const slots = gizmoVariants();`));
assert.ok(compound.includes(`slots.root({ class: className });`));
assert.ok(compound.includes(`slots.icon({ class: className });`));

const REQUIRED: ComponentSpec = {
  schemaVersion: 1,
  name: "picture",
  primitive: { kind: "native", interactive: false, client: false },
  compound: "namespace-of-parts",
  root: { role: "root", element: { native: "div" } },
  parts: [
    {
      role: "image",
      element: { native: "img" },
      required: ["alt"],
    },
  ],
  prose: {
    purpose: "A synthetic required-prop fixture.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const required = emitTsx(REQUIRED);

assert.ok(required.includes(`export interface PictureImageProps`));
assert.ok(
  required.includes(`  alt: NonNullable<ComponentPropsWithRef<"img">["alt"]>;`),
);
assert.ok(!required.includes(`alt?:`));

console.log("tsx.check ✓");
