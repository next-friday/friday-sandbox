"use client";

import { Label as AriaLabel } from "react-aria-components/Label";
import type { ComponentPropsWithRef } from "react";

import { labelVariants } from "./label.variants";
import type { LabelVariants } from "./label.variants";

export interface LabelProps
  extends
    Omit<ComponentPropsWithRef<typeof AriaLabel>, "className">,
    LabelVariants {
  className?: string;
}

export const Label = (props: Readonly<LabelProps>) => {
  const { children, className, ...rest } = props;

  const resolvedClassName = labelVariants({ className });

  return (
    <AriaLabel data-slot="label" className={resolvedClassName} {...rest}>
      {children}
    </AriaLabel>
  );
};
