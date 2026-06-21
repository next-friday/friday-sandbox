"use client";

import { ProgressBar as AriaProgressBar } from "react-aria-components";
import type { ComponentPropsWithRef, CSSProperties } from "react";

import { composeTailwindRenderProps } from "../../utils/compose-tailwind-render-props";

import { loadingVariants } from "./loading.variants";
import type { LoadingVariants } from "./loading.variants";

export interface LoadingProps
  extends ComponentPropsWithRef<typeof AriaProgressBar>, LoadingVariants {
  className?: string;
}

export const Loading = (props: Readonly<LoadingProps>) => {
  const { isIndeterminate = true, className, color, size, ...rest } = props;

  const slots = loadingVariants({ color, size });
  const rootClassName = composeTailwindRenderProps(className, slots.root());
  const indicatorClassName = slots.indicator();

  return (
    <AriaProgressBar
      data-slot="loading"
      isIndeterminate={isIndeterminate}
      className={rootClassName}
      {...rest}
    >
      {({ percentage }) => {
        const indicatorStyle = isIndeterminate
          ? undefined
          : ({ "--loading-percentage": percentage ?? 0 } as CSSProperties);

        return (
          <div
            data-slot="loading-indicator"
            className={indicatorClassName}
            style={indicatorStyle}
          />
        );
      }}
    </AriaProgressBar>
  );
};
