import { type ComponentPropsWithoutRef } from "react";

import { gridVariants, type GridVariants } from "./grid.styles";

export interface GridProps
  extends ComponentPropsWithoutRef<"div">, GridVariants {
  className?: string;
}

export const Grid = (props: Readonly<GridProps>) => {
  const { className, columns, flow, gap, gapX, gapY, rows, ...rest } = props;

  const resolvedClassName = gridVariants({
    columns,
    rows,
    flow,
    gap,
    gapX,
    gapY,
    className,
  });

  return <div data-slot="grid" className={resolvedClassName} {...rest} />;
};
