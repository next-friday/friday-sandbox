import { tv, type VariantProps } from "tailwind-variants/lite";

export const gridItemVariants = tv({
  base: "fri-grid-item",
  variants: {
    colSpan: {
      1: "fri-grid-item-col-span-1",
      2: "fri-grid-item-col-span-2",
      3: "fri-grid-item-col-span-3",
      4: "fri-grid-item-col-span-4",
      5: "fri-grid-item-col-span-5",
      6: "fri-grid-item-col-span-6",
      7: "fri-grid-item-col-span-7",
      8: "fri-grid-item-col-span-8",
      9: "fri-grid-item-col-span-9",
      10: "fri-grid-item-col-span-10",
      11: "fri-grid-item-col-span-11",
      12: "fri-grid-item-col-span-12",
    },
    rowSpan: {
      1: "fri-grid-item-row-span-1",
      2: "fri-grid-item-row-span-2",
      3: "fri-grid-item-row-span-3",
      4: "fri-grid-item-row-span-4",
      5: "fri-grid-item-row-span-5",
      6: "fri-grid-item-row-span-6",
    },
  },
});

export type GridItemVariants = VariantProps<typeof gridItemVariants>;
