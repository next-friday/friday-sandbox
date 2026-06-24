import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { ReactNode } from "react";

interface PreviewProps {
  children: ReactNode;
  code: string;
}

export const Preview = (properties: Readonly<PreviewProps>) => {
  const { children, code } = properties;

  return (
    <div className="border-fd-border my-6 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-center gap-4 p-8">
        {children}
      </div>

      <DynamicCodeBlock lang="tsx" code={code} />
    </div>
  );
};
