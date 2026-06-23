export interface BoxProps {
  index: number;
}

export const Box = ({ index }: BoxProps) => (
  <div className="min-w-32 bg-primary px-4 py-2 text-sm text-primary-foreground">
    {index}
  </div>
);
