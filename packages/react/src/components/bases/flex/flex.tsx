import { flexVariants } from "@friday-sandbox/styles/components/flex";

import type { ElementType, ReactElement } from "react";

import type { FlexProps } from "./flex.types";

export const Flex = <TElement extends ElementType = "div">(
  props: Readonly<FlexProps<TElement>>,
): ReactElement => {
  const {
    align,
    as,
    basis,
    className,
    direction,
    flex,
    gap,
    gapX,
    gapY,
    grow,
    inline,
    justify,
    ref,
    shrink,
    wrap,
    ...rest
  } = props;

  const Component: ElementType = as ?? "div";

  const resolvedClassName = flexVariants({
    direction,
    align,
    justify,
    wrap,
    inline,
    grow,
    shrink,
    basis,
    flex,
    gap,
    gapX,
    gapY,
    class: className,
  });

  return (
    <Component
      data-slot="flex"
      ref={ref}
      className={resolvedClassName}
      {...rest}
    />
  );
};
