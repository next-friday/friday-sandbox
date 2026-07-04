import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";
import { Grid } from "../grid";
import { Text } from "../text";

import { Surface } from ".";

const VARIANTS = ["primary", "secondary", "outline"] as const;
const RADII = ["none", "xs", "sm", "md", "lg", "xl"] as const;
const SPACING = [
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
] as const;

const meta = {
  title: "Bases/Layout/Surface",
  component: Surface,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Structural container that paints the surface tokens as a variant ladder, plus radius and padding — all driven by design tokens.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Surface } from "@friday-sandbox/react";',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    variant: "primary",
    radius: "md",
  },
  argTypes: {
    variant: {
      description:
        "Use the `variant` prop to set the surface fill: `primary`, `secondary`, or a bordered `outline`.",
      control: "radio",
      options: VARIANTS,
      table: {
        type: { summary: VARIANTS.join(" | ") },
        defaultValue: { summary: "primary" },
      },
    },
    radius: {
      description:
        "Use the `radius` prop to round the corners with a step from the radius scale.",
      control: "select",
      options: RADII,
      table: {
        type: { summary: RADII.join(" | ") },
        defaultValue: { summary: "md" },
      },
    },
    p: {
      description: "Use the `p` prop to set padding on all sides.",
      control: "select",
      options: SPACING,
      table: { type: { summary: SPACING.join(" | ") } },
    },
    px: {
      description: "Use the `px` prop to set horizontal (inline) padding.",
      control: "select",
      options: SPACING,
      table: { type: { summary: SPACING.join(" | ") } },
    },
    py: {
      description: "Use the `py` prop to set vertical (block) padding.",
      control: "select",
      options: SPACING,
      table: { type: { summary: SPACING.join(" | ") } },
    },
    pt: {
      description: "Use the `pt` prop to set top padding.",
      control: "select",
      options: SPACING,
      table: { type: { summary: SPACING.join(" | ") } },
    },
    pr: {
      description: "Use the `pr` prop to set right padding.",
      control: "select",
      options: SPACING,
      table: { type: { summary: SPACING.join(" | ") } },
    },
    pb: {
      description: "Use the `pb` prop to set bottom padding.",
      control: "select",
      options: SPACING,
      table: { type: { summary: SPACING.join(" | ") } },
    },
    pl: {
      description: "Use the `pl` prop to set left padding.",
      control: "select",
      options: SPACING,
      table: { type: { summary: SPACING.join(" | ") } },
    },
    className: {
      description: "Additional CSS classes to apply to the surface.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => (
    <Surface {...storyArgs} p="xl">
      <Flex direction="column" gap="sm">
        <Text variant="label-lg">Surface</Text>

        <Text variant="body-sm">
          Container component that provides surface-level styling and context
          for child components
        </Text>
      </Flex>
    </Surface>
  ),

  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector('[data-slot="surface"]');

    await expect(element).toBeInTheDocument();
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `variant` prop to set the surface fill: `primary` paints the base surface, `secondary` the soft tier, and `outline` draws a border with no fill.",
      },
    },
  },
  render: () => (
    <Grid gap="md">
      <Surface variant="primary" p="xl">
        <Flex direction="column" gap="sm">
          <Text variant="label-lg">Primary</Text>

          <Text variant="body-sm">
            Container component that provides surface-level styling and context
            for child components
          </Text>
        </Flex>
      </Surface>

      <Surface variant="secondary" p="xl">
        <Flex direction="column" gap="sm">
          <Text variant="label-lg">Secondary</Text>

          <Text variant="body-sm">
            Container component that provides surface-level styling and context
            for child components
          </Text>
        </Flex>
      </Surface>

      <Surface variant="outline" p="xl">
        <Flex direction="column" gap="sm">
          <Text variant="label-lg">Outline</Text>

          <Text variant="body-sm">
            Container component that provides surface-level styling and context
            for child components
          </Text>
        </Flex>
      </Surface>
    </Grid>
  ),
};

export const Radii: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `radius` prop to round the corners, or `none` for square corners.",
      },
    },
  },
  render: () => (
    <Grid gap="md">
      <Surface radius="none" p="xl">
        <Text variant="label-lg">none</Text>
      </Surface>

      <Surface radius="xs" p="xl">
        <Text variant="label-lg">xs</Text>
      </Surface>

      <Surface radius="sm" p="xl">
        <Text variant="label-lg">sm</Text>
      </Surface>

      <Surface radius="md" p="xl">
        <Text variant="label-lg">md</Text>
      </Surface>

      <Surface radius="lg" p="xl">
        <Text variant="label-lg">lg</Text>
      </Surface>

      <Surface radius="xl" p="xl">
        <Text variant="label-lg">xl</Text>
      </Surface>
    </Grid>
  ),
};
