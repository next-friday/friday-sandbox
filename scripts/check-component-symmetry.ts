// Machine-checks the variants <-> css mirror for every base component: every
// `fri-<name>-<value>` class declared in `<name>.variants.ts` must have a rule in
// the matching `<name>.css`, and vice versa, and no class may be declared twice in
// variants (every value stays distinct). This is the deterministic half of the
// component Done contract — the symmetry the LLM is asked to keep is verified here
// instead of trusted.
//
// ponytail: regex extraction over the literal `fri-` class strings these files
// use, not a full TS/CSS parse. It holds while class names are written as string
// literals (the repo convention); upgrade to a TS AST + PostCSS walk if a
// component ever computes a `fri-` class name dynamically.
//
// Run: node --experimental-strip-types scripts/check-component-symmetry.ts

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const REACT_BASES = "packages/react/src/components/bases";
const STYLES_BASES = "packages/styles/src/components/bases";

// Every `fri-<name>` / `fri-<name>-<value>` token in the text, longest-match.
const classesFrom = (text: string, name: string): string[] => {
  // Strip comments first so a `fri-` class merely named in prose (allowed for
  // non-obvious invariants) isn't counted as a declared class.
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
  // Trailing `(?![a-z0-9-])` anchors a token boundary so `fri-x` is not matched
  // inside a longer token like `fri-xy`.
  const matches = stripped.match(
    new RegExp(`fri-${name}(?:-[a-z0-9]+)*(?![a-z0-9-])`, "g"),
  );
  return matches ?? [];
};

let failed = false;
const fail = (component: string, message: string): void => {
  failed = true;
  console.error(`  ✗ ${component}: ${message}`);
};

// Build the component set from BOTH trees so a half-generated component — a
// react dir with no css, or a css with no variants — fails instead of being
// silently skipped.
const reactNames = readdirSync(REACT_BASES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const cssNames = readdirSync(STYLES_BASES)
  .filter((file) => file.endsWith(".css") && file !== "index.css")
  .map((file) => file.slice(0, -".css".length));
const components = [...new Set([...reactNames, ...cssNames])].sort();

let checked = 0;

for (const name of components) {
  const variantsPath = join(REACT_BASES, name, `${name}.variants.ts`);
  const cssPath = join(STYLES_BASES, `${name}.css`);

  if (!existsSync(variantsPath)) {
    fail(name, `missing variants file ${variantsPath}`);
    continue;
  }
  if (!existsSync(cssPath)) {
    fail(name, `missing styles file ${cssPath}`);
    continue;
  }
  checked += 1;

  const variantClasses = classesFrom(readFileSync(variantsPath, "utf8"), name);
  const cssClasses = new Set(classesFrom(readFileSync(cssPath, "utf8"), name));

  const seen = new Set<string>();
  for (const cls of variantClasses) {
    if (seen.has(cls)) {
      fail(
        name,
        `duplicate class "${cls}" in variants — every value must be distinct`,
      );
    }
    seen.add(cls);
  }

  for (const cls of seen) {
    if (!cssClasses.has(cls)) {
      fail(
        name,
        `"${cls}" in variants has no rule in ${name}.css (orphan variant)`,
      );
    }
  }
  for (const cls of cssClasses) {
    if (!seen.has(cls)) {
      fail(
        name,
        `".${cls}" in ${name}.css has no variant in ${name}.variants.ts (orphan css)`,
      );
    }
  }
}

if (failed) {
  console.error(
    `\ncomponent symmetry check failed across ${checked} components.`,
  );
  process.exit(1);
}
console.log(
  `✓ component symmetry: ${checked} components, variants <-> css mirror intact`,
);
