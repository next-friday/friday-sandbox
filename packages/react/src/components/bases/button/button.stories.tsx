import { type Meta, type StoryObj } from "@storybook/react-vite";

import { Flex } from "../../layouts/flex";

import { Button } from ".";

const meta = {
  title: "Base/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Accessible button with keyboard support, focus ring, and hover/press states built in.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Button } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          "<Button />",
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    isDisabled: false,
  },
  argTypes: {
    children: {
      description: "Label or content inside the button — usually text.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    variant: {
      description:
        "Semantic color. Match the button to the meaning of the action — `primary` for the main action, `danger` for destructive ones, and so on.",
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "neutral",
        "info",
        "success",
        "warning",
        "danger",
      ],
      table: {
        type: {
          summary:
            "primary | secondary | accent | neutral | info | success | warning | danger",
        },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      description:
        "Visual size. `md` is the default at 40 px tall — large enough for touch. `xs`/`sm` for compact UIs, `lg`/`xl` for hero actions.",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: {
        type: { summary: "xs | sm | md | lg | xl" },
        defaultValue: { summary: "md" },
      },
    },
    isDisabled: {
      description:
        "Disables the button. Click and keyboard events stop firing.",
      control: "boolean",
    },
    onPress: {
      description:
        "Fires when the button is activated — mouse, touch, or keyboard (Space/Enter). Use this instead of `onClick`.",
      action: "pressed",
    },
    className: {
      description: "Extra Tailwind classes appended after the variant classes.",
      control: "text",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Eight semantic colors. Pick the one that matches the meaning of the action.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      <Button {...storyArgs} variant="primary">
        Primary
      </Button>

      <Button {...storyArgs} variant="secondary">
        Secondary
      </Button>

      <Button {...storyArgs} variant="accent">
        Accent
      </Button>

      <Button {...storyArgs} variant="neutral">
        Neutral
      </Button>

      <Button {...storyArgs} variant="info">
        Info
      </Button>

      <Button {...storyArgs} variant="success">
        Success
      </Button>

      <Button {...storyArgs} variant="warning">
        Warning
      </Button>

      <Button {...storyArgs} variant="danger">
        Danger
      </Button>
    </Flex>
  ),
};

export const Sizes: Story = {
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Five fixed sizes from `xs` (24 px) to `xl` (56 px). `md` is the default and meets touch-target guidelines.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      <Button {...storyArgs} size="xs">
        Button
      </Button>

      <Button {...storyArgs} size="sm">
        Button
      </Button>

      <Button {...storyArgs} size="md">
        Button
      </Button>

      <Button {...storyArgs} size="lg">
        Button
      </Button>

      <Button {...storyArgs} size="xl">
        Button
      </Button>
    </Flex>
  ),
};

export const PlainHtml: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the button styles on any element by composing `fri-button` with a color class (`fri-button-primary`) and a size class (`fri-button-md`). Handy when wrapping a Next.js `<Link>` or any custom anchor.",
      },
    },
  },
  render: () => (
    <a className="fri-button fri-button-primary fri-button-md" href="/">
      Button
    </a>
  ),
};
