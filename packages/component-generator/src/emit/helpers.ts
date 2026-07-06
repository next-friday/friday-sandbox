import type { Axis, Part, SizeSource } from "../component-spec";

const SCALE_PX: Record<string, number> = {
  xs: 24,
  sm: 36,
  md: 48,
  lg: 64,
  xl: 80,
  "2xl": 112,
};

export const kebabCase = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export const pascalCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join("");

export const camelCase = (value: string): string => {
  const pascal = pascalCase(value);
  return pascal.length === 0
    ? pascal
    : pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

export const RADIUS_STEP_NAMES: Record<string, string> = {
  xs: "xsmall",
  sm: "small",
  md: "medium",
  lg: "large",
  xl: "xlarge",
  "2xl": "2xlarge",
};

export const friClass = (name: string, part: Part, suffix: string): string => {
  const base =
    part.role === "root"
      ? `fri-${name}`
      : `fri-${name}-${kebabCase(part.role)}`;
  return suffix === "" ? base : `${base}-${suffix}`;
};

export const radiusRatios = (size: SizeSource): Record<string, number> => {
  if (size.kind === "ramp") {
    return Object.fromEntries(
      Object.entries(size.n).map(([step, value]) => [step, value / size.md]),
    );
  }
  return Object.fromEntries(
    Object.entries(SCALE_PX).map(([step, px]) => [step, px / SCALE_PX.md]),
  );
};

export const axisEntries = (axis: Axis): [value: string, suffix: string][] =>
  Object.entries(axis.values);
