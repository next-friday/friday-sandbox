import type { ElementType } from "react";

import type { PolymorphicProps } from "../../utils/polymorphic-props";

import type { FlexVariants } from "./flex.styles";

export type FlexProps<TElement extends ElementType = "div"> = PolymorphicProps<
  FlexOwnProps,
  TElement
>;

type FlexOwnProps = Omit<FlexVariants, "flex" | "grow" | "shrink" | "basis"> &
  FlexSizing & {
    className?: string;
  };

type FlexSizing =
  | {
      flex?: FlexVariants["flex"];
      grow?: FlexSizingConflict;
      shrink?: FlexSizingConflict;
      basis?: FlexSizingConflict;
    }
  | {
      flex?: FlexSizingConflict;
      grow?: FlexVariants["grow"];
      shrink?: FlexVariants["shrink"];
      basis?: FlexVariants["basis"];
    };

type FlexSizingConflict =
  "`flex` is shorthand for `grow`, `shrink`, and `basis`. Use `flex`, or those three, not both.";
