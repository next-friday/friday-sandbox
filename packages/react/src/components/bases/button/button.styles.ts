import { cva } from "class-variance-authority";

import type { StrictVariantProps } from "../../utils/variant-props";

export const buttonVariants = cva("fri-button", {
  variants: {
    color: {
      primary: "fri-button-primary",
      secondary: "fri-button-secondary",
      accent: "fri-button-accent",
      info: "fri-button-info",
      success: "fri-button-success",
      warning: "fri-button-warning",
      danger: "fri-button-danger",
    },
    variant: {
      solid: "fri-button-solid",
      subtle: "fri-button-subtle",
      surface: "fri-button-surface",
      outline: "fri-button-outline",
      ghost: "fri-button-ghost",
      plain: "fri-button-plain",
    },
    size: {
      xs: "fri-button-xs",
      sm: "fri-button-sm",
      md: "fri-button-md",
      lg: "fri-button-lg",
      xl: "fri-button-xl",
    },
    isIconOnly: {
      true: "fri-button-icon-only",
    },
    isFullWidth: {
      true: "fri-button-full-width",
    },
    isRoundedFull: {
      true: "fri-button-rounded-full",
    },
  },
  defaultVariants: {
    color: "primary",
    variant: "solid",
    size: "md",
  },
});

export type ButtonVariants = StrictVariantProps<typeof buttonVariants>;
