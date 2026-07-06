import { axisEntries, friClass, kebabCase, pascalCase } from "./helpers";
import { labelCase, selectDemoAxes, selectDemoContent } from "./stories";

import type { Axis, ComponentSpec, Part } from "../component-spec";
import type { DemoAxis, DemoContent } from "./stories";

const PRIMITIVE_LABEL: Record<string, string> = {
  native: "a native HTML element",
  "react-aria": "a React Aria component",
  radix: "Radix UI",
};

const yamlQuote = (value: string): string =>
  `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;

const bulletList = (items: string[]): string =>
  items.map((item) => `- ${item}`).join("\n");

const frontmatter = (spec: ComponentSpec, pascalName: string): string =>
  [
    "---",
    `title: ${pascalName}`,
    `description: ${yamlQuote(spec.prose.purpose)}`,
    "---",
  ].join("\n");

const namedImports = (pascalName: string): string =>
  [pascalName, "Flex"].sort((a, b) => a.localeCompare(b)).join(", ");

const mainImports = (pascalName: string, content: DemoContent): string => {
  const lines = [
    `import { ${namedImports(pascalName)} } from "@friday-sandbox/react";`,
  ];
  if (content.kind === "container")
    lines.push('import { Boxes } from "@friday-sandbox/react/samples";');
  return lines.join("\n");
};

const sourceLinks = (kebabName: string): string =>
  [
    "<SourceLinks",
    `  source="https://github.com/next-friday/friday-sandbox/blob/main/packages/react/src/components/bases/${kebabName}/${kebabName}.tsx"`,
    `  style="https://github.com/next-friday/friday-sandbox/blob/main/packages/styles/src/components/${kebabName}.css"`,
    "/>",
  ].join("\n");

const importSection = (pascalName: string): string =>
  [
    "## Import",
    "",
    "```tsx",
    `import { ${pascalName} } from "@friday-sandbox/react";`,
    "```",
  ].join("\n");

const usageJsx = (
  pascalName: string,
  content: DemoContent,
  indent: string,
): string => {
  if (content.kind === "container")
    return [
      `${indent}<${pascalName}>`,
      `${indent}  <Boxes count={3} />`,
      `${indent}</${pascalName}>`,
    ].join("\n");
  if (content.kind === "bare") return `${indent}<${pascalName} />`;
  if (content.kind === "image")
    return `${indent}<${pascalName} src="${content.url}" alt="${content.alt}" />`;
  return `${indent}<${pascalName}>${content.text}</${pascalName}>`;
};

const usageSection = (pascalName: string, content: DemoContent): string =>
  [
    "## Usage",
    "",
    '<Tabs items={["Preview", "Code"]}>',
    '  <Tab value="Preview">',
    '    <Flex align="center" gap="md" p="md">',
    usageJsx(pascalName, content, "      "),
    "    </Flex>",
    "  </Tab>",
    "",
    '  <Tab value="Code">',
    "    ```tsx",
    usageJsx(pascalName, content, "    "),
    "    ```",
    "  </Tab>",
    "</Tabs>",
  ].join("\n");

const purposeSection = (spec: ComponentSpec): string =>
  ["## Purpose", "", spec.prose.purpose].join("\n");

const whenToUseSection = (spec: ComponentSpec): string =>
  ["## When to use", "", bulletList(spec.prose.whenToUse)].join("\n");

const whenNotToUseSection = (spec: ComponentSpec): string =>
  ["## When not to use", "", bulletList(spec.prose.whenNotToUse)].join("\n");

const demoSection = (pascalName: string, demoAxis: DemoAxis): string => {
  const entries = axisEntries(demoAxis.axis);
  const line = (indent: string, value: string): string =>
    `${indent}<${pascalName} ${demoAxis.key}="${value}">${labelCase(value)}</${pascalName}>`;
  const previewLines = entries
    .map(([value]) => line("      ", value))
    .join("\n");
  const codeLines = entries.map(([value]) => line("    ", value)).join("\n");
  return [
    `## ${pascalCase(demoAxis.key)}`,
    "",
    `Use the \`${demoAxis.key}\` prop to choose one of the following values.`,
    "",
    '<Tabs items={["Preview", "Code"]}>',
    '  <Tab value="Preview">',
    '    <Flex align="center" gap="md" p="md">',
    previewLines,
    "    </Flex>",
    "  </Tab>",
    "",
    '  <Tab value="Code">',
    "    ```tsx",
    codeLines,
    "    ```",
    "  </Tab>",
    "</Tabs>",
  ].join("\n");
};

