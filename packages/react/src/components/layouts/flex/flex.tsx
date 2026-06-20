import { Slot } from "radix-ui";

import type { ComponentPropsWithRef } from "react";

import { flexVariants } from "./flex.variants";
import type { FlexVariants } from "./flex.variants";

export interface FlexProps extends ComponentPropsWithRef<"div">, FlexVariants {
  asChild?: boolean;
  className?: string;
}

export const Flex = (props: Readonly<FlexProps>) => {
  const {
    align,
    asChild,
    basis,
    className,
    direction,
    gap,
    gapX,
    gapY,
    grow,
    inline,
    justify,
    shrink,
    wrap,
    ...rest
  } = props;

  const resolvedClassName = flexVariants({
    direction,
    align,
    justify,
    wrap,
    inline,
    grow,
    shrink,
    basis,
    gap,
    gapX,
    gapY,
    className,
  });

  const Component = asChild ? Slot.Root : "div";

  return <Component data-slot="flex" className={resolvedClassName} {...rest} />;
};
