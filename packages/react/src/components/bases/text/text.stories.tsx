import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Text } from ".";

const SAMPLE = "The quick brown fox jumps over the lazy dog";

const paragraph = `${SAMPLE}. ${SAMPLE}. ${SAMPLE}. ${SAMPLE}.`;

const LINE_CLAMPS = [1, 2, 3, 4, 5, 6] as const;

const VARIANTS = [
  "display-xl",
  "display-lg",
  "display-md",
  "display-sm",
  "title-lg",
  "title-md",
  "title-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "body-lg-strong",
  "body-md-strong",
  "body-sm-strong",
  "label-lg",
  "label-md",
  "label-sm",
  "caption",
  "overline",
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
    as: "span",
  },
  argTypes: {
    children: {
      description: "The content to display inside the text.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
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
    variant: {
      description:
        "Use the `variant` prop to apply a typographic style from the type scale.",
      control: "select",
      options: VARIANTS,
      table: {
        type: { summary: VARIANTS.join(" | ") },
        defaultValue: { summary: "body-md" },
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

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `variant` prop to apply a typographic style from the type scale.",
      },
    },
  },
  render: () => (
    <Flex direction="column" gap="md">
      {VARIANTS.map((variant) => (
        <Text key={variant} variant={variant}>
          {variant}
        </Text>
      ))}
    </Flex>
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
