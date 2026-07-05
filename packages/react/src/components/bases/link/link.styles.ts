import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const linkVariants = tv({
  base: "fri-link",
  variants: {
    variant: {
      inherit: "fri-link-inherit",
      "display-xxl": "fri-link-display-xxl",
      "display-xl": "fri-link-display-xl",
      "display-lg": "fri-link-display-lg",
      "display-md": "fri-link-display-md",
      "display-sm": "fri-link-display-sm",
      "body-lg": "fri-link-body-lg",
      "body-lg-strong": "fri-link-body-lg-strong",
      "body-md": "fri-link-body-md",
      "body-md-strong": "fri-link-body-md-strong",
      "body-sm": "fri-link-body-sm",
      "body-sm-strong": "fri-link-body-sm-strong",
      "body-xs": "fri-link-body-xs",
      "body-xs-strong": "fri-link-body-xs-strong",
      "label-lg": "fri-link-label-lg",
      "label-md": "fri-link-label-md",
      "label-sm": "fri-link-label-sm",
      caption: "fri-link-caption",
      "caption-strong": "fri-link-caption-strong",
      code: "fri-link-code",
    },
    decoration: {
      underline: "fri-link-underline",
      plain: "fri-link-plain",
    },
  },
  defaultVariants: {
    variant: "inherit",
    decoration: "underline",
  },
});

export const linkIconVariants = tv({
  base: "fri-link-icon",
});

export type LinkVariants = VariantProps<typeof linkVariants>;
