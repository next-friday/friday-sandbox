import { tv } from "tailwind-variants/lite";
import type { VariantProps } from "tailwind-variants/lite";

export const avatarVariants = tv({
  slots: {
    root: "fri-avatar",
    image: "fri-avatar-image",
    fallback: "fri-avatar-fallback",
  },
  variants: {
    size: {
      xs: { root: "fri-avatar-xs" },
      sm: { root: "fri-avatar-sm" },
      md: { root: "fri-avatar-md" },
      lg: { root: "fri-avatar-lg" },
      xl: { root: "fri-avatar-xl" },
      "2xl": { root: "fri-avatar-2xl" },
    },
    shape: {
      square: { root: "fri-avatar-square" },
      radius: { root: "fri-avatar-radius" },
      full: { root: "fri-avatar-full" },
    },
    isDisabled: {
      true: { root: "fri-avatar-disabled" },
    },
  },
  defaultVariants: {
    shape: "full",
  },
});

export const avatarGroupVariants = tv({
  base: "fri-avatar-group",
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

export type AvatarVariants = VariantProps<typeof avatarVariants>;
export type AvatarGroupVariants = VariantProps<typeof avatarGroupVariants>;
