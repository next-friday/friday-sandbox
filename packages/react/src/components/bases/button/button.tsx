"use client";

import { type ComponentPropsWithRef } from "react";
import { Button as AriaButton } from "react-aria-components";

import { composeTailwindRenderProps } from "../../../utils/compose-tailwind-render-props";

import { buttonVariants, type ButtonVariants } from "./button.styles";

export interface ButtonProps
  extends
    Omit<ComponentPropsWithRef<typeof AriaButton>, "isPending" | "autoFocus">,
    ButtonVariants {
  className?: string;
}

export const Button = (props: Readonly<ButtonProps>) => {
  const { className, size, variant, ...rest } = props;

  const resolvedClassName = composeTailwindRenderProps(
    className,
    buttonVariants({ variant, size }),
  );

  return (
    <AriaButton data-slot="button" className={resolvedClassName} {...rest} />
  );
};
