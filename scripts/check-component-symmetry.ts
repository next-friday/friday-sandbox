// Machine-checks symmetry across every base component, in every dimension a tool can
// verify deterministically — so the regularity the templates promise is proven, not
// trusted, and an LLM filling a component cannot quietly drift from the pattern.
// Dimensions, per component:
//   1. presence        — every surface exists (.tsx, index.ts, .stories.tsx in react; .styles.ts, .css in styles)
//   2. variants <-> css — every fri-<name>-<value> class mirrors 1:1, none duplicated
//   3. barrels         — exported through all three react barrels + the styles @import
//   4. axis <-> control — every variant axis the main component exposes has a Storybook argType
//   5. story floor     — a Default story exists
//   6. doc spine + props — a doc page (when it exists) carries the required sections in order,
//                          Accessibility last, and a Props row for every variant axis
// FAIL = a hard asymmetry that breaks the contract. WARN = a soft gap (a missing doc page)
// surfaced but not blocking.
//
// What this does NOT check is the art a tool can't: the example CONTENT, the prose quality, the
// tone of the copy. Those stay with the human who develops the story and the docs, and with the
// AI reviewers that read prose. The tool fixes the shape so the only thing left to get right is
// the art.
//
// ponytail: regex over the literal conventions, not a TS/CSS AST — it holds while names are
// string literals and the generator owns the shape (the repo convention). Upgrade to a TS AST +
// PostCSS walk if a component ever computes a name dynamically.
//
// Run: node --experimental-strip-types scripts/check-component-symmetry.ts

import { existsSync, readdirSync, readFileSync, type Dirent } from "node:fs";
import { join } from "node:path";

const REACT_BASES = "packages/react/src/components/bases";
const STYLES_BASES = "packages/styles/components";
const STYLES_VARIANTS = "packages/styles/src/components";
const DOCS = "apps/docs/content/docs/components";

const REACT_INDEX = "packages/react/src/index.ts";
const COMPONENTS_INDEX = "packages/react/src/components/index.ts";
const BASES_INDEX = join(REACT_BASES, "index.ts");
const STYLES_INDEX = join(STYLES_BASES, "index.css");

// The component-doc section skeleton (STYLE.md); Accessibility is always last.
const REQUIRED_DOC_SECTIONS = [
  "Purpose",
  "When to use",
  "When not to use",
  "Example",
];
const LAST_DOC_SECTION = "Accessibility";

const fails: string[] = [];
const warns: string[] = [];
const fail = (component: string, message: string): void => {
  fails.push(`  ✗ ${component}: ${message}`);
};
const warn = (component: string, message: string): void => {
  warns.push(`  ⚠ ${component}: ${message}`);
};

const read = (path: string): string | null =>
  existsSync(path) ? readFileSync(path, "utf8") : null;

const pascal = (name: string): string =>
  name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const stripComments = (text: string): string =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(?<!:)\/\/.*/g, "");

// Every `fri-<name>` / `fri-<name>-<value>` token, with a trailing token boundary so `fri-x`
// is not matched inside `fri-xy`. Comments stripped so a class merely named in prose isn't
// counted as declared.
const classesFrom = (text: string, name: string): string[] =>
  stripComments(text).match(
    new RegExp(`fri-${name}(?:-[a-z0-9]+)*(?![a-z0-9-])`, "g"),
  ) ?? [];

// The keys directly inside the first `<block>: { ... }` after `start`, by brace-depth scan.
const objectKeys = (text: string, block: string, start = 0): string[] => {
  const src = stripComments(text);
  const open = src.indexOf(`${block}: {`, start);
  if (open === -1) return [];
  const keys: string[] = [];
  let depth = 0;
  for (let i = src.indexOf("{", open); i < src.length; i += 1) {
    const ch = src[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) break;
    } else if (depth === 1 && /\s/.test(ch ?? "")) {
      const key = /^\s*([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(i));
      if (key) {
        keys.push(key[1] as string);
        i += key[0].length - 1;
      }
    }
  }
  return [...new Set(keys)];
};

// The `{...}` block starting at the first `{` from `from`, balanced by brace depth.
const braceBlock = (src: string, from: number): string => {
  if (from === -1) return "";
  const start = src.indexOf("{", from);
  let depth = 0;
  for (let i = start; i < src.length; i += 1) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return src.slice(start);
};

// The variant axes that belong to the MAIN component. In a multi-slot (compound) component a
// sub-part's axes target another slot, so keep only axes whose values target the primary slot —
// the one bound to the bare `fri-<name>` class. A flat or single-slot component has none of this
// ambiguity: every axis is the component's own.
const mainAxes = (text: string, name: string): string[] => {
  const src = stripComments(text);
  const axes = objectKeys(text, "variants");
  const slots = objectKeys(text, "slots");
  if (slots.length <= 1) return axes;
  const primary =
    slots.find((slot) =>
      new RegExp(`\\b${slot}:\\s*"fri-${name}"`).test(src),
    ) ?? (slots[0] as string);
  const variantsStart = src.indexOf("variants: {");
  return axes.filter((axis) =>
    new RegExp(`\\b${primary}:`).test(
      braceBlock(src, src.indexOf(`${axis}: {`, variantsStart)),
    ),
  );
};

