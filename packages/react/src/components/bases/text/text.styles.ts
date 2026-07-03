import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const textVariants = tv({
  slots: {
    root: "fri-text",
  },
  variants: {
    variant: {
      inherit: { root: "fri-text-inherit" },
      "display-xxl": { root: "fri-text-display-xxl" },
      "display-xl": { root: "fri-text-display-xl" },
      "display-lg": { root: "fri-text-display-lg" },
      "display-md": { root: "fri-text-display-md" },
      "display-sm": { root: "fri-text-display-sm" },
      "body-lg": { root: "fri-text-body-lg" },
      "body-lg-strong": { root: "fri-text-body-lg-strong" },
      "body-md": { root: "fri-text-body-md" },
      "body-md-strong": { root: "fri-text-body-md-strong" },
      "body-sm": { root: "fri-text-body-sm" },
      "body-sm-strong": { root: "fri-text-body-sm-strong" },
      "body-xs": { root: "fri-text-body-xs" },
      "body-xs-strong": { root: "fri-text-body-xs-strong" },
      "label-lg": { root: "fri-text-label-lg" },
      "label-md": { root: "fri-text-label-md" },
      "label-sm": { root: "fri-text-label-sm" },
      caption: { root: "fri-text-caption" },
      "caption-strong": { root: "fri-text-caption-strong" },
      code: { root: "fri-text-code" },
    },
    color: {
      inherit: { root: "" },
      ink: { root: "fri-text-ink" },
      body: { root: "fri-text-body" },
      muted: { root: "fri-text-muted" },
      danger: { root: "fri-text-danger" },
    },
    align: {
      left: { root: "text-left" },
      center: { root: "text-center" },
      right: { root: "text-right" },
      justify: { root: "text-justify" },
    },
    truncate: {
      true: { root: "truncate" },
    },
    lineClamp: {
      1: { root: "line-clamp-1" },
      2: { root: "line-clamp-2" },
      3: { root: "line-clamp-3" },
      4: { root: "line-clamp-4" },
      5: { root: "line-clamp-5" },
      6: { root: "line-clamp-6" },
    },
    underline: {
      true: { root: "underline" },
    },
  },
  defaultVariants: {
    variant: "inherit",
    color: "inherit",
  },
});

export type TextVariants = VariantProps<typeof textVariants>;
