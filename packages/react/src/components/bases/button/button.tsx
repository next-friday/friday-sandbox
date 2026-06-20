"use client";

import { Button as AriaButton } from "react-aria-components";
import type { ComponentPropsWithRef } from "react";

import { composeTailwindRenderProps } from "../../../utils/compose-tailwind-render-props";

import { buttonVariants } from "./button.variants";
import type { ButtonVariants } from "./button.variants";

export interface ButtonProps
  extends ComponentPropsWithRef<typeof AriaButton>, ButtonVariants {
  className?: string;
}

export const Button = (props: Readonly<ButtonProps>) => {
  const { className, color, size, variant, ...rest } = props;

  const resolvedClassName = composeTailwindRenderProps(
    className,
    buttonVariants({ color, variant, size }),
  );

  return (
    <AriaButton data-slot="button" className={resolvedClassName} {...rest} />
  );
};
