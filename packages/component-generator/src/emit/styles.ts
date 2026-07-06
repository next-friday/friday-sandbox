import { axisEntries, camelCase, friClass, pascalCase } from "./helpers";

import type { ComponentSpec, Part } from "../component-spec";

type FlatVariantValue = string;
type SlottedVariantValue = Record<string, string>;
type VariantValue = FlatVariantValue | SlottedVariantValue;
type VariantMap = Record<string, Record<string, VariantValue>>;

const isIdentifierKey = (key: string): boolean =>
  /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);

const isNumericKey = (key: string): boolean => /^(0|[1-9][0-9]*)$/.test(key);

const quoteKey = (key: string): string =>
  isIdentifierKey(key) || isNumericKey(key) ? key : JSON.stringify(key);

const pad = (depth: number): string => "  ".repeat(depth);

const renderStringMap = (
  entries: [string, string][],
  depth: number,
): string => {
  if (entries.length === 0) return "{}";
  const body = entries
    .map(
      ([key, value]) =>
        `${pad(depth + 1)}${quoteKey(key)}: ${JSON.stringify(value)},`,
    )
    .join("\n");
  return `{\n${body}\n${pad(depth)}}`;
};

const renderVariantValue = (value: VariantValue, depth: number): string => {
  if (typeof value === "string") return JSON.stringify(value);
  const entries = Object.entries(value);
  if (entries.length <= 1)
    return `{ ${entries
      .map(([key, cls]) => `${quoteKey(key)}: ${JSON.stringify(cls)}`)
      .join(", ")} }`;
  return renderStringMap(entries, depth);
};

const renderVariants = (
  variants: VariantMap,
  depth: number,
  spreadNames: readonly string[] = [],
): string => {
  const axisNames = Object.keys(variants);
  const axisLines = axisNames.map((axisName) => {
    const values = variants[axisName];
    const valueLines = Object.entries(values)
      .map(
        ([value, cls]) =>
          `${pad(depth + 2)}${quoteKey(value)}: ${renderVariantValue(cls, depth + 2)},`,
      )
      .join("\n");
    return `${pad(depth + 1)}${quoteKey(axisName)}: {\n${valueLines}\n${pad(depth + 1)}},`;
  });
  const spreadLines = spreadNames.map((name) => `${pad(depth + 1)}...${name},`);
  const lines = [...axisLines, ...spreadLines];
  if (lines.length === 0) return "{}";
  return `{\n${lines.join("\n")}\n${pad(depth)}}`;
};

const spacingVariantNames = (parts: Part[], isSlotted: boolean): string[] => {
  const hasGap = parts.some((part) => part.spacing?.includes("gap"));
  const hasPadding = parts.some((part) => part.spacing?.includes("padding"));
  return [
    hasGap ? (isSlotted ? "gapSlotVariants" : "gapVariants") : undefined,
    hasPadding
      ? isSlotted
        ? "paddingSlotVariants"
        : "paddingVariants"
      : undefined,
  ].filter((name): name is string => name !== undefined);
};

const collectVariants = (
  name: string,
  parts: Part[],
  isSlotted: boolean,
): { variants: VariantMap; defaultVariants: Record<string, string> } => {
  const variants: VariantMap = {};
  const defaultVariants: Record<string, string> = {};

  for (const part of parts) {
    for (const [axisName, axis] of Object.entries(part.variants ?? {})) {
      const bucket: Record<string, VariantValue> = (variants[axisName] ??= {});
      for (const [value, suffix] of axisEntries(axis)) {
        if (axis.boolean === true && suffix === "") continue;
        const className = suffix === "" ? "" : friClass(name, part, suffix);
        if (isSlotted) {
          const existing = bucket[value];
          const slotMap: SlottedVariantValue =
            typeof existing === "object" ? existing : {};
          slotMap[part.role] = className;
          bucket[value] = slotMap;
        } else {
          bucket[value] = className;
        }
      }
      if (axis.default !== undefined) defaultVariants[axisName] = axis.default;
    }
  }

  return { variants, defaultVariants };
};

export const emitStyles = (spec: ComponentSpec): string => {
  const parts = [spec.root, ...(spec.parts ?? [])];
  const isSlotted = (spec.parts?.length ?? 0) > 0;

  const { variants, defaultVariants } = collectVariants(
    spec.name,
    parts,
    isSlotted,
  );
  const spreadNames = spacingVariantNames(parts, isSlotted);

  const constName = `${camelCase(spec.name)}Variants`;
  const typeName = `${pascalCase(spec.name)}Variants`;

  const shapeLine = isSlotted
    ? `${pad(1)}slots: ${renderStringMap(
        parts.map((part): [string, string] => [
          part.role,
          friClass(spec.name, part, ""),
        ]),
        1,
      )},`
    : `${pad(1)}base: ${JSON.stringify(friClass(spec.name, spec.root, ""))},`;

  const variantsLine = `${pad(1)}variants: ${renderVariants(variants, 1, spreadNames)},`;

  const defaultVariantsEntries = Object.entries(defaultVariants);
  const defaultVariantsLine =
    defaultVariantsEntries.length > 0
      ? `${pad(1)}defaultVariants: ${renderStringMap(defaultVariantsEntries, 1)},`
      : "";

  const bodyLines = [shapeLine, variantsLine, defaultVariantsLine].filter(
    (line) => line.length > 0,
  );

  const spacingImportLine =
    spreadNames.length > 0
      ? `import { ${spreadNames.join(", ")} } from "../../utils/spacing-variants";`
      : "";

  const importLines = [
    `import { tv } from "tailwind-variants/lite";`,
    `import type { VariantProps } from "tailwind-variants/lite";`,
  ];
  if (spacingImportLine !== "") importLines.push("", spacingImportLine);

  return [
    importLines.join("\n"),
    "",
    `export const ${constName} = tv({`,
    ...bodyLines,
    `});`,
    "",
    `export type ${typeName} = VariantProps<typeof ${constName}>;`,
    "",
  ].join("\n");
};
