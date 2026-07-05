"use client";

import { Link as AriaLink } from "react-aria-components/Link";
import type { ComponentPropsWithRef } from "react";

import { composeTailwindRenderProps } from "../../utils/compose-tailwind-render-props";

import { linkVariants, linkIconVariants } from "./link.styles";
import type { LinkVariants } from "./link.styles";

export interface LinkProps
  extends ComponentPropsWithRef<typeof AriaLink>, LinkVariants {
  className?: string;
}

export const Link = (props: Readonly<LinkProps>) => {
  const { children, className, decoration, variant, ...rest } = props;

  const resolvedClassName = composeTailwindRenderProps(
    className,
    linkVariants({ variant, decoration }),
  );

  return (
    <AriaLink data-slot="link" className={resolvedClassName} {...rest}>
      {children}
    </AriaLink>
  );
};

export interface LinkIconProps extends ComponentPropsWithRef<"span"> {
  className?: string;
}

export const LinkIcon = (props: Readonly<LinkIconProps>) => {
  const { children, className, ...rest } = props;

  const resolvedClassName = linkIconVariants({ class: className });

  return (
    <span
      data-slot="link-icon"
      aria-hidden="true"
      className={resolvedClassName}
      {...rest}
    >
      {children ?? (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.728 2.521a.75.75 0 0 1 .75.75v5.657a.751.751 0 0 1-1.5 0V5.083l-8.176 8.176a.75.75 0 0 1-1.061-1.06l8.176-8.177H7.07a.75.75 0 0 1 .001-1.5z"
          />
        </svg>
      )}
    </span>
  );
};
