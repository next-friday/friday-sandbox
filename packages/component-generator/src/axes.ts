import type { Axis } from "./component-spec";

const identity = (steps: readonly string[]): Record<string, string> =>
  Object.fromEntries(steps.map((step) => [step, step]));

const SIZE_STEPS = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
type SizeStep = (typeof SIZE_STEPS)[number];

export const size = (upTo: SizeStep): Axis => ({
  values: identity(SIZE_STEPS.slice(0, SIZE_STEPS.indexOf(upTo) + 1)),
});

export const roleColor: Axis = {
  values: identity([
    "primary",
    "secondary",
    "accent",
    "info",
    "success",
    "warning",
    "danger",
  ]),
  mechanism: "role",
};

export const typeScale: Axis = {
  values: identity([
    "inherit",
    "display-xxl",
    "display-xl",
    "display-lg",
    "display-md",
    "display-sm",
    "body-lg",
    "body-lg-strong",
    "body-md",
    "body-md-strong",
    "body-sm",
    "body-sm-strong",
    "body-xs",
    "body-xs-strong",
    "label-lg",
    "label-md",
    "label-sm",
    "caption",
    "caption-strong",
    "code",
  ]),
};
