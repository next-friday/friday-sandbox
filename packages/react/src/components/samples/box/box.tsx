export interface BoxProps {
  index: number;
}

export const Box = ({ index }: BoxProps) => (
  <div className="rounded-md bg-muted px-4 py-2 text-sm text-foreground">
    Item {index}
  </div>
);
