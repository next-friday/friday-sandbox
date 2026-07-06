import assert from "node:assert";

import { BAD_DEFAULT, MINIMAL } from "./fixtures";
import { emit } from "../src/emit";

const { files } = emit(MINIMAL);
const keys = Object.keys(files);

assert.equal(keys.length, 6, "single component should emit 6 files");
assert.equal(
  files["packages/react/src/components/bases/widget/widget.tsx"] !== undefined,
  true,
);
assert.equal(
  files["packages/react/src/components/bases/widget/widget.styles.ts"] !==
    undefined,
  true,
);
assert.equal(
  files["packages/react/src/components/bases/widget/index.ts"] !== undefined,
  true,
);
assert.equal(
  files["packages/react/src/components/bases/widget/widget.stories.tsx"] !==
    undefined,
  true,
);
assert.ok("packages/styles/src/components/widget.css" in files);
assert.ok("apps/docs/content/docs/components/widget.mdx" in files);
assert.equal(
  files["packages/react/src/components/bases/widget/widget.namespace.ts"],
  undefined,
  "non-compound spec should not emit a namespace file",
);

assert.throws(() => emit(BAD_DEFAULT), "BAD_DEFAULT should fail validation");

console.log("emit.check ✓");
