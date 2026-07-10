import { cva } from "class-variance-authority";

import type { StrictVariantProps } from "../../utils/variant-props";

export const textVariants = cva("fri-text", {
  variants: {
    variant: {
      inherit: "fri-text-inherit",
      "display-xxl": "fri-text-display-xxl",
      "display-xl": "fri-text-display-xl",
      "display-lg": "fri-text-display-lg",
      "display-md": "fri-text-display-md",
      "display-sm": "fri-text-display-sm",
      "body-lg": "fri-text-body-lg",
      "body-lg-strong": "fri-text-body-lg-strong",
      "body-md": "fri-text-body-md",
      "body-md-strong": "fri-text-body-md-strong",
      "body-sm": "fri-text-body-sm",
      "body-sm-strong": "fri-text-body-sm-strong",
      "body-xs": "fri-text-body-xs",
      "body-xs-strong": "fri-text-body-xs-strong",
      "label-lg": "fri-text-label-lg",
      "label-md": "fri-text-label-md",
      "label-sm": "fri-text-label-sm",
      caption: "fri-text-caption",
      "caption-strong": "fri-text-caption-strong",
      code: "fri-text-code",
    },
    color: {
      inherit: "",
      ink: "fri-text-ink",
      body: "fri-text-body",
      muted: "fri-text-muted",
      danger: "fri-text-danger",
    },
    align: {
      left: "fri-text-align-left",
      center: "fri-text-align-center",
      right: "fri-text-align-right",
      justify: "fri-text-align-justify",
    },
    truncate: {
      true: "fri-text-truncate",
    },
    lineClamp: {
      1: "fri-text-clamp-1",
      2: "fri-text-clamp-2",
      3: "fri-text-clamp-3",
      4: "fri-text-clamp-4",
      5: "fri-text-clamp-5",
      6: "fri-text-clamp-6",
    },
    underline: {
      true: "fri-text-underline",
    },
  },
  defaultVariants: {
    variant: "inherit",
    color: "inherit",
  },
});

export type TextVariants = StrictVariantProps<typeof textVariants>;
