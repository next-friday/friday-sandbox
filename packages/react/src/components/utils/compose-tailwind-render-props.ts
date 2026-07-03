import { clsx } from "clsx";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

/**
 *
 */
export function composeTailwindRenderProps<RenderProps>(
  className: string | ((renderProps: RenderProps) => string) | undefined,
  tailwindClasses: string,
): string | ((renderProps: RenderProps) => string) {
  return composeRenderProps(className, (resolved) =>
    clsx(tailwindClasses, resolved),
  );
}
