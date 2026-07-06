import {
  RADIUS_STEP_NAMES,
  axisEntries,
  friClass,
  radiusRatios,
} from "./helpers";

import type { Axis, ComponentSpec, Layout, Part } from "../component-spec";

const STEP_ORDER = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

const PAINT_OVER_ROLE: Record<
  string,
  {
    background: string;
    foreground: string;
    border: string;
    hover: string;
    pressed: string;
  }
> = {
  solid: {
    background: "color",
    foreground: "color-foreground",
    border: "transparent",
    hover: "color-hover",
    pressed: "color-pressed",
  },
  subtle: {
    background: "color-secondary",
    foreground: "color-secondary-foreground",
    border: "transparent",
    hover: "color-secondary-hover",
    pressed: "color-secondary-pressed",
  },
  surface: {
    background: "color-secondary",
    foreground: "color-secondary-foreground",
    border: "color-border",
    hover: "color-secondary-hover",
    pressed: "color-secondary-pressed",
  },
  outline: {
    background: "transparent",
    foreground: "color",
    border: "color-outline-border",
    hover: "color-tint-hover",
    pressed: "color-tint-pressed",
  },
  ghost: {
    background: "transparent",
    foreground: "color",
    border: "transparent",
    hover: "color-tint-hover",
    pressed: "color-tint-pressed",
  },
  plain: {
    background: "transparent",
    foreground: "color",
    border: "transparent",
    hover: "transparent",
    pressed: "transparent",
  },
};

const PAINT_OVER_SURFACE: Record<
  string,
  { background: string; border: string }
> = {
  primary: { background: "var(--fri-surface)", border: "transparent" },
  secondary: {
    background: "var(--fri-surface-secondary)",
    border: "transparent",
  },
  outline: {
    background: "transparent",
    border: "var(--fri-surface-outline-border)",
  },
};

const paintOverRole = (value: string) => {
  const entry = PAINT_OVER_ROLE[value];
  if (!entry)
    throw new Error(`emitCss: unknown interactive paint value "${value}"`);
  return entry;
};

const paintOverSurface = (value: string) => {
  const entry = PAINT_OVER_SURFACE[value];
  if (!entry)
    throw new Error(`emitCss: unknown surface paint value "${value}"`);
  return entry;
};

const formatRatio = (ratio: number): string =>
  String(Math.round(ratio * 10000) / 10000);

const names = (name: string, part: Part): { cls: string; prop: string } => {
  const cls = friClass(name, part, "");
  return { cls, prop: cls.slice("fri-".length) };
};

const selector = (base: string, isDefault: boolean, own: string): string =>
  isDefault ? `:where(.${base}),\n  .${own}` : `.${own}`;

const rule = (head: string, lines: string[]): string =>
  `  ${head} {\n${lines.map((line) => `    ${line}`).join("\n")}\n  }`;

const emitRole = (spec: ComponentSpec, part: Part, axis: Axis): string => {
  const { cls, prop } = names(spec.name, part);
  const interactive = spec.primitive.interactive;
  return axisEntries(axis)
    .map(([value, suffix]) => {
      const own = friClass(spec.name, part, suffix);
      const head = selector(cls, axis.default === value, own);
      const lines = interactive
        ? [
            `--${prop}-color: var(--fri-${value});`,
            `--${prop}-color-foreground: var(--fri-${value}-foreground);`,
            `--${prop}-color-secondary: var(--fri-${value}-secondary);`,
            `--${prop}-color-secondary-foreground: var(--fri-${value}-secondary-foreground);`,
            `--${prop}-color-hover: var(--fri-${value}-hover);`,
            `--${prop}-color-pressed: var(--fri-${value}-pressed);`,
            `--${prop}-color-secondary-hover: var(--fri-${value}-secondary-hover);`,
            `--${prop}-color-secondary-pressed: var(--fri-${value}-secondary-pressed);`,
            `--${prop}-color-border: var(--fri-${value}-border);`,
            `--${prop}-color-outline-border: var(--fri-${value}-outline-border);`,
            `--${prop}-color-tint-hover: var(--fri-${value}-tint-hover);`,
            `--${prop}-color-tint-pressed: var(--fri-${value}-tint-pressed);`,
          ]
        : [`@apply text-${value};`];
      return rule(head, lines);
    })
    .join("\n\n");
};

