import type { ElementType, ReactElement } from "react";

import type { PolymorphicProps } from "../../utils/polymorphic-props";

import { gridVariants, gridItemVariants } from "./grid.styles";

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
    p,
    pb,
    pl,
    pr,
    pt,
    px,
    py,
    ref,
    rows,
    ...rest
  } = props;

  const Component: ElementType = as ?? "div";

  const gridClassName = gridVariants({
    cols,
    rows,
    flow,
    inline,
    autoRows,
    autoCols,
    gap,
    gapX,
    gapY,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    class: className,
  });

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
    p,
    pb,
    pl,
    pr,
    pt,
    px,
    py,
    ref,
    rowEnd,
    rowSpan,
    rowStart,
    ...rest
  } = props;

  const Component: ElementType = as ?? "div";

  const itemClassName = gridItemVariants({
    colSpan,
    rowSpan,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    class: className,
  });

  return (
    <Component
      data-slot="grid-item"
      ref={ref}
      className={itemClassName}
      {...rest}
    />
  );
};
