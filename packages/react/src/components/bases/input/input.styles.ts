import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const inputVariants = tv({
  base: "fri-input",
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

export type InputVariants = VariantProps<typeof inputVariants>;