const emitPaint = (spec: ComponentSpec, part: Part, axis: Axis): string => {
  const { cls, prop } = names(spec.name, part);
  const interactive = spec.primitive.interactive;
  const ref = (value: string): string =>
    value === "transparent" ? "transparent" : `var(--${prop}-${value})`;
  return axisEntries(axis)
    .map(([value, suffix]) => {
      const own = friClass(spec.name, part, suffix);
      const head = selector(cls, axis.default === value, own);
      if (interactive) {
        const paint = paintOverRole(value);
        return rule(head, [
          `--${prop}-background: ${ref(paint.background)};`,
          `--${prop}-foreground: ${ref(paint.foreground)};`,
          `--${prop}-border-color: ${ref(paint.border)};`,
          `--${prop}-background-hover: ${ref(paint.hover)};`,
          `--${prop}-background-pressed: ${ref(paint.pressed)};`,
        ]);
      }
      const paint = paintOverSurface(value);
      return rule(head, [
        `--${prop}-background: ${paint.background};`,
        `--${prop}-border-color: ${paint.border};`,
      ]);
    })
    .join("\n\n");
};

const emitRadiusScale = (spec: ComponentSpec, part: Part, axis: Axis): string =>
  axisEntries(axis)
    .map(([value]) => {
      const own = friClass(spec.name, part, `radius-${value}`);
      const long = value === "none" ? "none" : RADIUS_STEP_NAMES[value];
      return rule(`.${own}`, [`@apply rounded-${long};`]);
    })
    .join("\n\n");

const emitGeneric = (
  spec: ComponentSpec,
  part: Part,
  key: string,
  axis: Axis,
): string => {
  const { cls, prop } = names(spec.name, part);
  return axisEntries(axis)
    .map(([value, suffix]) => {
      const own = friClass(spec.name, part, suffix);
      const head = selector(cls, axis.default === value, own);
      const mapped = axis.prop?.map?.[value];
      const line = mapped ? `@apply ${mapped};` : `--${prop}-${key}: ${value};`;
      return rule(head, [line]);
    })
    .join("\n\n");
};

const emitSizeSteps = (
  spec: ComponentSpec,
  part: Part,
  layout: Layout,
): string => {
  const { cls, prop } = names(spec.name, part);
  const ratios = radiusRatios(layout.size);

  if (layout.size.kind === "ramp") {
    return Object.entries(layout.size.n)
      .map(([step, n]) => {
        const own = friClass(spec.name, part, step);
        const lines = [`--_${prop}-n: ${n};`];
        if (layout.radiusArchetype)
          lines.push(
            `--${prop}-radius: calc(var(--fri-${layout.radiusArchetype}-radius) * ${formatRatio(ratios[step])});`,
          );
        return rule(`.${own}`, lines);
      })
      .join("\n\n");
  }

  const sizeAxis = part.variants?.size;
  const entries: [string, string][] = sizeAxis
    ? axisEntries(sizeAxis)
    : STEP_ORDER.map((step) => [step, step]);
  return entries
    .map(([value, suffix]) => {
      const own = friClass(spec.name, part, suffix);
      const isDefault = sizeAxis !== undefined && sizeAxis.default === value;
      const head = selector(cls, isDefault, own);
      const lines: string[] = [];
      if (layout.radiusArchetype)
        lines.push(
          `--${prop}-radius: calc(var(--fri-${layout.radiusArchetype}-radius) * ${formatRatio(ratios[value])});`,
        );
      lines.push(
        `@apply size-(--fri-scale-${RADIUS_STEP_NAMES[value] ?? value});`,
      );
      return rule(head, lines);
    })
    .join("\n\n");
};

