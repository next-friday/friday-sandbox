import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const separatorVariants = tv({
  slots: {
    root: "fri-separator",
  },
  variants: {
    orientation: {
      horizontal: { root: "fri-separator-horizontal" },
      vertical: { root: "fri-separator-vertical" },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type SeparatorVariants = VariantProps<typeof separatorVariants>;
