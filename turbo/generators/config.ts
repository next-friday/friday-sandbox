import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { PlopTypes } from "@turbo/gen";

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

const parseParts = (parts: string | undefined): string[] => [
  ...new Set(
    (parts ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  ),
];

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setHelper("sortedNamedImports", (...names: unknown[]) => {
    const identifiers = names.slice(0, -1) as string[];
    return [...identifiers].sort((a, b) => a.localeCompare(b)).join(", ");
  });

  plop.setPartial(
    "compoundSubparts",
    `{{#if compound}}
{{#each subparts}}

export interface {{ pascalCase ../name }}{{ this }}Props
  extends ComponentPropsWithRef<"div"> {
  className?: string;
}

export const {{ pascalCase ../name }}{{ this }} = (
  props: Readonly<{{ pascalCase ../name }}{{ this }}Props>,
) => {
  const { children, className, ...rest } = props;

  return (
    <div
      data-slot="{{ kebabCase ../name }}-{{ kebabCase this }}"
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
};
{{/each}}
{{/if}}
`,
  );

  const pascalOf = (value: string): string =>
    plop.renderString("{{ pascalCase value }}", { value });

  const reactBases =
    "{{ turbo.paths.root }}/packages/react/src/components/bases/{{ kebabCase name }}";
  const stylesComponents =
    "{{ turbo.paths.root }}/packages/styles/src/components";

  const wireBarrels: PlopTypes.CustomActionFunction = (answers) => {
    const { name, category, parts, turbo } = answers as {
      name: string;
      category?: string;
      parts?: string;
      turbo: { paths: { root: string } };
    };
    const root = turbo.paths.root;
    const Pascal = plop.renderString("{{ pascalCase name }}", { name });
    const kebab = plop.renderString("{{ kebabCase name }}", { name });
    const subparts = parseParts(parts).map(pascalOf);

    const namedBlock = (from: string): string => {
      if (subparts.length === 0) {
        return `export { ${Pascal} } from "${from}";\nexport type { ${Pascal}Props } from "${from}";`;
      }
      const names = [Pascal, ...subparts.map((part) => `${Pascal}${part}`)];
      const types = [
        `${Pascal}Props`,
        ...subparts.map((part) => `${Pascal}${part}Props`),
      ];
      const list = (entries: string[]): string =>
        entries.map((entry) => `  ${entry},`).join("\n");
      return `export {\n${list(names)}\n} from "${from}";\nexport type {\n${list(types)}\n} from "${from}";`;
    };

    const patch = (
      relPath: string,
      transform: (content: string) => string,
    ): void => {
      const absPath = join(root, relPath);
      writeFileSync(absPath, transform(readFileSync(absPath, "utf8")));
    };

    patch("packages/react/src/components/bases/index.ts", (content) =>
      insertExportBlock(content, Pascal, namedBlock(`./${kebab}`)),
    );
    patch("packages/react/src/index.ts", (content) =>
      insertExportBlock(content, Pascal, namedBlock("./components/bases")),
    );
    patch("packages/styles/src/components/index.css", (content) =>
      insertImportLine(content, kebab, `@import "./${kebab}.css";`),
    );
    patch("apps/docs/content/docs/components/meta.json", (content) => {
      const meta = JSON.parse(content) as { pages: string[] };
      if (!meta.pages.includes(kebab)) {
        const sep = `---${category?.trim() || "Components"}---`;
        const at = meta.pages.indexOf(sep);
        if (at === -1) {
          meta.pages.push(sep, kebab);
        } else {
          let end = at + 1;
          while (
            end < meta.pages.length &&
            !/^---.*---$/.test(meta.pages[end] ?? "")
          )
            end++;
          meta.pages.splice(end, 0, kebab);
        }
      }
      return `${JSON.stringify(meta, null, 2)}\n`;
    });

    return `wired ${Pascal} into the 2 export barrels, the styles css index, and the docs nav`;
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
      {
        type: "input",
        name: "parts",
        message:
          "Compound subparts (comma-separated PascalCase, e.g. Item or Icon; blank = single component):",
        default: "",
      },
    ],
    actions: (data) => {
      const answers = data as
        { primitive?: string; parts?: string } | undefined;
      const suffix = answers?.primitive === "aria" ? ".aria" : "";
      const subparts = parseParts(answers?.parts).map(pascalOf);
      const compound = subparts.length > 0;
      const templateData = { subparts, compound };

      const actions: PlopTypes.ActionType[] = [
        {
          type: "add",
          path: `${reactBases}/{{ kebabCase name }}.tsx`,
          templateFile: `templates/component${suffix}.tsx.hbs`,
          data: templateData,
        },
        {
          type: "add",
          path: `${reactBases}/{{ kebabCase name }}.styles.ts`,
          templateFile: `templates/variants${suffix}.ts.hbs`,
          data: templateData,
        },
        {
          type: "add",
          path: `${reactBases}/index.ts`,
          templateFile: "templates/index.ts.hbs",
          data: templateData,
        },
        {
          type: "add",
          path: `${reactBases}/{{ kebabCase name }}.stories.tsx`,
          templateFile: `templates/stories${suffix}.tsx.hbs`,
          data: templateData,
        },
        {
          type: "add",
          path: `${stylesComponents}/{{ kebabCase name }}.css`,
          templateFile: `templates/styles${suffix}.css.hbs`,
          data: templateData,
        },
        {
          type: "add",
          path: "{{ turbo.paths.root }}/apps/docs/content/docs/components/{{ kebabCase name }}.mdx",
          templateFile: `templates/mdx${suffix}.hbs`,
          data: templateData,
        },
        {
          type: "add",
          path: "{{ turbo.paths.root }}/.changeset/{{ kebabCase name }}-component.md",
          templateFile: "templates/changeset.md.hbs",
          data: templateData,
        },
      ];

      if (compound) {
        actions.push({
          type: "add",
          path: `${reactBases}/{{ kebabCase name }}.namespace.ts`,
          templateFile: "templates/namespace.ts.hbs",
          data: templateData,
        });
      }

      actions.push(wireBarrels);
      return actions;
    },
  });
}
