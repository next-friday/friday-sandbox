export interface DemoBoxProps {
  index: number;
}

export const DemoBox = ({ index }: DemoBoxProps) => (
  <div className="rounded-md bg-muted px-4 py-2 text-sm text-foreground">
    Item {index}
  </div>
);
