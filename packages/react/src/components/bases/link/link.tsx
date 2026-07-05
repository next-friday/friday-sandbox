"use client";

import { Link as AriaLink } from "react-aria-components/Link";
import type { ComponentPropsWithRef } from "react";

import { composeTailwindRenderProps } from "../../utils/compose-tailwind-render-props";

import { linkVariants, linkIconVariants } from "./link.styles";
import type { LinkVariants } from "./link.styles";

export interface LinkProps
  extends ComponentPropsWithRef<typeof AriaLink>, LinkVariants {
  className?: string;
  isCurrent?: boolean;
}

export const LinkRoot = (props: Readonly<LinkProps>) => {
  const { children, className, decoration, isCurrent, variant, ...rest } =
    props;

  const ariaCurrent = isCurrent ? "page" : undefined;
  const resolvedClassName = composeTailwindRenderProps(
    className,
    linkVariants({ variant, decoration }),
  );

  return (
    <AriaLink
      data-slot="link"
      aria-current={ariaCurrent}
      className={resolvedClassName}
      {...rest}
    >
      {children}
    </AriaLink>
  );
};

export interface LinkIconProps extends ComponentPropsWithRef<"span"> {
  className?: string;
}

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1.5A.75.75 0 0 0 10 3h1.94L6.97 7.97a.75.75 0 0 0 1.06 1.06L13 4.06V6a.75.75 0 0 0 1.5 0V2.25a.75.75 0 0 0-.75-.75zM7.5 3.25a.75.75 0 0 0-.75-.75H4.5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9.25a.75.75 0 0 0-1.5 0v2.25a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 3 11.5v-6A1.5 1.5 0 0 1 4.5 4h2.25a.75.75 0 0 0 .75-.75"
    />
  </svg>
);

export const LinkIcon = (props: Readonly<LinkIconProps>) => {
  const { children, className, ...rest } = props;

  const resolvedClassName = linkIconVariants({ class: className });

  return (
    <span data-slot="link-icon" className={resolvedClassName} {...rest}>
      {children ?? <ExternalLinkIcon />}
    </span>
  );
};