const propRow = (axisKey: string, axis: Axis): string => {
  const type = axisEntries(axis)
    .map(([value]) => `\`"${value}"\``)
    .join(" \\| ");
  const def = axis.default ? `\`"${axis.default}"\`` : "—";
  return `| \`${axisKey}\` | ${type} | ${def} | Sets the \`${axisKey}\` value. |`;
};

const propTable = (part: Part): string => {
  const rows = Object.entries(part.variants ?? {}).map(([key, axis]) =>
    propRow(key, axis),
  );
  rows.push(
    "| `className` | `string` | — | Additional CSS classes to apply. |",
  );
  return [
    "| Prop | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
};

const propsSection = (spec: ComponentSpec, pascalName: string): string => {
  const parts = [spec.root, ...(spec.parts ?? [])];
  const multiPart = parts.length > 1;
  const tables = parts.map((part) => {
    if (!multiPart) return propTable(part);
    const heading =
      part.role === "root"
        ? `### ${pascalName}`
        : `### ${pascalName}.${pascalCase(part.role)}`;
    return [heading, "", propTable(part)].join("\n");
  });
  return ["## Props", "", tables.join("\n\n")].join("\n");
};

const stylingRow = (
  name: string,
  part: Part,
  suffix: string,
  type: string,
  description: string,
): string =>
  `| \`${friClass(name, part, suffix)}\` | ${type} | ${description} |`;

const stylingRowsForPart = (name: string, part: Part): string[] => {
  const rows = [
    stylingRow(
      name,
      part,
      "",
      part.role === "root" ? "Base" : "Part",
      part.role === "root"
        ? `Base ${kebabCase(name)} styles.`
        : `${pascalCase(name)}.${pascalCase(part.role)} element.`,
    ),
  ];
  for (const [axisKey, axis] of Object.entries(part.variants ?? {}))
    for (const [value, suffix] of axisEntries(axis))
      rows.push(
        stylingRow(
          name,
          part,
          suffix,
          pascalCase(axisKey),
          `${labelCase(value)} ${axisKey}.`,
        ),
      );
  return rows;
};

const stylingSection = (spec: ComponentSpec, pascalName: string): string => {
  const parts = [spec.root, ...(spec.parts ?? [])];
  const rows = parts.flatMap((part) => stylingRowsForPart(spec.name, part));
  return [
    "## Styling",
    "",
    `\`${pascalName}\` is styled through CSS classes, so the look applies to any element that carries them.`,
    "",
    "### Modifier classes",
    "",
    "| Class | Type | Description |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
};

const accessibilitySection = (
  spec: ComponentSpec,
  pascalName: string,
): string => {
  const primitiveLabel =
    PRIMITIVE_LABEL[spec.primitive.kind] ?? "its primitive";
  const body = spec.primitive.interactive
    ? `\`${pascalName}\` wraps ${primitiveLabel}, so it inherits its keyboard interaction and ARIA roles.`
    : `\`${pascalName}\` renders ${primitiveLabel} with no interactive behavior of its own.`;
  return ["## Accessibility", "", `- ${body}`].join("\n");
};

export const emitMdx = (spec: ComponentSpec): string => {
  const pascalName = pascalCase(spec.name);
  const kebabName = kebabCase(spec.name);
  const demoAxes = selectDemoAxes(spec.root);
  const content = selectDemoContent(spec, demoAxes);

  const sections = [
    frontmatter(spec, pascalName),
    "",
    mainImports(pascalName, content),
    "",
    sourceLinks(kebabName),
    "",
    importSection(pascalName),
    "",
    usageSection(pascalName, content),
    "",
    purposeSection(spec),
    "",
    whenToUseSection(spec),
    "",
    whenNotToUseSection(spec),
  ];

  if (demoAxes.variant)
    sections.push("", demoSection(pascalName, demoAxes.variant));
  if (demoAxes.size) sections.push("", demoSection(pascalName, demoAxes.size));

  sections.push(
    "",
    propsSection(spec, pascalName),
    "",
    stylingSection(spec, pascalName),
    "",
    accessibilitySection(spec, pascalName),
    "",
  );

  return sections.join("\n");
};
