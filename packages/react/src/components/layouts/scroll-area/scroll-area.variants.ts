import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const scrollAreaVariants = tv({
  slots: {
    root: "fri-scroll-area",
    viewport: "fri-scroll-area-viewport",
    content: "fri-scroll-area-content",
    scrollbar: "fri-scroll-area-scrollbar",
    thumb: "fri-scroll-area-thumb",
    corner: "fri-scroll-area-corner",
  },
  variants: {
    size: {
      xs: { root: "fri-scroll-area-xs" },
      sm: { root: "fri-scroll-area-sm" },
      md: { root: "fri-scroll-area-md" },
      lg: { root: "fri-scroll-area-lg" },
    },
    variant: {
      hover: {},
      always: {},
      hidden: { root: "fri-scroll-area-hide-scrollbar" },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "hover",
  },
});

export type ScrollAreaVariants = VariantProps<typeof scrollAreaVariants>;
