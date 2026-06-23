import type { ComponentPropsWithRef, ElementType } from "react";

export type PolymorphicProps<
  TOwnProps,
  TElement extends ElementType = "div",
> = TOwnProps &
  Omit<ComponentPropsWithRef<TElement>, keyof TOwnProps | "as"> & {
    as?: TElement;
  };
