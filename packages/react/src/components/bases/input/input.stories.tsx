import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";
import { SIZES } from "../../../../.storybook/constants";

import { Input } from ".";

const meta = {
  title: "Bases/Forms/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    "aria-label": "Sample text",
    placeholder: "Type something…",
  },
  argTypes: {
    "aria-label": {
      description:
        "Accessible name for the input when no visible label is present.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    placeholder: {
      description: "Temporary text shown while the input is empty.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    size: {
      description: "Use the `size` prop to change the size of the input.",
      control: "radio",
      options: SIZES.map((size) => size.value),
      table: {
        type: { summary: "xs | sm | md | lg | xl" },
        defaultValue: { summary: "md" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the input.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const element = within(canvasElement).getByRole("textbox");

    await expect(element).toBeInTheDocument();
    await expect(element).toHaveAttribute("data-slot", "input");

    await userEvent.tab();
    await expect(element).toHaveFocus();
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `size` prop to change the size of the input.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      <Input {...storyArgs} size="xs" placeholder="Extra small" />
      <Input {...storyArgs} size="sm" placeholder="Small" />
      <Input {...storyArgs} size="md" placeholder="Medium" />
      <Input {...storyArgs} size="lg" placeholder="Large" />
      <Input {...storyArgs} size="xl" placeholder="Extra large" />
    </Flex>
  ),
};
