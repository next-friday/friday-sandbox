import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const gridVariants = tv({
  base: "fri-grid",
  variants: {
    columns: {
      1: "fri-grid-cols-1",
      2: "fri-grid-cols-2",
      3: "fri-grid-cols-3",
      4: "fri-grid-cols-4",
      5: "fri-grid-cols-5",
      6: "fri-grid-cols-6",
      7: "fri-grid-cols-7",
      8: "fri-grid-cols-8",
      9: "fri-grid-cols-9",
      10: "fri-grid-cols-10",
      11: "fri-grid-cols-11",
      12: "fri-grid-cols-12",
    },
    rows: {
      1: "fri-grid-rows-1",
      2: "fri-grid-rows-2",
      3: "fri-grid-rows-3",
      4: "fri-grid-rows-4",
      5: "fri-grid-rows-5",
      6: "fri-grid-rows-6",
    },
    flow: {
      row: "fri-grid-flow-row",
      col: "fri-grid-flow-col",
      "row-dense": "fri-grid-flow-row-dense",
      "col-dense": "fri-grid-flow-col-dense",
    },
    gap: {
      xs: "fri-grid-gap-xs",
      sm: "fri-grid-gap-sm",
      md: "fri-grid-gap-md",
      lg: "fri-grid-gap-lg",
      xl: "fri-grid-gap-xl",
    },
    gapX: {
      xs: "fri-grid-gap-x-xs",
      sm: "fri-grid-gap-x-sm",
      md: "fri-grid-gap-x-md",
      lg: "fri-grid-gap-x-lg",
      xl: "fri-grid-gap-x-xl",
    },
    gapY: {
      xs: "fri-grid-gap-y-xs",
      sm: "fri-grid-gap-y-sm",
      md: "fri-grid-gap-y-md",
      lg: "fri-grid-gap-y-lg",
      xl: "fri-grid-gap-y-xl",
    },
  },
  defaultVariants: {
    columns: 1,
    flow: "row",
  },
});

export type GridVariants = VariantProps<typeof gridVariants>;
