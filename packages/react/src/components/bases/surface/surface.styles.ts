import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

import { paddingVariants } from "../../utils/spacing-variants";

export const surfaceVariants = tv({
  base: "fri-surface",
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

export type SurfaceVariants = VariantProps<typeof surfaceVariants>;
