import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Separator } from ".";

const ORIENTATIONS = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
] as const;

const meta = {
  title: "Bases/Layout/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Accessible separator with a semantic divider role, plus horizontal and vertical orientation built in.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Separator } from "@friday-sandbox/react";',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      description:
        "Use the `orientation` prop to render the separator horizontally or vertically.",
      control: "radio",
      options: ORIENTATIONS.map((orientation) => orientation.value),
      table: {
        type: { summary: "horizontal | vertical" },
        defaultValue: { summary: "horizontal" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the separator.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => <Separator {...storyArgs} />,
  play: async ({ canvasElement }) => {
    const separator = canvasElement.querySelector('[data-slot="separator"]');

    await expect(separator).toBeInTheDocument();
    await expect(separator).toHaveAttribute("role", "separator");
  },
};

export const Orientations: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `orientation` prop to render the separator horizontally or vertically.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex direction="column" gap="md">
      <Separator {...storyArgs} orientation="horizontal" />

      <Flex align="center" gap="md">
        Left
        <Separator {...storyArgs} orientation="vertical" />
        Right
      </Flex>
    </Flex>
  ),
};

export const CustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Style the separator with Tailwind CSS utility classes through `className`, such as a custom color or thickness.",
      },
    },
  },
  render: () => (
    <Separator className="h-1 bg-linear-to-r from-pink-500 to-red-500" />
  ),
};
