import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";

import { baseOptions } from "@/lib/layout";
import { source } from "@/lib/source";

export interface LayoutProps {
  children: ReactNode;
}

const Layout = (props: Readonly<LayoutProps>) => {
  const { children } = props;
  const { nav, ...base } = baseOptions;

  return (
    <DocsLayout
      tabMode="navbar"
      tree={source.pageTree}
      nav={{ ...nav, mode: "top" }}
      {...base}
    >
      {children}
    </DocsLayout>
  );
};

export default Layout;
