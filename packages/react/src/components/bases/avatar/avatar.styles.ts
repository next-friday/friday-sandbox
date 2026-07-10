import { cva } from "class-variance-authority";

import type { StrictVariantProps } from "../../utils/variant-props";

export const avatarVariants = cva("fri-avatar", {
  variants: {
    size: {
      xs: "fri-avatar-xs",
      sm: "fri-avatar-sm",
      md: "fri-avatar-md",
      lg: "fri-avatar-lg",
      xl: "fri-avatar-xl",
      "2xl": "fri-avatar-2xl",
    },
    shape: {
      square: "fri-avatar-square",
      radius: "fri-avatar-radius",
      full: "fri-avatar-full",
    },
    isDisabled: {
      true: "fri-avatar-disabled",
    },
  },
  defaultVariants: {
    shape: "full",
  },
});

export const avatarImageVariants = cva("fri-avatar-image");

export const avatarFallbackVariants = cva("fri-avatar-fallback");

export const avatarGroupVariants = cva("fri-avatar-group", {
  variants: {
    size: {
      xs: "fri-avatar-group-xs",
      sm: "fri-avatar-group-sm",
      md: "fri-avatar-group-md",
      lg: "fri-avatar-group-lg",
      xl: "fri-avatar-group-xl",
      "2xl": "fri-avatar-group-2xl",
    },
    ring: {
      false: "fri-avatar-group-ringless",
    },
    stacking: {
      "first-on-top": "fri-avatar-group-first-on-top",
      "last-on-top": "",
    },
  },
  defaultVariants: {
    size: "md",
    ring: true,
    stacking: "last-on-top",
  },
});

export type AvatarVariants = StrictVariantProps<typeof avatarVariants>;
export type AvatarGroupVariants = StrictVariantProps<
  typeof avatarGroupVariants
>;
