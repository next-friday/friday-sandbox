import assert from "node:assert";

import { emitCss } from "../src/emit/css";

import type { ComponentSpec } from "../src/component-spec";

const RAMP_ARCHETYPE: ComponentSpec = {
  schemaVersion: 1,
  name: "gizmo",
  primitive: { kind: "native", interactive: false, client: false },
  root: {
    role: "root",
    element: { native: "div" },
    layout: {
      size: { kind: "ramp", n: { xs: 7, md: 10 }, md: 10 },
      radiusArchetype: "action",
    },
  },
  prose: {
    purpose: "A synthetic ramp fixture.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const rampCss = emitCss(RAMP_ARCHETYPE);
assert.ok(
  rampCss.includes("calc(var(--fri-action-radius) * 1)"),
  "md ratio should bake to 1",
);
assert.ok(
  rampCss.includes("calc(var(--fri-action-radius) * 0.7)"),
  "xs ratio should bake to 0.7",
);

const ROLE_INTERACTIVE: ComponentSpec = {
  schemaVersion: 1,
  name: "toggle",
  primitive: { kind: "react-aria", interactive: true, client: true },
  root: {
    role: "root",
    element: { native: "button" },
    variants: {
      color: {
        values: { primary: "primary", secondary: "secondary" },
        default: "primary",
        mechanism: "role",
      },
    },
  },
  prose: {
    purpose: "A synthetic interactive fixture.",
    whenToUse: ["x"],
    whenNotToUse: ["y"],
  },
};

const roleCss = emitCss(ROLE_INTERACTIVE);
assert.ok(
  roleCss.includes("--toggle-color: var(--fri-primary);"),
  "interactive role mechanism should emit the base color var",
);

console.log("css.check ✓");
