import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Flex } from "@friday-sandbox/react";
import type { ReactNode } from "react";

interface PreviewProps {
  children: ReactNode;
  code: string;
}

export const Preview = (properties: Readonly<PreviewProps>) => {
  const { children, code } = properties;

  return (
    <Flex direction="column" gap="xl">
      <Flex align="end" gap="md" className="rounded-xl border p-8">
        {children}
      </Flex>

      <DynamicCodeBlock lang="tsx" code={code} />
    </Flex>
  );
};
