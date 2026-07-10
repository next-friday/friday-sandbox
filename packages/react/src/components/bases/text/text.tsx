"use client";

import { Text as AriaText } from "react-aria-components/Text";
import type { ComponentPropsWithRef } from "react";

import { textVariants } from "./text.styles";
import type { TextVariants } from "./text.styles";

export interface TextProps
  extends
    Omit<ComponentPropsWithRef<typeof AriaText>, "elementType" | "color">,
    TextVariants {
  as?: string;
  className?: string;
}

export const Text = (props: Readonly<TextProps>) => {
  const {
    align,
    as,
    className,
    color,
    lineClamp,
    truncate,
    underline,
    variant,
    ...rest
  } = props;

  const rootClassName = textVariants({
    variant,
    color,
    align,
    lineClamp,
    truncate,
    underline,
    class: className,
  });

  return (
    <AriaText
      data-slot="text"
      elementType={as}
      className={rootClassName}
      {...rest}
    />
  );
};
