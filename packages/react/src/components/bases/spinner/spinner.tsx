import type { ComponentPropsWithRef } from "react";

import { spinnerVariants } from "./spinner.variants";
import type { SpinnerVariants } from "./spinner.variants";

export interface SpinnerProps
  extends Omit<ComponentPropsWithRef<"span">, "color">, SpinnerVariants {
  className?: string;
}

export const Spinner = (props: Readonly<SpinnerProps>) => {
  const { className, color, size, ...rest } = props;

  const slots = spinnerVariants({ color, size });
  const rootClassName = slots.root({ class: className });

  return <span data-slot="spinner" className={rootClassName} {...rest} />;
};
