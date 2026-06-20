import { Slot } from "radix-ui";

import type { ComponentPropsWithRef } from "react";

import { gridVariants } from "./grid.variants";
import type { GridVariants, GridItemVariants } from "./grid.variants";

export interface GridProps extends ComponentPropsWithRef<"div">, GridVariants {
  asChild?: boolean;
  className?: string;
}

export const Grid = (props: Readonly<GridProps>) => {
  const {
    asChild,
    autoCols,
    autoRows,
    className,
    cols,
    flow,
    gap,
    gapX,
    gapY,
    inline,
    rows,
    ...rest
  } = props;

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

  const Component = asChild ? Slot.Root : "div";

  return <Component data-slot="grid" className={gridClassName} {...rest} />;
};

export interface GridItemProps
  extends ComponentPropsWithRef<"div">, GridItemVariants {
  asChild?: boolean;
  className?: string;
}

export const GridItem = (props: Readonly<GridItemProps>) => {
  const {
    asChild,
    className,
    colEnd,
    colSpan,
    colStart,
    rowEnd,
    rowSpan,
    rowStart,
    ...rest
  } = props;

  const slots = gridVariants({
    colSpan,
    rowSpan,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
  });
  const itemClassName = slots.item({ class: className });

  const Component = asChild ? Slot.Root : "div";

  return (
    <Component data-slot="grid-item" className={itemClassName} {...rest} />
  );
};
