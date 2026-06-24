import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

import { baseOptions } from "@/lib/layout";
import { source } from "@/lib/source";

export interface LayoutProps {
  children: ReactNode;
}

const Layout = (props: Readonly<LayoutProps>) => {
  const { children } = props;

  return (
    <DocsLayout tree={source.pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  );
};

export default Layout;
