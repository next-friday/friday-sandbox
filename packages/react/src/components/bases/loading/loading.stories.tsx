import { expect, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Loading } from ".";

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

const SPINNER_LABEL = "Loading";

const meta = {
  title: "Bases/Feedback/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Progress indicator that announces a busy state to assistive technologies. It spins indeterminately by default, or shows determinate progress from a `value`.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Loading } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          "<Loading />",
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    color: "primary",
    size: "md",
    isIndeterminate: true,
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
    isIndeterminate: {
      description:
        "Use the `isIndeterminate` prop to switch between an indeterminate spinner and determinate progress driven by `value`.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the spinner.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => <Loading {...storyArgs} aria-label={SPINNER_LABEL} />,
  play: async ({ canvasElement }) => {
    const spinner = within(canvasElement).getByRole("progressbar", {
      name: SPINNER_LABEL,
    });

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
      {COLORS.map((color) => (
        <Loading
          key={color.value}
          {...storyArgs}
          color={color.value}
          aria-label={SPINNER_LABEL}
        />
      ))}
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
      {SIZES.map((size) => (
        <Loading
          key={size.value}
          {...storyArgs}
          size={size.value}
          aria-label={SPINNER_LABEL}
        />
      ))}
    </Flex>
  ),
};

export const Determinate: Story = {
  args: { isIndeterminate: false, value: 65 },
  parameters: {
    docs: {
      description: {
        story:
          "Set `isIndeterminate` to `false` and pass a `value` to show determinate progress.",
      },
    },
  },
  render: (storyArgs) => <Loading {...storyArgs} aria-label={SPINNER_LABEL} />,
};

export const CustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Retheme the spinner through its exposed CSS variables, such as a custom color and a thicker ring.",
      },
    },
  },
  render: () => (
    <Loading
      className="[--loading-color:var(--success)] [--loading-thickness-divisor:4]"
      aria-label={SPINNER_LABEL}
    />
  ),
};
