"use client";

import { Text as AriaText } from "react-aria-components/Text";
import { textVariants } from "@friday-sandbox/styles/components/text";

import type { ComponentPropsWithRef } from "react";
import type { TextVariants } from "@friday-sandbox/styles/components/text";

export interface TextProps
  extends
    Omit<ComponentPropsWithRef<typeof AriaText>, "elementType">,
    TextVariants {
  as?: string;
  className?: string;
}

export const Text = (props: Readonly<TextProps>) => {
  const { align, as, className, lineClamp, truncate, variant, ...rest } = props;

  const slots = textVariants({ variant, align, lineClamp, truncate });
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
