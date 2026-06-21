"use client";

import {
  Button as AriaButton,
  composeRenderProps,
} from "react-aria-components";
import type { ComponentPropsWithRef } from "react";

import { composeTailwindRenderProps } from "../../utils/compose-tailwind-render-props";
import { Spinner } from "../spinner/spinner";

import { buttonVariants } from "./button.variants";
import type { ButtonVariants } from "./button.variants";

export interface ButtonProps
  extends ComponentPropsWithRef<typeof AriaButton>, ButtonVariants {
  className?: string;
}

export const Button = (props: Readonly<ButtonProps>) => {
  const {
    children,
    className,
    color,
    isFullWidth,
    isIconOnly,
    isRoundedFull,
    size,
    variant,
    ...rest
  } = props;

  const resolvedClassName = composeTailwindRenderProps(
    className,
    buttonVariants({
      color,
      variant,
      size,
      isIconOnly,
      isFullWidth,
      isRoundedFull,
    }),
  );

  return (
    <AriaButton data-slot="button" className={resolvedClassName} {...rest}>
      {composeRenderProps(children, (resolvedChildren, { isPending }) => (
        <>
          {resolvedChildren}

          {isPending && <Spinner data-slot="button-spinner" aria-hidden />}
        </>
      ))}
    </AriaButton>
  );
};
