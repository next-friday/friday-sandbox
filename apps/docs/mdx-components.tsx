import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { Preview } from "@/components/preview";

export const getMDXComponents = (
  components?: MDXComponents,
): MDXComponents => ({
  ...defaultMdxComponents,
  Preview,
  ...components,
});
