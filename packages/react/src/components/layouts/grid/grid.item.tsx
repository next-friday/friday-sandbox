import { type ComponentPropsWithRef } from "react";

import { gridItemVariants, type GridItemVariants } from "./grid.item.variants";

export interface GridItemProps
  extends ComponentPropsWithRef<"div">, GridItemVariants {
  className?: string;
}

export const GridItem = (props: Readonly<GridItemProps>) => {
  const { className, colSpan, rowSpan, ...rest } = props;

  const resolvedClassName = gridItemVariants({
    colSpan,
    rowSpan,
    className,
  });

  return <div data-slot="grid-item" className={resolvedClassName} {...rest} />;
};
