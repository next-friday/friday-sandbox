import { ScrollArea as RadixScrollArea } from "radix-ui";
import { type ComponentPropsWithoutRef } from "react";

import { type ScrollAreaVariants } from "./scroll-area.styles";

export type RadixScrollAreaRootProps = ComponentPropsWithoutRef<
  typeof RadixScrollArea.Root
>;

export type ScrollAreaVariant = "hover" | "always";

export interface ScrollAreaRootProps
  extends Omit<RadixScrollAreaRootProps, "type">, ScrollAreaVariants {
  className?: string;
  variant?: "hover" | "always";
}

export interface ScrollAreaViewportProps extends ComponentPropsWithoutRef<
  typeof RadixScrollArea.Viewport
> {
  className?: string;
}

export interface ScrollAreaContentProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export interface ScrollAreaScrollbarProps extends ComponentPropsWithoutRef<
  typeof RadixScrollArea.Scrollbar
> {
  className?: string;
}

export interface ScrollAreaThumbProps extends ComponentPropsWithoutRef<
  typeof RadixScrollArea.Thumb
> {
  className?: string;
}

export interface ScrollAreaCornerProps extends ComponentPropsWithoutRef<
  typeof RadixScrollArea.Corner
> {
  className?: string;
}
