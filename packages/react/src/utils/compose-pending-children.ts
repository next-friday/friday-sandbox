import { type ButtonProps, composeRenderProps } from "react-aria-components";

type Children = ButtonProps["children"];

/**
 * Hide button children while `isPending` is true.
 * @param {Children} children Button children, node or render-prop function.
 * @returns {Children} Render-prop function that omits children during pending state.
 */
export function composePendingChildren(children: Children): Children {
  return composeRenderProps(children, (resolved, { isPending }) =>
    isPending ? undefined : resolved,
  );
}
