import type { ComponentPropsWithRef } from "react";

import { surfaceVariants } from "./surface.styles";
import type { SurfaceVariants } from "./surface.styles";

export interface SurfaceProps
  extends ComponentPropsWithRef<"div">, SurfaceVariants {
  className?: string;
}

export const Surface = (props: Readonly<SurfaceProps>) => {
  const {
    children,
    className,
    p,
    pb,
    pl,
    pr,
    pt,
    px,
    py,
    radius,
    variant,
    ...rest
  } = props;

  const resolvedClassName = surfaceVariants({
    variant,
    radius,
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
    <div data-slot="surface" className={resolvedClassName} {...rest}>
      {children}
    </div>
  );
};
