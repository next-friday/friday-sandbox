import { axisEntries, kebabCase, pascalCase } from "./helpers";

import type { Axis, ComponentSpec, Part } from "../component-spec";

export const labelCase = (value: string): string =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export interface DemoAxis {
  key: string;
  axis: Axis;
}

export interface DemoAxes {
  variant?: DemoAxis;
  size?: DemoAxis;
}

export const selectDemoAxes = (root: Part): DemoAxes => {
  const variants = root.variants ?? {};
  const sizeAxis = variants.size;
  const variantEntry: [string, Axis] | undefined = Object.hasOwn(
    variants,
    "variant",
  )
    ? ["variant", variants.variant!]
    : Object.entries(variants).find(
        ([key, axis]) => key !== "size" && !axis.boolean,
      );
  return {
    size: sizeAxis ? { key: "size", axis: sizeAxis } : undefined,
    variant: variantEntry
      ? { key: variantEntry[0], axis: variantEntry[1] }
      : undefined,
  };
};

export const isNativeContainer = (part: Part): boolean =>
  "native" in part.element;

const isImagePart = (part: Part): boolean =>
  ("native" in part.element && part.element.native === "img") ||
  ("wraps" in part.element && part.element.wraps === "Image");

export type DemoContent =
  | { kind: "container" }
  | { kind: "text"; text: string }
  | { kind: "image"; url: string; alt: string }
  | { kind: "bare" };

export const selectDemoContent = (
  spec: ComponentSpec,
  demoAxes: DemoAxes,
): DemoContent => {
  const hasDemoAxis = Boolean(demoAxes.variant) || Boolean(demoAxes.size);
  const isLeaf = (spec.parts?.length ?? 0) === 0;
  const [asset] = spec.assets ?? [];
  if (isLeaf && isImagePart(spec.root) && asset !== undefined)
    return {
      kind: "image",
      url: asset.url,
      alt: asset.alt ?? pascalCase(spec.name),
    };
  if (isNativeContainer(spec.root) && !hasDemoAxis)
    return { kind: "container" };
  if ((spec.parts?.length ?? 0) > 0) return { kind: "bare" };
  return { kind: "text", text: pascalCase(spec.name) };
};

const FLEX_IMPORT = 'import { Flex } from "../flex";';
const BOXES_IMPORT = 'import { Boxes } from "@friday-sandbox/react/samples";';

const axisElement = (
  pascalName: string,
  propKey: string,
  value: string,
): string =>
  [
    `      <${pascalName} {...storyArgs} ${propKey}="${value}">`,
    `        ${labelCase(value)}`,
    `      </${pascalName}>`,
  ].join("\n");

const axisShowcase = (pascalName: string, demoAxis: DemoAxis): string => {
  const elements = axisEntries(demoAxis.axis)
    .map(([value]) => axisElement(pascalName, demoAxis.key, value))
    .join("\n\n");
  return [
    `export const ${pascalCase(demoAxis.key)}: Story = {`,
    `  render: (storyArgs) => (`,
    `    <Flex wrap="wrap" align="center" gap="md">`,
    elements,
    `    </Flex>`,
    `  ),`,
    `};`,
  ].join("\n");
};

const defaultStory = (pascalName: string, content: DemoContent): string => {
  if (content.kind === "container")
    return [
      `export const Default: Story = {`,
      `  render: (storyArgs) => (`,
      `    <${pascalName} {...storyArgs}>`,
      `      <Boxes count={3} />`,
      `    </${pascalName}>`,
      `  ),`,
      `};`,
    ].join("\n");
  return `export const Default: Story = {};`;
};

const buildMeta = (
  spec: ComponentSpec,
  pascalName: string,
  kebabName: string,
  content: DemoContent,
): string => {
  const metaFields = [
    `  title: "Bases/${pascalName}",`,
    `  component: ${pascalName},`,
    `  tags: ["autodocs"],`,
    `  parameters: {`,
    `    docs: {`,
    `      description: {`,
    `        component: [`,
    `          ${JSON.stringify(spec.prose.purpose)},`,
    `          "",`,
    `          "## Import",`,
    `          "",`,
    '          "```tsx",',
    `          ${JSON.stringify(`import { ${pascalName} } from "@friday-sandbox/react";`)},`,
    '          "```",',
    `        ].join("\\n"),`,
    `      },`,
    `    },`,
    `  },`,
  ];
  if (content.kind === "text")
    metaFields.push(
      `  args: {`,
      `    children: ${JSON.stringify(content.text)},`,
      `  },`,
    );
  if (content.kind === "image")
    metaFields.push(
      `  args: {`,
      `    src: ${JSON.stringify(content.url)},`,
      `    alt: ${JSON.stringify(content.alt)},`,
      `  },`,
    );
  const argTypesEntries: string[] = [];
  if (content.kind === "text")
    argTypesEntries.push(
      [
        `    children: {`,
        `      description: "The content to display inside the ${kebabName}.",`,
        `      control: "text",`,
        `      table: { type: { summary: "ReactNode" } },`,
        `    },`,
      ].join("\n"),
    );
  if (content.kind === "image")
    argTypesEntries.push(
      [
        `    src: {`,
        `      description: "The image source for the ${kebabName}.",`,
        `      control: "text",`,
        `      table: { type: { summary: "string" } },`,
        `    },`,
      ].join("\n"),
      [
        `    alt: {`,
        `      description: "The accessible alt text for the ${kebabName}.",`,
        `      control: "text",`,
        `      table: { type: { summary: "string" } },`,
        `    },`,
      ].join("\n"),
    );
  argTypesEntries.push(
    [
      `    className: {`,
      `      description: "Additional CSS classes to apply to the ${kebabName}.",`,
      `      control: "text",`,
      `      table: { type: { summary: "string" } },`,
      `    },`,
    ].join("\n"),
  );
  return [
    `const meta = {`,
    ...metaFields,
    `  argTypes: {`,
    argTypesEntries.join("\n"),
    `  },`,
    `} satisfies Meta<typeof ${pascalName}>;`,
  ].join("\n");
};

export const emitStories = (spec: ComponentSpec): string => {
  const pascalName = pascalCase(spec.name);
  const kebabName = kebabCase(spec.name);
  const demoAxes = selectDemoAxes(spec.root);
  const content = selectDemoContent(spec, demoAxes);
  const needsFlex =
    Boolean(demoAxes.variant) ||
    Boolean(demoAxes.size) ||
    content.kind === "container";
  const needsBoxes = content.kind === "container";

  const externalImports = needsBoxes
    ? [
        BOXES_IMPORT,
        'import type { Meta, StoryObj } from "@storybook/react-vite";',
      ]
    : ['import type { Meta, StoryObj } from "@storybook/react-vite";'];

  const importBlocks = [externalImports.join("\n")];
  if (needsFlex) importBlocks.push(FLEX_IMPORT);
  importBlocks.push(`import { ${pascalName} } from ".";`);

  const stories = [defaultStory(pascalName, content)];
  if (demoAxes.variant)
    stories.push(axisShowcase(pascalName, demoAxes.variant));
  if (demoAxes.size) stories.push(axisShowcase(pascalName, demoAxes.size));

  return [
    importBlocks.join("\n\n"),
    "",
    buildMeta(spec, pascalName, kebabName, content),
    "",
    "export default meta;",
    "",
    "type Story = StoryObj<typeof meta>;",
    "",
    stories.join("\n\n"),
    "",
  ].join("\n");
};
