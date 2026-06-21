import {
  Envelope,
  Gear,
  HeartFill,
  FloppyDisk,
  TriangleExclamation,
} from "@gravity-ui/icons";
import { expect, fn, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Button } from ".";

const COLORS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "accent", label: "Accent" },
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
  title: "Bases/Actions/Button",
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
    isIconOnly: false,
  },
  argTypes: {
    children: {
      description: "The content to display inside the button.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    color: {
      description: "Use the `color` prop to change the color of the button.",
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
    variant: {
      description:
        "Use the `variant` prop to change the visual style of the button.",
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
      description: "Use the `size` prop to change the size of the button.",
      control: "radio",
      options: SIZES.map((size) => size.value),
      table: {
        type: { summary: "xs | sm | md | lg | xl" },
        defaultValue: { summary: "md" },
      },
    },
    isDisabled: {
      description: "Whether the button is disabled.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isIconOnly: {
      description:
        "Whether the button should display only an icon. Provide an `aria-label` so the action is announced to assistive technologies.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    "aria-label": {
      description:
        "Provide an `aria-label` so an icon-only button is announced to assistive technologies.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    onPress: {
      description: "Handler that is called when the button is pressed.",
      action: "pressed",
    },
    className: {
      description: "Additional CSS classes to apply to the button.",
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
          "Use the `variant` prop to change the visual style of the button.",
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
        story: "Use the `color` prop to change the color of the button.",
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
  parameters: {
    docs: {
      description: {
        story: "Use the `size` prop to change the size of the button.",
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

export const Disabled: Story = {
  args: { isDisabled: true },
  parameters: {
    docs: {
      description: {
        story: "Use the `isDisabled` prop to stop the button responding.",
      },
    },
  },
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use icons within a button.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      <Button {...storyArgs}>
        <Envelope />
        Email
      </Button>

      <Button {...storyArgs} color="danger">
        <TriangleExclamation />
        Exclamation
      </Button>

      <Button {...storyArgs} color="accent" variant="outline">
        <Envelope />
        Continue With Google
      </Button>
    </Flex>
  ),
};

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `isIconOnly` prop to render a square, icon-only button. Provide an `aria-label` so the action is announced to assistive technologies.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      <Button {...storyArgs} aria-label="Save" isIconOnly>
        <FloppyDisk />
      </Button>

      <Button {...storyArgs} color="accent" aria-label="Like" isIconOnly>
        <HeartFill />
      </Button>

      <Button {...storyArgs} color="success" aria-label="Settings" isIconOnly>
        <Gear />
      </Button>
    </Flex>
  ),
};

export const PlainHtml: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Apply the button styling to any element such as a plain anchor or a router link, so a navigation target looks like a button while staying the right element for the job.",
      },
    },
  },
  render: () => (
    <a className="fri-button fri-button-primary fri-button-md" href="/">
      Button
    </a>
  ),
};

export const Interaction: Story = {
  args: { onPress: fn() },
  parameters: {
    docs: {
      description: {
        story:
          "Tab to the button to reach it from the keyboard, then press Enter to trigger the action.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Button" });

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(args.onPress).toHaveBeenCalled();
  },
};
