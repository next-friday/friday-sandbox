// Contrast gate. Run in `build` after codegen: fails the build if any solid or
// core-text pair is below the APCA/WCAG floor (these are foreground-repairable,
// so a failure is a real defect). Tinted pairs — where the role color itself is
// the text on its own tint — are advisory: a failure there needs a darker spec
// value, a brand decision the build must not silently make.

import { parse } from "culori";

import { validateTheme, APCA_BODY, WCAG_MIN } from "./contrast.ts";
import { GROUND_DARK } from "./formulas.ts";
import { loadSpec } from "./spec.ts";
import type { ContrastFailure, OklchTriple } from "./types.ts";

const spec = loadSpec();

/**
 * A base colour is opaque: a spec triple carries no alpha; a string is parsed and checked.
 */
export const isOpaque = (color: OklchTriple | string): boolean => {
  if (typeof color !== "string") return true;
  const c = parse(color);
  if (!c) return false;
  return c.alpha === undefined || c.alpha === 1;
};

// Alpha-trap: every base colour must be opaque. color-mix over a translucent
// base flattens or muddies the 5%/40% mid-tones, and the APCA gate below would
// then validate a colour the browser never paints. Guard the spec and the dark
// ground (spec triples are opaque by schema; this catches hand-edits).
const alphaFails = [
  ...Object.entries(spec.color)
    .filter(([, c]) => !isOpaque(c))
    .map(([k]) => `spec.color.${k}`),
  ...Object.entries(GROUND_DARK)
    .filter(([, value]) => typeof value === "string" && !isOpaque(value))
    .map(([k]) => `GROUND_DARK.${k}`),
];
if (alphaFails.length > 0) {
  console.error(
    `\n  ✗ alpha-trap — base colours must be opaque: ${alphaFails.join(", ")}`,
  );
  process.exit(1);
}

const fail = validateTheme(spec);
const fmt = (array: ContrastFailure[]): string =>
  array
    .map((f) => `    ${f.id} [${f.mode}]  APCA ${f.lc}  WCAG ${f.wcag}`)
    .join("\n");

console.log(`contrast gate — APCA ≥ ${APCA_BODY}, WCAG ≥ ${WCAG_MIN}`);

if (fail.tinted.length > 0) {
  console.log(
    "\n  tinted advisories (role used AS TEXT on its own tint, needs a darker spec value, not a foreground fix):",
  );
  console.log(fmt(fail.tinted));
}

const hard = [...fail.solid, ...fail.text];
if (hard.length > 0) {
  console.error("\n  ✗ HARD FAIL — solid/core-text pairs below threshold:");
  console.error(fmt(hard));
  process.exit(1);
}

console.log(
  `\n  ✓ all solid + core-text pairs pass${
    fail.tinted.length > 0
      ? ` (${fail.tinted.length} tinted advisories above)`
      : ""
  }`,
);
