import { Flex } from "../flex/flex";

export interface DemoListProps {
  count?: number;
}

export const DemoLongList = ({ count = 30 }: DemoListProps) => (
  <div className="space-y-2 p-4">
    {Array.from({ length: count }, (_, position) => position + 1).map(
      (index) => (
        <div
          className="rounded-md bg-muted px-4 py-2 text-sm text-foreground"
          key={index}
        >
          Item {index}
        </div>
      ),
    )}
  </div>
);

export const DemoWideRow = ({ count = 20 }: DemoListProps) => (
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
