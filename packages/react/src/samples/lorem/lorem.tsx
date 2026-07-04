import { range } from "../utils/range";

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

interface LoremProps {
  paragraph?: number;
}

export const Lorem = ({ paragraph = 1 }: LoremProps) => (
  <div className="space-y-medium">
    {range(paragraph).map((position) => (
      <p className="text-sm leading-relaxed text-foreground" key={position}>
        {LOREM}
      </p>
    ))}
  </div>
);
