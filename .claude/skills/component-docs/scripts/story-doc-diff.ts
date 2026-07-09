import { existsSync, readFileSync } from "node:fs";
import ts from "typescript";

const name = process.argv[2];
if (!name) {
  console.error(
    "usage: node --experimental-strip-types story-doc-diff.ts <component-kebab-name>",
  );
  process.exit(2);
}

const storiesPath = `packages/react/src/components/bases/${name}/${name}.stories.tsx`;
const docPath = `apps/docs/content/docs/components/${name}.mdx`;
for (const path of [storiesPath, docPath]) {
  if (!existsSync(path)) {
    console.error(`missing ${path} — run from the repo root`);
    process.exit(2);
  }
}

const SPINE = new Set([
  "Import",
  "Usage",
  "Purpose",
  "When to use",
  "When not to use",
  "Props",
  "Styling",
  "Accessibility",
]);

const sourceFile = ts.createSourceFile(
  storiesPath,
  readFileSync(storiesPath, "utf8"),
  ts.ScriptTarget.Latest,
  true,
);
const stories: string[] = [];
for (const statement of sourceFile.statements) {
  if (
    ts.isVariableStatement(statement) &&
    statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    )
  ) {
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name))
        stories.push(declaration.name.text);
    }
  }
}

const docText = readFileSync(docPath, "utf8");
const sections = [...docText.matchAll(/^##\s+(.+?)\s*$/gm)].map(
  (match) => match[1]!,
);

const mirrorStories = stories.filter((story) => story !== "Default");
const featureSections = sections.filter((section) => !SPINE.has(section));

const missingSections = mirrorStories.filter(
  (story) => !featureSections.includes(story),
);
const orphanSections = featureSections.filter(
  (section) => !mirrorStories.includes(section),
);

for (const story of missingSections) {
  console.log(`✗ story "${story}" has no "## ${story}" section in ${name}.mdx`);
}
for (const section of orphanSections) {
  console.log(
    `✗ section "## ${section}" has no "${section}" story export in ${name}.stories.tsx`,
  );
}
if (missingSections.length === 0 && orphanSections.length === 0) {
  console.log(
    `✓ ${name}: ${mirrorStories.length} stories and ${featureSections.length} feature sections mirror 1:1`,
  );
  process.exit(0);
}
process.exit(1);
