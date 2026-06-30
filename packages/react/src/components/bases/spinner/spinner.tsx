import { spinnerVariants } from "@friday-sandbox/styles/components/spinner";

import type { ComponentPropsWithRef } from "react";
import type { SpinnerVariants } from "@friday-sandbox/styles/components/spinner";

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
