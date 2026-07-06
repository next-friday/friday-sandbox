import { RADIUS_STEP_NAMES } from "./emit/helpers";
import { REGISTERED_KINDS } from "./registry";

import type { Axis, ComponentSpec, Part } from "./component-spec";

export interface SpecError {
  spec: string;
  where: string;
  message: string;
}

const registeredKinds: ReadonlySet<string> = new Set(REGISTERED_KINDS);

const partLabel = (part: Part): string =>
  part.role === "root" ? "root" : `parts.${part.role}`;

const checkKindRegistered = (spec: ComponentSpec): SpecError[] =>
  registeredKinds.has(spec.primitive.kind)
    ? []
    : [
        {
          spec: spec.name,
          where: "primitive.kind",
          message: `"${spec.primitive.kind}" has no registered adapter (${REGISTERED_KINDS.join(", ")})`,
        },
      ];

const checkCompoundShape = (spec: ComponentSpec): SpecError[] => {
  const partCount = spec.parts?.length ?? 0;
  const errors: SpecError[] = [];
  if (partCount > 0 && spec.compound === undefined)
    errors.push({
      spec: spec.name,
      where: "compound",
      message: `${partCount} part(s) but no compound shape (callable-root | namespace-of-parts)`,
    });
  if (spec.compound !== undefined && partCount === 0)
    errors.push({
      spec: spec.name,
      where: "compound",
      message: `declares compound "${spec.compound}" but has no parts`,
    });
  return errors;
};

const checkDefaultsAreMembers = (spec: ComponentSpec): SpecError[] => {
  const errors: SpecError[] = [];
  for (const part of [spec.root, ...(spec.parts ?? [])])
    for (const [axis, def] of Object.entries(part.variants ?? {})) {
      if (def.default === undefined) continue;
      if (!(def.default in def.values))
        errors.push({
          spec: spec.name,
          where: `${partLabel(part)}.variants.${axis}`,
          message: `default "${def.default}" is not a value of the axis (have: ${Object.keys(def.values).join(", ")})`,
        });
    }
  return errors;
};

const axisTokens = (axis: Axis): string[] => {
  if (axis.mechanism === "role")
    return Object.values(axis.values).map((value) => `--fri-${value}`);
  if (axis.mechanism === "radius-scale")
    return Object.values(axis.values)
      .filter((value) => value !== "none")
      .map((value) => `--fri-radius-${RADIUS_STEP_NAMES[value] ?? value}`);
  return [];
};

const checkTokensExist = (
  spec: ComponentSpec,
  defined: ReadonlySet<string>,
): SpecError[] => {
  const errors: SpecError[] = [];
  for (const part of [spec.root, ...(spec.parts ?? [])]) {
    for (const binding of part.tokens ?? []) {
      const token = `--fri-${binding.binds}`;
      if (!defined.has(token))
        errors.push({
          spec: spec.name,
          where: `${partLabel(part)}.tokens.${binding.slot}`,
          message: `"${token}" is not a defined --fri-* token`,
        });
    }
    for (const [axis, def] of Object.entries(part.variants ?? {}))
      for (const token of axisTokens(def))
        if (!defined.has(token))
          errors.push({
            spec: spec.name,
            where: `${partLabel(part)}.variants.${axis}`,
            message: `"${token}" is not a defined --fri-* token`,
          });
  }
  return errors;
};

export const validateSpec = (
  spec: ComponentSpec,
  defined: ReadonlySet<string> = new Set(),
): SpecError[] => [
  ...checkKindRegistered(spec),
  ...checkCompoundShape(spec),
  ...checkDefaultsAreMembers(spec),
  ...(defined.size > 0 ? checkTokensExist(spec, defined) : []),
];
