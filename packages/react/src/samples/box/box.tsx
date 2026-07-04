interface BoxProps {
  index: number;
}

export const Box = ({ index }: BoxProps) => (
  <div className="bg-primary px-4xlarge py-medium text-center text-sm font-semibold text-primary-foreground">
    {index}
  </div>
);
