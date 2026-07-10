import { cva } from "class-variance-authority";

import { gapVariants, paddingVariants } from "../../utils/spacing-variants";

import type { StrictVariantProps } from "../../utils/variant-props";

export const gridVariants = cva("fri-grid", {
  variants: {
    cols: {
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
      "auto-fit": "fri-grid-cols-auto-fit",
      "auto-fill": "fri-grid-cols-auto-fill",
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
    inline: {
      true: "fri-grid-inline",
    },
    autoRows: {
      auto: "fri-grid-auto-rows-auto",
      min: "fri-grid-auto-rows-min",
      max: "fri-grid-auto-rows-max",
      fr: "fri-grid-auto-rows-fr",
    },
    autoCols: {
      auto: "fri-grid-auto-cols-auto",
      min: "fri-grid-auto-cols-min",
      max: "fri-grid-auto-cols-max",
      fr: "fri-grid-auto-cols-fr",
    },
    ...gapVariants,
    ...paddingVariants,
  },
  defaultVariants: {
    cols: 1,
    flow: "row",
  },
});

export const gridItemVariants = cva("fri-grid-item", {
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
      full: "fri-grid-item-col-span-full",
    },
    rowSpan: {
      1: "fri-grid-item-row-span-1",
      2: "fri-grid-item-row-span-2",
      3: "fri-grid-item-row-span-3",
      4: "fri-grid-item-row-span-4",
      5: "fri-grid-item-row-span-5",
      6: "fri-grid-item-row-span-6",
    },
    colStart: {
      1: "fri-grid-item-col-start-1",
      2: "fri-grid-item-col-start-2",
      3: "fri-grid-item-col-start-3",
      4: "fri-grid-item-col-start-4",
      5: "fri-grid-item-col-start-5",
      6: "fri-grid-item-col-start-6",
      7: "fri-grid-item-col-start-7",
      8: "fri-grid-item-col-start-8",
      9: "fri-grid-item-col-start-9",
      10: "fri-grid-item-col-start-10",
      11: "fri-grid-item-col-start-11",
      12: "fri-grid-item-col-start-12",
      13: "fri-grid-item-col-start-13",
    },
    colEnd: {
      1: "fri-grid-item-col-end-1",
      2: "fri-grid-item-col-end-2",
      3: "fri-grid-item-col-end-3",
      4: "fri-grid-item-col-end-4",
      5: "fri-grid-item-col-end-5",
      6: "fri-grid-item-col-end-6",
      7: "fri-grid-item-col-end-7",
      8: "fri-grid-item-col-end-8",
      9: "fri-grid-item-col-end-9",
      10: "fri-grid-item-col-end-10",
      11: "fri-grid-item-col-end-11",
      12: "fri-grid-item-col-end-12",
      13: "fri-grid-item-col-end-13",
    },
    rowStart: {
      1: "fri-grid-item-row-start-1",
      2: "fri-grid-item-row-start-2",
      3: "fri-grid-item-row-start-3",
      4: "fri-grid-item-row-start-4",
      5: "fri-grid-item-row-start-5",
      6: "fri-grid-item-row-start-6",
      7: "fri-grid-item-row-start-7",
    },
    rowEnd: {
      1: "fri-grid-item-row-end-1",
      2: "fri-grid-item-row-end-2",
      3: "fri-grid-item-row-end-3",
      4: "fri-grid-item-row-end-4",
      5: "fri-grid-item-row-end-5",
      6: "fri-grid-item-row-end-6",
      7: "fri-grid-item-row-end-7",
    },
    ...paddingVariants,
  },
});

export type GridVariants = StrictVariantProps<typeof gridVariants>;
export type GridItemVariants = StrictVariantProps<typeof gridItemVariants>;
