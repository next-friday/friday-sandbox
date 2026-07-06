import { pascalCase } from "./helpers";

import type { ComponentSpec, Part } from "../component-spec";

const braceBlock = (
  keyword: string,
  names: readonly string[],
  from: string,
): string =>
  names.length === 1
    ? `${keyword} { ${names[0]} } from "${from}";`
    : `${keyword} {\n${names.map((entry) => `  ${entry},`).join("\n")}\n} from "${from}";`;

const attach = (Name: string, part: Part): { key: string; name: string } => {
  const key = pascalCase(part.role);
  return { key, name: `${Name}${key}` };
};

export const emitBarrels = (
  spec: ComponentSpec,
): { index: string; namespace?: string } => {
  const Name = pascalCase(spec.name);
  const parts = (spec.parts ?? []).map((part) => attach(Name, part));
  const partNames = parts.map((part) => part.name);
  const isCallableRoot = spec.compound === "callable-root";
  const valueNames = isCallableRoot ? partNames : [Name, ...partNames];
  const typeNames = [Name, ...partNames].map((entry) => `${entry}Props`);

  const indexLines: string[] = [];
  if (isCallableRoot)
    indexLines.push(braceBlock("export", [Name], `./${spec.name}.namespace`));
  indexLines.push(braceBlock("export", valueNames, `./${spec.name}`));
  indexLines.push(braceBlock("export type", typeNames, `./${spec.name}`));
  const index = `${indexLines.join("\n")}\n`;

  if (!isCallableRoot) return { index };

  const namespaceLines = [
    braceBlock(
      "import",
      [`${Name} as ${Name}Base`, ...partNames],
      `./${spec.name}`,
    ),
    "",
    `export const ${Name} = Object.assign(${Name}Base, {`,
    ...parts.map((part) => `  ${part.key}: ${part.name},`),
    "});",
  ];
  const namespace = `${namespaceLines.join("\n")}\n`;

  return { index, namespace };
};
