import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const flexVariants = tv({
  base: "fri-flex",
  variants: {
    direction: {
      row: "fri-flex-row",
      column: "fri-flex-column",
      "row-reverse": "fri-flex-row-reverse",
      "column-reverse": "fri-flex-column-reverse",
    },
    align: {
      start: "fri-flex-align-start",
      center: "fri-flex-align-center",
      end: "fri-flex-align-end",
      stretch: "fri-flex-align-stretch",
      baseline: "fri-flex-align-baseline",
    },
    justify: {
      start: "fri-flex-justify-start",
      center: "fri-flex-justify-center",
      end: "fri-flex-justify-end",
      between: "fri-flex-justify-between",
      around: "fri-flex-justify-around",
      evenly: "fri-flex-justify-evenly",
    },
    wrap: {
      nowrap: "fri-flex-nowrap",
      wrap: "fri-flex-wrap",
      "wrap-reverse": "fri-flex-wrap-reverse",
    },
    gap: {
      xs: "fri-flex-gap-xs",
      sm: "fri-flex-gap-sm",
      md: "fri-flex-gap-md",
      lg: "fri-flex-gap-lg",
      xl: "fri-flex-gap-xl",
    },
    gapX: {
      xs: "fri-flex-gap-x-xs",
      sm: "fri-flex-gap-x-sm",
      md: "fri-flex-gap-x-md",
      lg: "fri-flex-gap-x-lg",
      xl: "fri-flex-gap-x-xl",
    },
    gapY: {
      xs: "fri-flex-gap-y-xs",
      sm: "fri-flex-gap-y-sm",
      md: "fri-flex-gap-y-md",
      lg: "fri-flex-gap-y-lg",
      xl: "fri-flex-gap-y-xl",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
  },
});

export type FlexVariants = VariantProps<typeof flexVariants>;
