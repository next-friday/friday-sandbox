// Contrast gate. Run in `build` after codegen: fails the build if any solid or
// core-text pair is below the APCA/WCAG floor (these are foreground-repairable,
// so a failure is a real defect). Tinted pairs — where the role color itself is
// the text on its own tint — are advisory: a failure there needs a darker spec
// value, a brand decision the build must not silently make.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validateTheme, APCA_BODY, WCAG_MIN } from "./contrast.js";

const here = dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(
  readFileSync(join(here, "../tokens/default.spec.json"), "utf8"),
);

const fail = validateTheme(spec);
const fmt = (arr) =>
  arr
    .map((f) => `    ${f.id} [${f.mode}]  APCA ${f.lc}  WCAG ${f.wcag}`)
    .join("\n");

console.log(`contrast gate — APCA ≥ ${APCA_BODY}, WCAG ≥ ${WCAG_MIN}`);

if (fail.tinted.length) {
  console.log(
    "\n  ⚠ tinted advisories (role used AS TEXT on its own tint — needs a darker spec value, not a foreground fix):",
  );
  console.log(fmt(fail.tinted));
}

const hard = [...fail.solid, ...fail.text];
if (hard.length) {
  console.error("\n  ✗ HARD FAIL — solid/core-text pairs below threshold:");
  console.error(fmt(hard));
  process.exit(1);
}

console.log(
  `\n  ✓ all solid + core-text pairs pass${
    fail.tinted.length ? ` (${fail.tinted.length} tinted advisories above)` : ""
  }`,
);
