"use client";

import { Input as AriaInput } from "react-aria-components/Input";
import type { ComponentPropsWithRef } from "react";

import { composeTailwindRenderProps } from "../../utils/compose-tailwind-render-props";

import { inputVariants } from "./input.styles";
import type { InputVariants } from "./input.styles";

export interface InputProps
  extends Omit<ComponentPropsWithRef<typeof AriaInput>, "size">, InputVariants {
  className?: string;
}

export const Input = (props: Readonly<InputProps>) => {
  const { className, size, ...rest } = props;

  const resolvedClassName = composeTailwindRenderProps(
    className,
    inputVariants({ size }),
  );

  return (
    <AriaInput data-slot="input" className={resolvedClassName} {...rest} />
  );
};
