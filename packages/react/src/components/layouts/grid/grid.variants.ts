import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const gridVariants = tv({
  slots: {
    grid: "fri-grid",
    item: "fri-grid-item",
  },
  variants: {
    cols: {
      1: { grid: "fri-grid-cols-1" },
      2: { grid: "fri-grid-cols-2" },
      3: { grid: "fri-grid-cols-3" },
      4: { grid: "fri-grid-cols-4" },
      5: { grid: "fri-grid-cols-5" },
      6: { grid: "fri-grid-cols-6" },
      7: { grid: "fri-grid-cols-7" },
      8: { grid: "fri-grid-cols-8" },
      9: { grid: "fri-grid-cols-9" },
      10: { grid: "fri-grid-cols-10" },
      11: { grid: "fri-grid-cols-11" },
      12: { grid: "fri-grid-cols-12" },
    },
    rows: {
      1: { grid: "fri-grid-rows-1" },
      2: { grid: "fri-grid-rows-2" },
      3: { grid: "fri-grid-rows-3" },
      4: { grid: "fri-grid-rows-4" },
      5: { grid: "fri-grid-rows-5" },
      6: { grid: "fri-grid-rows-6" },
    },
    flow: {
      row: { grid: "fri-grid-flow-row" },
      col: { grid: "fri-grid-flow-col" },
      "row-dense": { grid: "fri-grid-flow-row-dense" },
      "col-dense": { grid: "fri-grid-flow-col-dense" },
    },
    gap: {
      xs: { grid: "fri-grid-gap-xs" },
      sm: { grid: "fri-grid-gap-sm" },
      md: { grid: "fri-grid-gap-md" },
      lg: { grid: "fri-grid-gap-lg" },
      xl: { grid: "fri-grid-gap-xl" },
    },
    gapX: {
      xs: { grid: "fri-grid-gap-x-xs" },
      sm: { grid: "fri-grid-gap-x-sm" },
      md: { grid: "fri-grid-gap-x-md" },
      lg: { grid: "fri-grid-gap-x-lg" },
      xl: { grid: "fri-grid-gap-x-xl" },
    },
    gapY: {
      xs: { grid: "fri-grid-gap-y-xs" },
      sm: { grid: "fri-grid-gap-y-sm" },
      md: { grid: "fri-grid-gap-y-md" },
      lg: { grid: "fri-grid-gap-y-lg" },
      xl: { grid: "fri-grid-gap-y-xl" },
    },
    colSpan: {
      1: { item: "fri-grid-item-col-span-1" },
      2: { item: "fri-grid-item-col-span-2" },
      3: { item: "fri-grid-item-col-span-3" },
      4: { item: "fri-grid-item-col-span-4" },
      5: { item: "fri-grid-item-col-span-5" },
      6: { item: "fri-grid-item-col-span-6" },
      7: { item: "fri-grid-item-col-span-7" },
      8: { item: "fri-grid-item-col-span-8" },
      9: { item: "fri-grid-item-col-span-9" },
      10: { item: "fri-grid-item-col-span-10" },
      11: { item: "fri-grid-item-col-span-11" },
      12: { item: "fri-grid-item-col-span-12" },
    },
    rowSpan: {
      1: { item: "fri-grid-item-row-span-1" },
      2: { item: "fri-grid-item-row-span-2" },
      3: { item: "fri-grid-item-row-span-3" },
      4: { item: "fri-grid-item-row-span-4" },
      5: { item: "fri-grid-item-row-span-5" },
      6: { item: "fri-grid-item-row-span-6" },
    },
  },
  defaultVariants: {
    cols: 1,
    flow: "row",
  },
});

type GridSlotVariants = VariantProps<typeof gridVariants>;

export type GridVariants = Pick<
  GridSlotVariants,
  "cols" | "rows" | "flow" | "gap" | "gapX" | "gapY"
>;
export type GridItemVariants = Pick<GridSlotVariants, "colSpan" | "rowSpan">;
