import { Flex } from "../../bases/flex/flex";
import { range } from "../range";

interface WideRowProps {
  count?: number;
}

export const WideRow = ({ count = 20 }: WideRowProps) => (
  <Flex gap="sm">
    {range(count).map((position) => (
      <div
        className="w-32 shrink-0 bg-primary px-4 py-2 text-sm text-primary-foreground"
        key={position}
      >
        Item {position}
      </div>
    ))}
  </Flex>
);
