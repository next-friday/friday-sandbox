import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { PlopTypes } from "@turbo/gen";

// Insert a two-line export block into a barrel, ordered by the exported name and
// skipping the insert when that name is already exported, so the three barrels
// stay sorted and re-running the generator never duplicates a line.
const insertExportBlock = (
  content: string,
  name: string,
  block: string,
): string => {
  const nameOf = (chunk: string): string =>
    (/export\s*\{\s*(\w+)/.exec(chunk) ?? [])[1] ?? "";
  const blocks = content
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  if (blocks.some((chunk) => nameOf(chunk) === name)) return content;
  blocks.push(block.trim());
  blocks.sort((a, b) =>
    nameOf(a).localeCompare(nameOf(b), "en", { sensitivity: "base" }),
  );
  return `${blocks.join("\n\n")}\n`;
};

// Insert an `@import "./<name>.css";` line into a css index, ordered by name and
// idempotent for the same reason as the barrels above.
const insertImportLine = (
  content: string,
  name: string,
  line: string,
): string => {
  const nameOf = (entry: string): string =>
    (/\.\/([a-z0-9-]+)\.css/.exec(entry) ?? [])[1] ?? "";
  const lines = content
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (lines.some((entry) => nameOf(entry) === name)) return content;
  const imports: string[] = [];
  const others: string[] = [];
  for (const entry of lines) (nameOf(entry) ? imports : others).push(entry);
  imports.push(line.trim());
  imports.sort((a, b) =>
    nameOf(a).localeCompare(nameOf(b), "en", { sensitivity: "base" }),
  );
  return `${[...others, ...imports].join("\n")}\n`;
};

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  const reactBases =
    "{{ turbo.paths.root }}/packages/react/src/components/bases/{{ kebabCase name }}";

  const wireBarrels: PlopTypes.CustomActionFunction = (answers) => {
    const { name, turbo } = answers as {
      name: string;
      turbo: { paths: { root: string } };
    };
    const root = turbo.paths.root;
    const Pascal = plop.renderString("{{ pascalCase name }}", { name });
    const kebab = plop.renderString("{{ kebabCase name }}", { name });

    const patch = (
      relPath: string,
      transform: (content: string) => string,
    ): void => {
      const absPath = join(root, relPath);
      writeFileSync(absPath, transform(readFileSync(absPath, "utf8")));
    };

    patch("packages/react/src/components/bases/index.ts", (content) =>
      insertExportBlock(
        content,
        Pascal,
        `export { ${Pascal} } from "./${kebab}";\nexport type { ${Pascal}Props } from "./${kebab}";`,
      ),
    );
    patch("packages/react/src/components/index.ts", (content) =>
      insertExportBlock(
        content,
        Pascal,
        `export { ${Pascal} } from "./bases";\nexport type { ${Pascal}Props } from "./bases";`,
      ),
    );
    patch("packages/react/src/index.ts", (content) =>
      insertExportBlock(
        content,
        Pascal,
        `export { ${Pascal} } from "./components";\nexport type { ${Pascal}Props } from "./components";`,
      ),
    );
    patch("packages/styles/src/components/bases/index.css", (content) =>
      insertImportLine(content, kebab, `@import "./${kebab}.css";`),
    );
    patch("apps/docs/content/docs/components/meta.json", (content) => {
      const meta = JSON.parse(content) as { pages: string[] };
      if (!meta.pages.includes(kebab)) meta.pages.push(kebab);
      return `${JSON.stringify(meta, null, 2)}\n`;
    });

    return `wired ${Pascal} into the 3 export barrels, the styles css index, and the docs nav`;
  };

  plop.setGenerator("component", {
    description:
      "Scaffold a base component across react, styles, docs, the export barrels, and a changeset",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (kebab or words, e.g. icon-button):",
        validate: (value: string) =>
          value.trim().length > 0 ? true : "name is required",
      },
      {
        type: "list",
        name: "primitive",
        message:
          "Primitive kind — native (display/layout, incl. non-interactive react-aria like Label/Text) or aria (interactive: focus/hover/press, size ramp):",
        choices: ["native", "aria"],
        default: "native",
      },
      {
        type: "input",
        name: "category",
        message: "Storybook category (e.g. Forms, Layout, Feedback):",
        default: "Components",
        validate: (value: string) =>
          /^[A-Za-z0-9 /-]+$/.test(value.trim())
            ? true
            : "category may use only letters, digits, spaces, / and -",
      },
    ],
    actions: (data) => {
      // Un-suffixed templates are the native (display / layout) default; the
      // `.aria.` variants scaffold the interactive skeleton (size axis, ramp
      // geometry, focus/disabled states, interaction + base-class stories).
      // Both stay valid on generation, so the scaffold compiles and passes the
      // gates before any fill — the deterministic, symmetric starting point.
      const primitive = (data as { primitive?: string } | undefined)?.primitive;
      const suffix = primitive === "aria" ? ".aria" : "";

      return [
        {
          type: "add",
          path: `${reactBases}/{{ kebabCase name }}.tsx`,
          templateFile: `templates/component${suffix}.tsx.hbs`,
        },
        {
          type: "add",
          path: `${reactBases}/{{ kebabCase name }}.variants.ts`,
          templateFile: `templates/variants${suffix}.ts.hbs`,
        },
        {
          type: "add",
          path: `${reactBases}/index.ts`,
          templateFile: "templates/index.ts.hbs",
        },
        {
          type: "add",
          path: `${reactBases}/{{ kebabCase name }}.stories.tsx`,
          templateFile: `templates/stories${suffix}.tsx.hbs`,
        },
        {
          type: "add",
          path: "{{ turbo.paths.root }}/packages/styles/src/components/bases/{{ kebabCase name }}.css",
          templateFile: `templates/styles${suffix}.css.hbs`,
        },
        {
          type: "add",
          path: "{{ turbo.paths.root }}/apps/docs/content/docs/components/{{ kebabCase name }}.mdx",
          templateFile: "templates/mdx.hbs",
        },
        {
          type: "add",
          path: "{{ turbo.paths.root }}/.changeset/{{ kebabCase name }}-component.md",
          templateFile: "templates/changeset.md.hbs",
        },
        wireBarrels,
      ];
    },
  });
}
