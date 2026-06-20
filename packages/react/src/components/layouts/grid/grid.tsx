import type { ComponentPropsWithRef } from "react";

import { gridVariants } from "./grid.variants";
import type { GridVariants, GridItemVariants } from "./grid.variants";

export interface GridProps extends ComponentPropsWithRef<"div">, GridVariants {
  className?: string;
}

export const Grid = (props: Readonly<GridProps>) => {
  const { className, cols, flow, gap, gapX, gapY, rows, ...rest } = props;
  const slots = gridVariants({ cols, rows, flow, gap, gapX, gapY });
  const gridClassName = slots.grid({ class: className });

  return <div data-slot="grid" className={gridClassName} {...rest} />;
};

export interface GridItemProps
  extends ComponentPropsWithRef<"div">, GridItemVariants {
  className?: string;
}

export const GridItem = (props: Readonly<GridItemProps>) => {
  const { className, colSpan, rowSpan, ...rest } = props;
  const slots = gridVariants({ colSpan, rowSpan });
  const itemClassName = slots.item({ class: className });

  return <div data-slot="grid-item" className={itemClassName} {...rest} />;
};
