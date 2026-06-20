import type { Meta, StoryObj } from "@storybook/react-vite";

import { Boxes } from "../../samples/boxes";

import { Flex } from ".";

const meta = {
  title: "Layout/Primitives/Flex",
  component: Flex,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Flexbox layout in one line. Set direction, alignment, distribution, wrapping, and gap with named props instead of class strings.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Flex } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          "<Flex />",
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    direction: "row",
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
    gap: "md",
  },
  argTypes: {
    direction: {
      description:
        "Flow direction. `row` lays children left-to-right; `column` stacks them top-to-bottom.",
      control: "radio",
      options: ["row", "column", "row-reverse", "column-reverse"],
      table: {
        type: { summary: "row | column | row-reverse | column-reverse" },
        defaultValue: { summary: "row" },
      },
    },
    align: {
      description:
        "How children line up across the layout — top, center, bottom (or left/center/right when direction is `column`).",
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
      table: {
        type: { summary: "start | center | end | stretch | baseline" },
        defaultValue: { summary: "stretch" },
      },
    },
    justify: {
      description:
        "How children spread out along the flow. `between` pushes them to the edges with equal space in the middle.",
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      table: {
        type: { summary: "start | center | end | between | around | evenly" },
        defaultValue: { summary: "start" },
      },
    },
    wrap: {
      description:
        "Whether children wrap to a new line when they run out of room.",
      control: "select",
      options: ["nowrap", "wrap", "wrap-reverse"],
      table: {
        type: { summary: "nowrap | wrap | wrap-reverse" },
        defaultValue: { summary: "nowrap" },
      },
    },
    gap: {
      description:
        "Space between children. Five-step scale from `xs` (tight) to `xl` (roomy).",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    gapX: {
      description:
        "Horizontal gap only. Use this to override `gap` on one axis.",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    gapY: {
      description: "Vertical gap only. Use this to override `gap` on one axis.",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    className: {
      description: "Extra Tailwind classes appended after the variant classes.",
      control: "text",
    },
  },
} satisfies Meta<typeof Flex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => (
    <Flex {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};

export const Direction: Story = {
  args: { direction: "column" },
  render: (storyArgs) => (
    <Flex {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};

export const Align: Story = {
  args: { align: "center" },
  render: (storyArgs) => (
    <Flex {...storyArgs} className="h-32">
      <Boxes count={3} />
    </Flex>
  ),
};

export const Justify: Story = {
  args: { justify: "between" },
  render: (storyArgs) => (
    <Flex {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};

export const Wrap: Story = {
  args: { wrap: "wrap", gap: "sm" },
  render: (storyArgs) => (
    <Flex {...storyArgs} className="w-64">
      <Boxes count={10} />
    </Flex>
  ),
};

export const Gap: Story = {
  args: { gap: "xl" },
  render: (storyArgs) => (
    <Flex {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};
