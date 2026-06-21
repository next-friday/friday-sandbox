import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const buttonVariants = tv({
  base: "fri-button",
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
  },
  defaultVariants: {
    color: "primary",
    variant: "solid",
    size: "md",
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
