import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../../layouts/flex";

import { Button } from ".";

const COLORS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "accent", label: "Accent" },
  { value: "neutral", label: "Neutral" },
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "danger", label: "Danger" },
] as const;

const VARIANTS = [
  { value: "solid", label: "Solid" },
  { value: "subtle", label: "Subtle" },
  { value: "surface", label: "Surface" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost" },
  { value: "plain", label: "Plain" },
] as const;

const SIZES = [
  { value: "xs", label: "Extra Small" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
] as const;

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
    color: "primary",
    variant: "solid",
    size: "md",
    isDisabled: false,
  },
  argTypes: {
    children: {
      description: "Label or content inside the button — usually text.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    color: {
      description:
        "Semantic color. Match the button to the meaning of the action — `primary` for the main action, `danger` for destructive ones, and so on.",
      control: "select",
      options: COLORS.map((color) => color.value),
      table: {
        type: {
          summary:
            "primary | secondary | accent | neutral | info | success | warning | danger",
        },
        defaultValue: { summary: "primary" },
      },
    },
    variant: {
      description:
        "Fill style. `solid` is the default; `outline`/`ghost`/`plain` step the emphasis down; `subtle`/`surface` are soft tints of the color.",
      control: "select",
      options: VARIANTS.map((variant) => variant.value),
      table: {
        type: {
          summary: "solid | subtle | surface | outline | ghost | plain",
        },
        defaultValue: { summary: "solid" },
      },
    },
    size: {
      description:
        "Visual size. `md` is the default at 40 px tall — large enough for touch. `xs`/`sm` for compact UIs, `lg`/`xl` for hero actions.",
      control: "radio",
      options: SIZES.map((size) => size.value),
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
          "Six fill styles, from the solid default down to the borderless plain — combine any with a color.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      {VARIANTS.map((variant) => (
        <Button key={variant.value} {...storyArgs} variant={variant.value}>
          {variant.label}
        </Button>
      ))}
    </Flex>
  ),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Every semantic color across all six fill variants — one row per variant (solid, subtle, surface, outline, ghost, plain).",
      },
    },
  },
  render: (storyArgs) => (
    <Flex direction="column" gap="md">
      {VARIANTS.map((variant) => (
        <Flex wrap="wrap" align="center" gap="md" key={variant.value}>
          {COLORS.map((color) => (
            <Button
              key={color.value}
              {...storyArgs}
              variant={variant.value}
              color={color.value}
            >
              {color.label}
            </Button>
          ))}
        </Flex>
      ))}
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
      {SIZES.map((size) => (
        <Button key={size.value} {...storyArgs} size={size.value}>
          {size.label}
        </Button>
      ))}
    </Flex>
  ),
};

export const PlainHtml: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the button styles on any element by composing `fri-button` with a color class (`fri-button-primary`) and a size class (`fri-button-md`). Handy for a plain `<a>`, a router's link component, or any custom anchor.",
      },
    },
  },
  render: () => (
    <a className="fri-button fri-button-primary fri-button-md" href="/">
      Button
    </a>
  ),
};