// Heading text of every `## ` section, in document order; and the `\`prop\`` names in Props rows.
const docSections = (text: string): string[] =>
  [...text.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1] as string);

const reactIndex = read(REACT_INDEX) ?? "";
const componentsIndex = read(COMPONENTS_INDEX) ?? "";
const basesIndex = read(BASES_INDEX) ?? "";
const stylesIndex = read(STYLES_INDEX) ?? "";

// Build the component set from BOTH trees so a half-generated component fails loudly.
const reactNames = readdirSync(REACT_BASES, { withFileTypes: true })
  .filter((entry: Dirent) => entry.isDirectory())
  .map((entry: Dirent) => entry.name);
const cssNames = readdirSync(STYLES_BASES)
  .filter((file: string) => file.endsWith(".css") && file !== "index.css")
  .map((file: string) => file.slice(0, -".css".length));
const components = [...new Set([...reactNames, ...cssNames])].sort((a, b) =>
  a.localeCompare(b),
);

let checked = 0;

for (const name of components) {
  const dir = join(REACT_BASES, name);
  const variantsPath = join(STYLES_VARIANTS, name, `${name}.styles.ts`);
  const storiesPath = join(dir, `${name}.stories.tsx`);
  const cssPath = join(STYLES_BASES, `${name}.css`);

  // 1. Presence — every required surface.
  const surfaces: Record<string, string> = {
    component: join(dir, `${name}.tsx`),
    variants: variantsPath,
    index: join(dir, "index.ts"),
    stories: storiesPath,
    css: cssPath,
  };
  let missing = false;
  for (const [label, path] of Object.entries(surfaces)) {
    if (!existsSync(path)) {
      fail(name, `missing ${label} surface ${path}`);
      missing = true;
    }
  }
  if (missing) continue;
  checked += 1;

  const variantsText = readFileSync(variantsPath, "utf8");
  const storiesText = readFileSync(storiesPath, "utf8");
  const cssText = readFileSync(cssPath, "utf8");
  const Pascal = pascal(name);

  // 2. variants <-> css mirror.
  const declared = new Set<string>();
  for (const cls of classesFrom(variantsText, name)) {
    if (declared.has(cls))
      fail(
        name,
        `duplicate class "${cls}" in variants — every value must be distinct`,
      );
    declared.add(cls);
  }
  const cssClasses = new Set(classesFrom(cssText, name));
  for (const cls of declared)
    if (!cssClasses.has(cls))
      fail(
        name,
        `"${cls}" in variants has no rule in ${name}.css (orphan variant)`,
      );
  for (const cls of cssClasses)
    if (!declared.has(cls))
      fail(
        name,
        `".${cls}" in ${name}.css has no variant in ${name}.styles.ts (orphan css)`,
      );

  // 3. Barrels — exported through all three react barrels + the styles @import.
  const exported = new RegExp(`\\b${Pascal}\\b`);
  if (!exported.test(basesIndex))
    fail(name, `${Pascal} not exported from bases/index.ts`);
  if (!exported.test(componentsIndex))
    fail(name, `${Pascal} not exported from components/index.ts`);
  if (!exported.test(reactIndex))
    fail(name, `${Pascal} not exported from src/index.ts`);
  if (!stylesIndex.includes(`./${name}.css`))
    fail(name, `${name}.css not @import'd in styles bases/index.css`);

  // 4. axis <-> control — every variant axis has a Storybook argType.
  const axes = mainAxes(variantsText, name);
  const controls = new Set(objectKeys(storiesText, "argTypes"));
  for (const axis of axes)
    if (!controls.has(axis))
      fail(
        name,
        `variant axis "${axis}" has no argTypes control in ${name}.stories.tsx`,
      );

  // 5. Story floor.
  if (!/export const Default\b/.test(storiesText))
    fail(name, `${name}.stories.tsx has no Default story`);

  // 6. Doc page (when present): the spine, Accessibility last, a Props row per variant axis.
  const docText = read(join(DOCS, `${name}.mdx`));
  if (!docText) {
    warn(name, `no doc page ${name}.mdx`);
    continue;
  }
  const sections = docSections(docText);
  let prevIndex = -1;
  for (const required of REQUIRED_DOC_SECTIONS) {
    const at = sections.indexOf(required);
    if (at === -1) {
      fail(name, `doc is missing the "${required}" section`);
      continue;
    }
    if (at < prevIndex)
      fail(
        name,
        `doc section "${required}" is out of order — keep the spine order`,
      );
    prevIndex = at;
  }
  if (sections.at(-1) !== LAST_DOC_SECTION)
    fail(
      name,
      `doc's last section must be "${LAST_DOC_SECTION}", found "${sections.at(-1) ?? "none"}"`,
    );
  for (const axis of axes)
    if (!new RegExp(`\\|\\s*\`${axis}\``).test(docText))
      fail(name, `variant axis "${axis}" has no row in the doc Props table`);
}

if (warns.length) console.warn(`\nsymmetry warnings:\n${warns.join("\n")}`);
if (fails.length) {
  console.error(
    `\ncomponent symmetry FAILED across ${checked} components:\n${fails.join("\n")}`,
  );
  process.exit(1);
}
const note = warns.length ? `, ${warns.length} warning(s)` : "";
console.log(
  `✓ component symmetry: ${checked} components verified across presence, variants↔css, barrels, controls, stories, docs${note}`,
);
