"use client";

import { Separator as AriaSeparator } from "react-aria-components";
import type { ComponentPropsWithRef } from "react";

import { separatorVariants } from "./separator.variants";
import type { SeparatorVariants } from "./separator.variants";

export interface SeparatorProps
  extends
    Omit<ComponentPropsWithRef<typeof AriaSeparator>, "orientation">,
    SeparatorVariants {
  className?: string;
}

export const Separator = (props: Readonly<SeparatorProps>) => {
  const { orientation = "horizontal", className, ...rest } = props;

  const slots = separatorVariants({ orientation });
  const rootClassName = slots.root({ class: className });

  return (
    <AriaSeparator
      data-slot="separator"
      orientation={orientation}
      className={rootClassName}
      {...rest}
    />
  );
};
