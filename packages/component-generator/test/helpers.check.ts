import assert from "node:assert";
import {
  RADIUS_STEP_NAMES,
  camelCase,
  kebabCase,
  pascalCase,
  radiusRatios,
} from "../src/emit/helpers";

const ramp = radiusRatios({
  kind: "ramp",
  n: { xs: 7, md: 10, xl: 12 },
  md: 10,
});
assert.equal(ramp.md, 1);
assert.equal(ramp.xs, 0.7);
assert.equal(ramp.xl, 1.2);

const scale = radiusRatios({ kind: "scale" });
assert.equal(scale.md, 1);
assert.equal(scale.xs, 0.5);
assert.equal(scale["2xl"], 112 / 48);

assert.equal(kebabCase("scrollArea"), "scroll-area");
assert.equal(pascalCase("scroll-area"), "ScrollArea");
assert.equal(camelCase("scroll-area"), "scrollArea");
assert.equal(RADIUS_STEP_NAMES.xs, "xsmall");
assert.equal(RADIUS_STEP_NAMES["2xl"], "2xlarge");

console.log("helpers.check ✓");
