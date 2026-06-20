import type { ElementType, ReactElement } from "react";

import type { PolymorphicProps } from "../../utils/polymorphic-props";

import { flexVariants } from "./flex.variants";
import type { FlexVariants } from "./flex.variants";

export type FlexProps<TElement extends ElementType = "div"> = PolymorphicProps<
  FlexVariants & {
    className?: string;
  },
  TElement
>;

export const Flex = <TElement extends ElementType = "div">(
  props: Readonly<FlexProps<TElement>>,
): ReactElement => {
  const {
    align,
    as,
    basis,
    className,
    direction,
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
    gap,
    gapX,
    gapY,
    className,
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
