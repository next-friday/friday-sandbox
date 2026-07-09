import { Flex } from "../../components/bases/flex/flex";
import { range } from "../utils/range";

interface WideRowProps {
  count?: number;
  rows?: number;
}

export const WideRow = ({ count = 20, rows = 1 }: WideRowProps) => (
  <Flex direction="column" gap="sm">
    {range(rows).map((row) => (
      <Flex gap="sm" key={row}>
        {range(count).map((position) => (
          <div
            className="w-32 shrink-0 bg-primary px-4 py-2 text-sm text-primary-foreground"
            key={position}
          >
            Item {position}
          </div>
        ))}
      </Flex>
    ))}
  </Flex>
);
