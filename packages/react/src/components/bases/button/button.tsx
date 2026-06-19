"use client";

import { Button as AriaButton } from "react-aria-components";
import { type ButtonProps as AriaButtonProps } from "react-aria-components";

import { composeTailwindRenderProps } from "../../../utils/compose-tailwind-render-props";

import { buttonVariants, type ButtonVariants } from "./button.styles";

export interface ButtonProps
  extends Omit<AriaButtonProps, "isPending" | "autoFocus">, ButtonVariants {
  className?: string;
}

const Button = (props: Readonly<ButtonProps>) => {
  const { className, size, variant, ...rest } = props;

  const resolvedClassName = composeTailwindRenderProps(
    className,
    buttonVariants({ variant, size }),
  );

  return (
    <AriaButton data-slot="button" className={resolvedClassName} {...rest} />
  );
};

export { Button };

export default Button;
