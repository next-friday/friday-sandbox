"use client";

import { Separator as AriaSeparator } from "react-aria-components/Separator";
import { separatorVariants } from "@friday-sandbox/styles/components/separator";

import type { ComponentPropsWithRef } from "react";
import type { SeparatorVariants } from "@friday-sandbox/styles/components/separator";

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
