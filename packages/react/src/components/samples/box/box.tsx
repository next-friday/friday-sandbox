export interface BoxProps {
  index: number;
}

export const Box = ({ index }: BoxProps) => (
  <div className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
    Item {index}
  </div>
);
