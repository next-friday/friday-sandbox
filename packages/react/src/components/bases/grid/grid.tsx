import type { ElementType, ReactElement } from "react";

import type { PolymorphicProps } from "../../utils/polymorphic-props";

import { gridVariants } from "./grid.styles";

import type { GridVariants, GridItemVariants } from "./grid.styles";

export type GridProps<TElement extends ElementType = "div"> = PolymorphicProps<
  GridVariants & {
    className?: string;
  },
  TElement
>;

export const Grid = <TElement extends ElementType = "div">(
  props: Readonly<GridProps<TElement>>,
): ReactElement => {
  const {
    as,
    autoCols,
    autoRows,
    className,
    cols,
    flow,
    gap,
    gapX,
    gapY,
    inline,
    ref,
    rows,
    ...rest
  } = props;

  const Component: ElementType = as ?? "div";

  const slots = gridVariants({
    cols,
    rows,
    flow,
    inline,
    autoRows,
    autoCols,
    gap,
    gapX,
    gapY,
  });
  const gridClassName = slots.grid({ class: className });

  return (
    <Component data-slot="grid" ref={ref} className={gridClassName} {...rest} />
  );
};

export type GridItemProps<TElement extends ElementType = "div"> =
  PolymorphicProps<
    GridItemVariants & {
      className?: string;
    },
    TElement
  >;

export const GridItem = <TElement extends ElementType = "div">(
  props: Readonly<GridItemProps<TElement>>,
): ReactElement => {
  const {
    as,
    className,
    colEnd,
    colSpan,
    colStart,
    ref,
    rowEnd,
    rowSpan,
    rowStart,
    ...rest
  } = props;

  const Component: ElementType = as ?? "div";

  const slots = gridVariants({
    colSpan,
    rowSpan,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
  });
  const itemClassName = slots.item({ class: className });

  return (
    <Component
      data-slot="grid-item"
      ref={ref}
      className={itemClassName}
      {...rest}
    />
  );
};
