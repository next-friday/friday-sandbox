import type { ComponentPropsWithRef } from "react";

import { flexVariants } from "./flex.variants";
import type { FlexVariants } from "./flex.variants";

export interface FlexProps extends ComponentPropsWithRef<"div">, FlexVariants {
  className?: string;
}

export const Flex = (props: Readonly<FlexProps>) => {
  const {
    align,
    className,
    direction,
    gap,
    gapX,
    gapY,
    justify,
    wrap,
    ...rest
  } = props;

  const resolvedClassName = flexVariants({
    direction,
    align,
    justify,
    wrap,
    gap,
    gapX,
    gapY,
    className,
  });

  return <div data-slot="flex" className={resolvedClassName} {...rest} />;
};
