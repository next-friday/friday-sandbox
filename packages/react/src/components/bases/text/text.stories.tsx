import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Text } from ".";

const SAMPLE = "The quick brown fox jumps over the lazy dog";

const paragraph = `${SAMPLE}. ${SAMPLE}. ${SAMPLE}. ${SAMPLE}.`;

const LINE_CLAMPS = [1, 2, 3, 4, 5, 6] as const;

const VARIANTS = [
  { value: "inherit", label: "Inherit" },
  { value: "display-xxl", label: "Display XXL" },
  { value: "display-xl", label: "Display XL" },
  { value: "display-lg", label: "Display LG" },
  { value: "display-md", label: "Display MD" },
  { value: "display-sm", label: "Display SM" },
  { value: "body-lg", label: "Body LG" },
  { value: "body-lg-strong", label: "Body LG Strong" },
  { value: "body-md", label: "Body MD" },
  { value: "body-md-strong", label: "Body MD Strong" },
  { value: "body-sm", label: "Body SM" },
  { value: "body-sm-strong", label: "Body SM Strong" },
  { value: "body-xs", label: "Body XS" },
  { value: "body-xs-strong", label: "Body XS Strong" },
  { value: "label-lg", label: "Label LG" },
  { value: "label-md", label: "Label MD" },
  { value: "label-sm", label: "Label SM" },
  { value: "caption", label: "Caption" },
  { value: "caption-strong", label: "Caption Strong" },
  { value: "code", label: "Code" },
] as const;

const ALIGNS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" },
] as const;

const meta = {
  title: "Bases/Typography/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Polymorphic text primitive that renders any element while keeping the design system color baseline.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Text } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          "<Text>Text</Text>",
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    children: SAMPLE,
  },
  argTypes: {
    children: {
      description: "The content to display inside the text.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    variant: {
      description: "Use the `variant` prop to apply a typography scale token.",
      control: "select",
      options: VARIANTS.map((variant) => variant.value),
      table: {
        type: { summary: VARIANTS.map((variant) => variant.value).join(" | ") },
        defaultValue: { summary: "inherit" },
      },
    },
    align: {
      description: "Use the `align` prop to set the text alignment.",
      control: "inline-radio",
      options: ALIGNS.map((align) => align.value),
      table: {
        type: { summary: ALIGNS.map((align) => align.value).join(" | ") },
      },
    },
    lineClamp: {
      description:
        "Use the `lineClamp` prop to limit the text to a fixed number of lines with an ellipsis.",
      control: "select",
      options: LINE_CLAMPS,
      table: { type: { summary: "1 | 2 | 3 | 4 | 5 | 6" } },
    },
    truncate: {
      description:
        "Use the `truncate` prop to cut a single line of overflowing text with an ellipsis.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    as: {
      description:
        "Use the `as` prop to render the text as a different HTML element.",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "span" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the text.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => <Text {...storyArgs} />,
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('[data-slot="text"]');

    await expect(text).toBeInTheDocument();
    await expect(text).toHaveTextContent(SAMPLE);
  },
};

export const Variant: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `variant` prop to apply a typography scale token.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex direction="column" gap="md">
      <Text {...storyArgs} variant="display-xxl">
        Display XXL
      </Text>

      <Text {...storyArgs} variant="display-xl">
        Display XL
      </Text>

      <Text {...storyArgs} variant="display-lg">
        Display LG
      </Text>

      <Text {...storyArgs} variant="display-md">
        Display MD
      </Text>

      <Text {...storyArgs} variant="display-sm">
        Display SM
      </Text>

      <Text {...storyArgs} variant="body-lg">
        Body LG
      </Text>

      <Text {...storyArgs} variant="body-lg-strong">
        Body LG Strong
      </Text>

      <Text {...storyArgs} variant="body-md">
        Body MD
      </Text>

      <Text {...storyArgs} variant="body-md-strong">
        Body MD Strong
      </Text>

      <Text {...storyArgs} variant="body-sm">
        Body SM
      </Text>

      <Text {...storyArgs} variant="body-sm-strong">
        Body SM Strong
      </Text>

      <Text {...storyArgs} variant="body-xs">
        Body XS
      </Text>

      <Text {...storyArgs} variant="body-xs-strong">
        Body XS Strong
      </Text>

      <Text {...storyArgs} variant="label-lg">
        Label LG
      </Text>

      <Text {...storyArgs} variant="label-md">
        Label MD
      </Text>

      <Text {...storyArgs} variant="label-sm">
        Label SM
      </Text>

      <Text {...storyArgs} variant="caption">
        Caption
      </Text>

      <Text {...storyArgs} variant="caption-strong">
        Caption Strong
      </Text>
    </Flex>
  ),
};

export const Truncate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `truncate` prop to cut a single line of overflowing text with an ellipsis.",
      },
    },
  },
  render: (storyArgs) => (
    <Text {...storyArgs} className="max-w-xs" truncate>
      {SAMPLE}
    </Text>
  ),
};

export const LineClamp: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `lineClamp` prop to limit the text to a fixed number of lines with an ellipsis.",
      },
    },
  },
  render: (storyArgs) => (
    <Text {...storyArgs} as="p" className="max-w-xs" lineClamp={2}>
      {paragraph}
    </Text>
  ),
};

export const As: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `as` prop to render the text as a different HTML element.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex direction="column" gap="md">
      <Text {...storyArgs} as="p">
        Paragraph
      </Text>

      <Text {...storyArgs} as="strong">
        Strong
      </Text>

      <Text {...storyArgs} as="em">
        Emphasis
      </Text>
    </Flex>
  ),
};

export const CustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Style the text with Tailwind CSS utility classes through `className`, such as a custom size, weight, or color.",
      },
    },
  },
  render: () => (
    <Text className="text-2xl font-bold text-primary">{SAMPLE}</Text>
  ),
};

export const PlainHtml: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Apply the text styling to any element such as a plain span, so text renders in plain markup without the React component.",
      },
    },
  },
  render: () => <span className="fri-text">{SAMPLE}</span>,
};
