export interface LongListProps {
  count?: number;
}

export const LongList = ({ count = 30 }: LongListProps) => (
  <div className="space-y-2">
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
