import assert from "node:assert";

import { BAD_DEFAULT, MINIMAL } from "./fixtures";
import { validateSpec } from "../src/validate";

assert.equal(validateSpec(MINIMAL).length, 0, "MINIMAL should be valid");
assert.ok(
  validateSpec(BAD_DEFAULT).some((e) => e.where.includes("tone")),
  "BAD_DEFAULT should flag the default",
);
console.log("validate.check ✓");
