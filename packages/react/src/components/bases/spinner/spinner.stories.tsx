import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Spinner } from ".";

const COLORS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "accent", label: "Accent" },
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "danger", label: "Danger" },
] as const;

const SIZES = [
  { value: "xs", label: "Extra Small" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
] as const;

const meta = {
  title: "Bases/Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Indeterminate spinner with a continuous spin, plus reduced-motion support built in.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Spinner } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          "<Spinner />",
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    color: "primary",
    size: "md",
  },
  argTypes: {
    color: {
      description: "Use the `color` prop to change the color of the spinner.",
      control: "select",
      options: COLORS.map((color) => color.value),
      table: {
        type: {
          summary:
            "primary | secondary | accent | info | success | warning | danger",
        },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      description: "Use the `size` prop to change the size of the spinner.",
      control: "radio",
      options: SIZES.map((size) => size.value),
      table: {
        type: { summary: "xs | sm | md | lg | xl" },
        defaultValue: { summary: "md" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the spinner.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => <Spinner {...storyArgs} />,
  play: async ({ canvasElement }) => {
    const spinner = canvasElement.querySelector('[data-slot="spinner"]');

    await expect(spinner).toBeInTheDocument();
  },
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `color` prop to change the color of the spinner.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      <Spinner {...storyArgs} color="primary" />
      <Spinner {...storyArgs} color="secondary" />
      <Spinner {...storyArgs} color="accent" />
      <Spinner {...storyArgs} color="info" />
      <Spinner {...storyArgs} color="success" />
      <Spinner {...storyArgs} color="warning" />
      <Spinner {...storyArgs} color="danger" />
    </Flex>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `size` prop to change the size of the spinner.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      <Spinner {...storyArgs} size="xs" />
      <Spinner {...storyArgs} size="sm" />
      <Spinner {...storyArgs} size="md" />
      <Spinner {...storyArgs} size="lg" />
      <Spinner {...storyArgs} size="xl" />
    </Flex>
  ),
};

export const CustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Style the spinner with Tailwind CSS utility classes through `className`, such as a custom size or color.",
      },
    },
  },
  render: () => <Spinner className="size-16 text-orange-500" />,
};

export const PlainHtml: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Apply the spinner styling to any element such as a plain span or a div, so a loading indicator renders in plain markup without the React component.",
      },
    },
  },
  render: () => (
    <div className="fri-spinner fri-spinner-primary fri-spinner-md"></div>
  ),
};
