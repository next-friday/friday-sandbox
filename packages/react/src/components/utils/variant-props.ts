import type { VariantProps } from "class-variance-authority";

export type StrictVariantProps<
  Component extends (...args: never[]) => unknown,
> = {
  [Key in keyof VariantProps<Component>]?: NonNullable<
    VariantProps<Component>[Key]
  >;
};
