"use client";

import { ScrollArea as RadixScrollArea } from "radix-ui";

import {
  scrollAreaVariants,
  scrollAreaViewportVariants,
  scrollAreaScrollbarVariants,
  scrollAreaThumbVariants,
  scrollAreaCornerVariants,
} from "./scroll-area.styles";

import type {
  ScrollAreaCornerProps,
  ScrollAreaRootProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
} from "./scroll-area.types";

const ScrollAreaRoot = (props: Readonly<ScrollAreaRootProps>) => {
  const { className, size, variant, ...rest } = props;

  const rootClassName = scrollAreaVariants({ size, variant, class: className });
  const radixType = variant === "hidden" ? "scroll" : variant;

  return (
    <RadixScrollArea.Root
      data-slot="scroll-area"
      type={radixType}
      className={rootClassName}
      {...rest}
    />
  );
};

const ScrollAreaViewport = (props: Readonly<ScrollAreaViewportProps>) => {
  const { className, ...rest } = props;

  const viewportClassName = scrollAreaViewportVariants({ class: className });

  return (
    <RadixScrollArea.Viewport
      data-slot="scroll-area-viewport"
      className={viewportClassName}
      {...rest}
    />
  );
};

const ScrollAreaScrollbar = (props: Readonly<ScrollAreaScrollbarProps>) => {
  const { className, ...rest } = props;

  const scrollbarClassName = scrollAreaScrollbarVariants({ class: className });

  return (
    <RadixScrollArea.Scrollbar
      data-slot="scroll-area-scrollbar"
      className={scrollbarClassName}
      {...rest}
    />
  );
};

const ScrollAreaThumb = (props: Readonly<ScrollAreaThumbProps>) => {
  const { className, ...rest } = props;

  const thumbClassName = scrollAreaThumbVariants({ class: className });

  return (
    <RadixScrollArea.Thumb
      data-slot="scroll-area-thumb"
      className={thumbClassName}
      {...rest}
    />
  );
};

const ScrollAreaCorner = (props: Readonly<ScrollAreaCornerProps>) => {
  const { className, ...rest } = props;

  const cornerClassName = scrollAreaCornerVariants({ class: className });

  return (
    <RadixScrollArea.Corner
      data-slot="scroll-area-corner"
      className={cornerClassName}
      {...rest}
    />
  );
};

export {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
};
