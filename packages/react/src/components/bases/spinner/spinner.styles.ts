import { cva } from "class-variance-authority";

import type { StrictVariantProps } from "../../utils/variant-props";

export const spinnerVariants = cva("fri-spinner", {
  variants: {
    color: {
      primary: "fri-spinner-primary",
      secondary: "fri-spinner-secondary",
      accent: "fri-spinner-accent",
      info: "fri-spinner-info",
      success: "fri-spinner-success",
      warning: "fri-spinner-warning",
      danger: "fri-spinner-danger",
    },
    size: {
      xs: "fri-spinner-xs",
      sm: "fri-spinner-sm",
      md: "fri-spinner-md",
      lg: "fri-spinner-lg",
      xl: "fri-spinner-xl",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

export type SpinnerVariants = StrictVariantProps<typeof spinnerVariants>;
