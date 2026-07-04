import { Box } from "../box/box";
import { range } from "../utils/range";

interface BoxesProps {
  count: number;
}

export const Boxes = ({ count }: BoxesProps) => (
  <>
    {range(count).map((position) => (
      <Box key={position} index={position} />
    ))}
  </>
);
