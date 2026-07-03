import { ScrollArea as RadixScrollArea } from "radix-ui";
import type { ComponentPropsWithRef } from "react";

import type { ScrollAreaVariants } from "./scroll-area.styles";

type RadixScrollAreaRootProps = ComponentPropsWithRef<
  typeof RadixScrollArea.Root
>;

export type ScrollAreaVariant = "hover" | "always" | "hidden";

export interface ScrollAreaRootProps
  extends Omit<RadixScrollAreaRootProps, "type">, ScrollAreaVariants {
  className?: string;
}

export interface ScrollAreaViewportProps extends ComponentPropsWithRef<
  typeof RadixScrollArea.Viewport
> {
  className?: string;
}

export interface ScrollAreaScrollbarProps extends ComponentPropsWithRef<
  typeof RadixScrollArea.Scrollbar
> {
  className?: string;
}

export interface ScrollAreaThumbProps extends ComponentPropsWithRef<
  typeof RadixScrollArea.Thumb
> {
  className?: string;
}

export interface ScrollAreaCornerProps extends ComponentPropsWithRef<
  typeof RadixScrollArea.Corner
> {
  className?: string;
}
