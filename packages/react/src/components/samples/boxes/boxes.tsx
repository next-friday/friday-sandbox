import { Box } from "../box/box";

interface BoxesProps {
  count: number;
}

export const Boxes = ({ count }: BoxesProps) => (
  <>
    {Array.from({ length: count }, (_, position) => position + 1).map(
      (index) => (
        <Box key={index} index={index} />
      ),
    )}
  </>
);
