"use client";

import { Text as AriaText } from "react-aria-components";
import type { ComponentPropsWithRef } from "react";

import { textVariants } from "./text.variants";
import type { TextVariants } from "./text.variants";

export interface TextProps
  extends
    Omit<ComponentPropsWithRef<typeof AriaText>, "elementType">,
    TextVariants {
  as?: string;
  className?: string;
}

export const Text = (props: Readonly<TextProps>) => {
  const { as, className, color, lineClamp, truncate, variant, ...rest } = props;

  const slots = textVariants({ color, lineClamp, truncate, variant });
  const rootClassName = slots.root({ class: className });

  return (
    <AriaText
      data-slot="text"
      elementType={as}
      className={rootClassName}
      {...rest}
    />
  );
};
