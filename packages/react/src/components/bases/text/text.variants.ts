import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const textVariants = tv({
  slots: {
    root: "fri-text",
  },
  variants: {
    variant: {
      "display-xl": { root: "fri-text-display-xl" },
      "display-lg": { root: "fri-text-display-lg" },
      "display-md": { root: "fri-text-display-md" },
      "display-sm": { root: "fri-text-display-sm" },
      "title-lg": { root: "fri-text-title-lg" },
      "title-md": { root: "fri-text-title-md" },
      "title-sm": { root: "fri-text-title-sm" },
      "body-lg": { root: "fri-text-body-lg" },
      "body-md": { root: "fri-text-body-md" },
      "body-sm": { root: "fri-text-body-sm" },
      "body-lg-strong": { root: "fri-text-body-lg-strong" },
      "body-md-strong": { root: "fri-text-body-md-strong" },
      "body-sm-strong": { root: "fri-text-body-sm-strong" },
      "label-lg": { root: "fri-text-label-lg" },
      "label-md": { root: "fri-text-label-md" },
      "label-sm": { root: "fri-text-label-sm" },
      caption: { root: "fri-text-caption" },
      overline: { root: "fri-text-overline" },
    },
    color: {
      foreground: { root: "fri-text-foreground" },
      muted: { root: "fri-text-muted" },
      placeholder: { root: "fri-text-placeholder" },
      nav: { root: "fri-text-nav" },
      link: { root: "fri-text-link" },
      inherit: { root: "fri-text-inherit" },
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
  },
  defaultVariants: {
    variant: "body-md",
    color: "foreground",
  },
});

export type TextVariants = VariantProps<typeof textVariants>;
