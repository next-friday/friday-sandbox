import { cva } from "class-variance-authority";

import type { StrictVariantProps } from "../../utils/variant-props";

export const inputVariants = cva("fri-input", {
  variants: {
    size: {
      xs: "fri-input-xs",
      sm: "fri-input-sm",
      md: "fri-input-md",
      lg: "fri-input-lg",
      xl: "fri-input-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type InputVariants = StrictVariantProps<typeof inputVariants>;
