import { cva } from "class-variance-authority";

import { gapVariants, paddingVariants } from "../../utils/spacing-variants";

import type { StrictVariantProps } from "../../utils/variant-props";

export const flexVariants = cva("fri-flex", {
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
    inline: {
      true: "fri-flex-inline",
    },
    grow: {
      true: "fri-flex-grow",
      false: "fri-flex-grow-0",
    },
    shrink: {
      true: "fri-flex-shrink",
      false: "fri-flex-shrink-0",
    },
    basis: {
      auto: "fri-flex-basis-auto",
      full: "fri-flex-basis-full",
      0: "fri-flex-basis-0",
    },
    flex: {
      1: "fri-flex-1",
      auto: "fri-flex-auto",
      initial: "fri-flex-initial",
      none: "fri-flex-none",
    },
    ...gapVariants,
    ...paddingVariants,
  },
  defaultVariants: {
    direction: "row",
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
  },
});

export type FlexVariants = StrictVariantProps<typeof flexVariants>;
