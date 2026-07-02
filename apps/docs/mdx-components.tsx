import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { SourceLinks } from "@/components/source-links";
import { Tab } from "@/components/mdx-tab";

export const getMDXComponents = (
  components?: MDXComponents,
): MDXComponents => ({
  ...TabsComponents,
  ...components,
  ...defaultMdxComponents,
  SourceLinks,
  Tab,
});
