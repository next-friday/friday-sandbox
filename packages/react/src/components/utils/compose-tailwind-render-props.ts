import { clsx } from "clsx";
import { composeRenderProps } from "react-aria-components";

/**
 * Merge a Tailwind class string with a render-prop or static `className`.
 * @param {string | ((renderProps: RenderProps) => string) | undefined} className Caller-supplied class, static or render-prop.
 * @param {string} tailwindClasses Tailwind classes to merge on top.
 * @returns {string | ((renderProps: RenderProps) => string)} Resolved className passed straight to `react-aria-components`.
 */
export function composeTailwindRenderProps<RenderProps>(
  className: string | ((renderProps: RenderProps) => string) | undefined,
  tailwindClasses: string,
): string | ((renderProps: RenderProps) => string) {
  return composeRenderProps(className, (resolved) =>
    clsx(tailwindClasses, resolved),
  );
}
