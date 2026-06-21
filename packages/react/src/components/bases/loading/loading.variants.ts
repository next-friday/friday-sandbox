import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const loadingVariants = tv({
  slots: {
    root: "fri-loading",
    indicator: "fri-loading-indicator",
  },
  variants: {
    color: {
      primary: { root: "fri-loading-primary" },
      secondary: { root: "fri-loading-secondary" },
      accent: { root: "fri-loading-accent" },
      info: { root: "fri-loading-info" },
      success: { root: "fri-loading-success" },
      warning: { root: "fri-loading-warning" },
      danger: { root: "fri-loading-danger" },
    },
    size: {
      xs: { root: "fri-loading-xs" },
      sm: { root: "fri-loading-sm" },
      md: { root: "fri-loading-md" },
      lg: { root: "fri-loading-lg" },
      xl: { root: "fri-loading-xl" },
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

export type LoadingVariants = VariantProps<typeof loadingVariants>;
