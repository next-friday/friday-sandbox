"use client";

import { Label as AriaLabel } from "react-aria-components";
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
  const { children, className, isDisabled, isInvalid, isRequired, ...rest } =
    props;

  const resolvedClassName = labelVariants({
    isRequired,
    isDisabled,
    isInvalid,
    className,
  });

  return (
    <AriaLabel data-slot="label" className={resolvedClassName} {...rest}>
      {children}
    </AriaLabel>
  );
};
