import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const textVariants = tv({
  slots: {
    root: "fri-text",
  },
  variants: {
    truncate: {
      true: { root: "truncate" },
    },
    lineClamp: {
      1: { root: "line-clamp-1" },
      2: { root: "line-clamp-2" },
      3: { root: "line-clamp-3" },
      4: { root: "line-clamp-4" },
      5: { root: "line-clamp-5" },
      6: { root: "line-clamp-6" },
    },
  },
});

export type TextVariants = VariantProps<typeof textVariants>;
