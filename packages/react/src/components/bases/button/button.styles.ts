import { tv, type VariantProps } from "tailwind-variants/lite";

export const buttonVariants = tv({
  base: "fri-button",
  variants: {
    variant: {
      primary: "fri-button-primary",
      secondary: "fri-button-secondary",
      accent: "fri-button-accent",
      neutral: "fri-button-neutral",
      info: "fri-button-info",
      success: "fri-button-success",
      warning: "fri-button-warning",
      error: "fri-button-error",
    },
    size: {
      xs: "fri-button-xs",
      sm: "fri-button-sm",
      md: "fri-button-md",
      lg: "fri-button-lg",
      xl: "fri-button-xl",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
