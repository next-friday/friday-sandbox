import { cva } from "class-variance-authority";

import type { StrictVariantProps } from "../../utils/variant-props";

export const scrollAreaVariants = cva("fri-scroll-area", {
  variants: {
    size: {
      xs: "fri-scroll-area-xs",
      sm: "fri-scroll-area-sm",
      md: "fri-scroll-area-md",
      lg: "fri-scroll-area-lg",
    },
    variant: {
      hover: "",
      always: "",
      hidden: "fri-scroll-area-hide-scrollbar",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "hover",
  },
});

export const scrollAreaViewportVariants = cva("fri-scroll-area-viewport");

export const scrollAreaScrollbarVariants = cva("fri-scroll-area-scrollbar");

export const scrollAreaThumbVariants = cva("fri-scroll-area-thumb");

export const scrollAreaCornerVariants = cva("fri-scroll-area-corner");

export type ScrollAreaVariants = StrictVariantProps<typeof scrollAreaVariants>;
