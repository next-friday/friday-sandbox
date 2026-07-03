import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const spinnerVariants = tv({
  slots: {
    root: "fri-spinner",
  },
  variants: {
    color: {
      primary: { root: "fri-spinner-primary" },
      accent: { root: "fri-spinner-accent" },
      info: { root: "fri-spinner-info" },
      success: { root: "fri-spinner-success" },
      warning: { root: "fri-spinner-warning" },
      danger: { root: "fri-spinner-danger" },
    },
    size: {
      xs: { root: "fri-spinner-xs" },
      sm: { root: "fri-spinner-sm" },
      md: { root: "fri-spinner-md" },
      lg: { root: "fri-spinner-lg" },
      xl: { root: "fri-spinner-xl" },
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
