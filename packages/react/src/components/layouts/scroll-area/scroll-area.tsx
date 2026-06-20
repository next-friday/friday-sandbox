"use client";

import { ScrollArea as RadixScrollArea } from "radix-ui";

import { scrollAreaVariants } from "./scroll-area.variants";
import {
  type ScrollAreaContentProps,
  type ScrollAreaCornerProps,
  type ScrollAreaRootProps,
  type ScrollAreaScrollbarProps,
  type ScrollAreaThumbProps,
  type ScrollAreaViewportProps,
} from "./scroll-area.types";

const ScrollAreaRoot = (props: Readonly<ScrollAreaRootProps>) => {
  const { variant = "hover", className, size, ...rest } = props;
  const slots = scrollAreaVariants({ size });
  const rootClassName = slots.root({ class: className });

  return (
    <RadixScrollArea.Root
      data-slot="scroll-area"
      type={variant}
      className={rootClassName}
      {...rest}
    />
  );
};

const ScrollAreaViewport = (props: Readonly<ScrollAreaViewportProps>) => {
  const { className, ...rest } = props;
  const slots = scrollAreaVariants();
  const viewportClassName = slots.viewport({ class: className });

  return (
    <RadixScrollArea.Viewport
      data-slot="scroll-area-viewport"
      className={viewportClassName}
      {...rest}
    />
  );
};

const ScrollAreaContent = (props: Readonly<ScrollAreaContentProps>) => {
  const { className, ...rest } = props;
  const slots = scrollAreaVariants();
  const contentClassName = slots.content({ class: className });

  return (
    <div
      data-slot="scroll-area-content"
      className={contentClassName}
      {...rest}
    />
  );
};

const ScrollAreaScrollbar = (props: Readonly<ScrollAreaScrollbarProps>) => {
  const { className, ...rest } = props;
  const slots = scrollAreaVariants();
  const scrollbarClassName = slots.scrollbar({ class: className });

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
  const slots = scrollAreaVariants();
  const thumbClassName = slots.thumb({ class: className });

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
  const slots = scrollAreaVariants();
  const cornerClassName = slots.corner({ class: className });

  return (
    <RadixScrollArea.Corner
      data-slot="scroll-area-corner"
      className={cornerClassName}
      {...rest}
    />
  );
};

export {
  ScrollAreaCorner,
  ScrollAreaContent,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
};