const emitBase = (spec: ComponentSpec, part: Part): string => {
  const { cls, prop } = names(spec.name, part);
  const interactive = spec.primitive.interactive;
  const layout = part.layout;
  const paintAxis = Object.values(part.variants ?? {}).find(
    (axis) => axis.mechanism === "paint",
  );

  const props: string[] = [];
  const apply: string[] = [];

  if (interactive) apply.push("relative", "inline-flex", "shrink-0");
  else if (layout) apply.push("inline-block", "shrink-0");

  if (interactive) apply.push("items-center", "justify-center");

  if (layout?.size.kind === "ramp") {
    const dim = interactive ? "h" : "size";
    props.push(`--_${prop}-n: ${layout.size.md};`);
    props.push(
      `--${prop}-${dim}: calc(var(--fri-spacing-xsmall) * var(--_${prop}-n));`,
    );
    apply.push(`${dim}-(--${prop}-${dim})`);
    if (part.spacing?.includes("gap")) {
      props.push(
        `--${prop}-gap: calc(var(--fri-spacing-small) * var(--_${prop}-n) / 10);`,
      );
      apply.push(`gap-(--${prop}-gap)`);
    }
    if (part.spacing?.includes("padding")) {
      props.push(
        `--${prop}-px: calc(var(--${prop}-${dim}) / 2 - var(--fri-spacing-xsmall));`,
      );
      apply.push(`px-(--${prop}-px)`);
    }
  }

  if (layout?.radiusArchetype) {
    const ratios = radiusRatios(layout.size);
    props.push(
      `--${prop}-radius: calc(var(--fri-${layout.radiusArchetype}-radius) * ${formatRatio(ratios.md)});`,
    );
    apply.push(`rounded-(--${prop}-radius)`);
  }

  if (paintAxis) {
    apply.push(
      "border-(length:--fri-border-width)",
      `border-(--${prop}-border-color)`,
      `bg-(--${prop}-background)`,
    );
    if (interactive) apply.push(`text-(--${prop}-foreground)`);
  } else {
    for (const binding of part.tokens ?? []) {
      if (binding.slot === "background") {
        props.push(`--${prop}-background: var(--fri-${binding.binds});`);
        apply.push(`bg-(--${prop}-background)`);
      } else if (binding.slot === "foreground") {
        props.push(`--${prop}-foreground: var(--fri-${binding.binds});`);
        apply.push(`text-(--${prop}-foreground)`);
      } else if (binding.slot === "border") {
        props.push(`--${prop}-border: var(--fri-${binding.binds});`);
        apply.push(
          "border-(length:--fri-border-width)",
          `border-(--${prop}-border)`,
        );
      } else {
        props.push(`--${prop}-ring: var(--fri-${binding.binds});`);
        apply.push(`ring-(--${prop}-ring)`);
      }
    }
  }

  if (interactive)
    apply.push(
      "cursor-(--fri-cursor-interactive)",
      "transition-base",
      "outline-none",
    );

  return rule(`.${cls}`, [...props, `@apply ${apply.join(" ")};`]);
};

const emitPart = (spec: ComponentSpec, part: Part): string => {
  const variants = part.variants ?? {};
  const blocks = [emitBase(spec, part)];

  for (const [key, axis] of Object.entries(variants)) {
    if (axis.mechanism === "role") blocks.push(emitRole(spec, part, axis));
    else if (axis.mechanism === "paint")
      blocks.push(emitPaint(spec, part, axis));
    else if (axis.mechanism === "radius-scale")
      blocks.push(emitRadiusScale(spec, part, axis));
    else if (key !== "size" || !part.layout)
      blocks.push(emitGeneric(spec, part, key, axis));
  }

  if (part.layout) blocks.push(emitSizeSteps(spec, part, part.layout));

  return blocks.join("\n\n");
};

export const emitCss = (spec: ComponentSpec): string => {
  const parts = [spec.root, ...(spec.parts ?? [])];
  const body = parts.map((part) => emitPart(spec, part)).join("\n\n");
  return `@layer components {\n${body}\n}\n`;
};
