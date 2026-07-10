"use client";

import { Avatar as RadixAvatar } from "radix-ui";

import {
  avatarVariants,
  avatarImageVariants,
  avatarFallbackVariants,
  avatarGroupVariants,
} from "./avatar.styles";
import type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
} from "./avatar.types";

export const Avatar = (props: Readonly<AvatarProps>) => {
  const { children, className, isDisabled, shape, size, ...rest } = props;

  const rootClassName = avatarVariants({
    size,
    shape,
    isDisabled,
    class: className,
  });

  return (
    <RadixAvatar.Root data-slot="avatar" className={rootClassName} {...rest}>
      {children}
    </RadixAvatar.Root>
  );
};

export const AvatarImage = (props: Readonly<AvatarImageProps>) => {
  const { className, ...rest } = props;

  const imageClassName = avatarImageVariants({ class: className });

  return (
    <RadixAvatar.Image
      data-slot="avatar-image"
      className={imageClassName}
      {...rest}
    />
  );
};

export const AvatarFallback = (props: Readonly<AvatarFallbackProps>) => {
  const { className, ...rest } = props;

  const fallbackClassName = avatarFallbackVariants({ class: className });

  return (
    <RadixAvatar.Fallback
      data-slot="avatar-fallback"
      className={fallbackClassName}
      {...rest}
    />
  );
};

export const AvatarGroup = (props: Readonly<AvatarGroupProps>) => {
  const { children, className, ring, size, stacking, ...rest } = props;

  const groupClassName = avatarGroupVariants({
    size,
    ring,
    stacking,
    class: className,
  });

  return (
    <div data-slot="avatar-group" className={groupClassName} {...rest}>
      {children}
    </div>
  );
};
