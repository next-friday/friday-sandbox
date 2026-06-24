import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { ReactNode } from "react";

export interface PreviewProps {
  children: ReactNode;
  code: string;
}

export const Preview = (props: Readonly<PreviewProps>) => {
  const { children, code } = props;

  return (
    <div className="border-fd-border my-6 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-center gap-4 p-8">
        {children}
      </div>
      <DynamicCodeBlock lang="tsx" code={code} />
    </div>
  );
};
