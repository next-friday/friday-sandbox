import { Avatar as RadixAvatar } from "radix-ui";
import type { ComponentPropsWithRef } from "react";

import type { AvatarVariants, AvatarGroupVariants } from "./avatar.styles";

export interface AvatarProps
  extends ComponentPropsWithRef<typeof RadixAvatar.Root>, AvatarVariants {
  className?: string;
}

export interface AvatarImageProps extends ComponentPropsWithRef<
  typeof RadixAvatar.Image
> {
  alt: string;
  className?: string;
}

export interface AvatarFallbackProps extends ComponentPropsWithRef<
  typeof RadixAvatar.Fallback
> {
  className?: string;
}

export interface AvatarGroupProps
  extends ComponentPropsWithRef<"div">, AvatarGroupVariants {
  className?: string;
}
