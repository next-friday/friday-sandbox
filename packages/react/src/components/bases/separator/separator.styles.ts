import { cva } from "class-variance-authority";

import type { StrictVariantProps } from "../../utils/variant-props";

export const separatorVariants = cva("fri-separator", {
  variants: {
    orientation: {
      horizontal: "fri-separator-horizontal",
      vertical: "fri-separator-vertical",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type SeparatorVariants = StrictVariantProps<typeof separatorVariants>;
