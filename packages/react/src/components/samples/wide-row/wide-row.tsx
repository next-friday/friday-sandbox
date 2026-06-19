import { Flex } from "../../layouts/flex/flex";

export interface WideRowProps {
  count?: number;
}

export const WideRow = ({ count = 20 }: WideRowProps) => (
  <Flex gap="sm">
    {Array.from({ length: count }, (_, position) => position + 1).map(
      (index) => (
        <div
          className="w-32 shrink-0 rounded-md bg-muted px-4 py-2 text-sm text-foreground"
          key={index}
        >
          Item {index}
        </div>
      ),
    )}
  </Flex>
);
