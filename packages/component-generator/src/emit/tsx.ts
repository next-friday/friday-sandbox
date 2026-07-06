import { camelCase, friClass, pascalCase } from "./helpers";

import type { ComponentSpec, Part } from "../component-spec";

const dataSlot = (spec: ComponentSpec, part: Part): string =>
  friClass(spec.name, part, "").replace(/^fri-/, "");

const exportName = (spec: ComponentSpec, part: Part): string =>
  part.role === "root"
    ? pascalCase(spec.name)
    : `${pascalCase(spec.name)}${pascalCase(part.role)}`;

const jsxTag = (spec: ComponentSpec, part: Part): string => {
  if ("native" in part.element) return part.element.native;
  if (spec.primitive.kind === "radix")
    return `Radix${spec.primitive.part}.${part.element.wraps}`;
  return `Aria${part.element.wraps}`;
};

const refExpr = (spec: ComponentSpec, part: Part): string =>
  "native" in part.element
    ? JSON.stringify(part.element.native)
    : `typeof ${jsxTag(spec, part)}`;

const componentPropsWithRef = (spec: ComponentSpec, part: Part): string =>
  `ComponentPropsWithRef<${refExpr(spec, part)}>`;

const ariaWrapsUsed = (parts: Part[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of parts) {
    if ("wraps" in part.element && !seen.has(part.element.wraps)) {
      seen.add(part.element.wraps);
      result.push(part.element.wraps);
    }
  }
  return result;
};

const emitPart = (
  spec: ComponentSpec,
  part: Part,
  isCompound: boolean,
  constName: string,
  variantsTypeName: string,
): string[] => {
  const name = exportName(spec, part);
  const propsName = `${name}Props`;
  const axisNames = Object.keys(part.variants ?? {}).sort();
  const hasVariants = axisNames.length > 0;
  const extendsList = [
    componentPropsWithRef(spec, part),
    ...(hasVariants ? [variantsTypeName] : []),
  ];
  const destructured = [
    ...new Set(["children", "className", ...axisNames]),
  ].sort();
  const slot = dataSlot(spec, part);
  const tag = jsxTag(spec, part);
  const callArgs = hasVariants ? `{ ${axisNames.join(", ")} }` : "";
  const requiredLines = (part.required ?? []).map(
    (propName) =>
      `  ${propName}: NonNullable<${componentPropsWithRef(spec, part)}["${propName}"]>;`,
  );

  const lines: string[] = [
    `export interface ${propsName}`,
    `  extends ${extendsList.join(", ")} {`,
    ...requiredLines,
    `  className?: string;`,
    `}`,
    "",
    `export const ${name} = (props: Readonly<${propsName}>) => {`,
    `  const {`,
    ...destructured.map((d) => `    ${d},`),
    `    ...rest`,
    `  } = props;`,
    "",
  ];

  if (isCompound) {
    lines.push(`  const slots = ${constName}(${callArgs});`);
    if (spec.primitive.interactive)
      lines.push(
        `  const resolvedClassName = composeTailwindRenderProps(`,
        `    className,`,
        `    slots.${part.role}(),`,
        `  );`,
      );
    else
      lines.push(
        `  const resolvedClassName = slots.${part.role}({ class: className });`,
      );
  } else if (spec.primitive.interactive) {
    lines.push(
      `  const resolvedClassName = composeTailwindRenderProps(`,
      `    className,`,
      `    ${constName}(${callArgs}),`,
      `  );`,
    );
  } else {
    lines.push(`  const resolvedClassName = ${constName}({`);
    for (const axisName of axisNames) lines.push(`    ${axisName},`);
    lines.push(`    class: className,`);
    lines.push(`  });`);
  }

  lines.push(
    "",
    `  return (`,
    `    <${tag} data-slot="${slot}" className={resolvedClassName} {...rest}>`,
    `      {children}`,
    `    </${tag}>`,
    `  );`,
    `};`,
  );

  return lines;
};

export const emitTsx = (spec: ComponentSpec): string => {
  const parts = [spec.root, ...(spec.parts ?? [])];
  const isCompound = (spec.parts?.length ?? 0) > 0;
  const constName = `${camelCase(spec.name)}Variants`;
  const typeName = `${pascalCase(spec.name)}Variants`;

  const lines: string[] = [];

  if (spec.primitive.client) lines.push(`"use client";`, "");

  if (spec.primitive.kind === "react-aria")
    for (const wraps of ariaWrapsUsed(parts))
      lines.push(
        `import { ${wraps} as Aria${wraps} } from "react-aria-components/${wraps}";`,
      );
  if (spec.primitive.kind === "radix")
    lines.push(
      `import { ${spec.primitive.part} as Radix${spec.primitive.part} } from "radix-ui";`,
    );
  lines.push(`import type { ComponentPropsWithRef } from "react";`);
  lines.push("");

  if (spec.primitive.interactive) {
    lines.push(
      `import { composeTailwindRenderProps } from "../../utils/compose-tailwind-render-props";`,
    );
    lines.push("");
  }

  lines.push(`import { ${constName} } from "./${spec.name}.styles";`);
  lines.push(`import type { ${typeName} } from "./${spec.name}.styles";`);

  for (const part of parts) {
    lines.push("");
    lines.push(...emitPart(spec, part, isCompound, constName, typeName));
  }

  return `${lines.join("\n")}\n`;
};
