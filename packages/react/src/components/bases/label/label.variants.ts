import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const labelVariants = tv({
  base: "fri-label",
  variants: {},
  defaultVariants: {},
});

export type LabelVariants = VariantProps<typeof labelVariants>;
