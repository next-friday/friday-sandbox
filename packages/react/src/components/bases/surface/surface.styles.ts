import { cva } from "class-variance-authority";

import { paddingVariants } from "../../utils/spacing-variants";

import type { StrictVariantProps } from "../../utils/variant-props";

export const surfaceVariants = cva("fri-surface", {
  variants: {
    variant: {
      primary: "fri-surface-primary",
      secondary: "fri-surface-secondary",
      outline: "fri-surface-outline",
    },
    radius: {
      none: "fri-surface-radius-none",
      xs: "fri-surface-radius-xs",
      sm: "fri-surface-radius-sm",
      md: "fri-surface-radius-md",
      lg: "fri-surface-radius-lg",
      xl: "fri-surface-radius-xl",
    },
    ...paddingVariants,
  },
  defaultVariants: {
    variant: "primary",
    radius: "md",
  },
});

export type SurfaceVariants = StrictVariantProps<typeof surfaceVariants>;
