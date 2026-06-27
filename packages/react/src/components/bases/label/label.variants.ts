import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const labelVariants = tv({
  base: "fri-label",
  variants: {
    isRequired: {
      true: "fri-label-required",
    },
    isDisabled: {
      true: "fri-label-disabled",
    },
    isInvalid: {
      true: "fri-label-invalid",
    },
  },
  defaultVariants: {
    isRequired: false,
    isDisabled: false,
    isInvalid: false,
  },
});

export type LabelVariants = VariantProps<typeof labelVariants>;
