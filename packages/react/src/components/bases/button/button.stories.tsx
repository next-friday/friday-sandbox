import {
  ArrowRightFromSquare,
  ArrowsRotateLeft,
  Envelope,
  FloppyDisk,
  Gear,
  HeartFill,
  TrashBin,
  TriangleExclamation,
} from "@gravity-ui/icons";
import { expect, fn, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { GoogleIcon } from "../../icons";

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
          "Accessible button with keyboard support, plus hover, press, and focus states built in.",
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
          "",
          "## Interactive States",
          "",
          "The button reflects each state automatically. Target a state with its pseudo-class or its data attribute:",
          "",
          "- Hover: `:hover` or `[data-hovered]`",
          "- Pressed: `:active` or `[data-pressed]`",
          "- Focus: `:focus-visible` or `[data-focus-visible]`",
          "- Disabled: `:disabled` or `[aria-disabled]`",
          "",
          "## Styling",
          "",
          "Pass Tailwind CSS classes through `className` to extend or override the styles, as the Custom Styles example shows. To re-theme every button at once, override the design tokens documented on the Theming page.",
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
    isFullWidth: false,
    isRoundedFull: false,
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
    isFullWidth: {
      description: "Whether the button spans the full width of its container.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isRoundedFull: {
      description: "Whether the button is fully rounded.",
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

export const Default: Story = {
  args: { onPress: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", {
      name: "Button",
    });

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(args.onPress).toHaveBeenCalled();
  },
};

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

export const FullWidth: Story = {
  args: { isFullWidth: true },
  parameters: {
    docs: {
      description: {
        story:
          "Use the `isFullWidth` prop to make the button span the full width of its container.",
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
      <Flex align="center" gap="md">
        <Button {...storyArgs}>
          <Envelope />
          Email
        </Button>

        <Button {...storyArgs} color="danger">
          <TriangleExclamation />
          Delete
        </Button>

        <Button {...storyArgs} color="accent" variant="ghost">
          Reset
          <ArrowsRotateLeft />
        </Button>
      </Flex>

      <Flex align="center" gap="md" flex={1}>
        <Button {...storyArgs} color="accent" variant="solid" isFullWidth>
          <ArrowRightFromSquare />
          Sign out
        </Button>
      </Flex>

      <Flex align="center" gap="md" flex={1}>
        <Button {...storyArgs} color="accent" variant="outline" isFullWidth>
          <GoogleIcon />
          Continue With Google
        </Button>
      </Flex>
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

      <Button
        {...storyArgs}
        color="secondary"
        variant="outline"
        aria-label="Settings"
        isIconOnly
      >
        <Gear />
      </Button>
    </Flex>
  ),
};

export const RoundedFull: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `isRoundedFull` prop for a fully rounded button. Combine it with `isIconOnly` for a circle.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex align="center" gap="md">
      <Button {...storyArgs} isRoundedFull>
        Button
      </Button>

      <Button
        {...storyArgs}
        color="danger"
        aria-label="Settings"
        isRoundedFull
        isIconOnly
      >
        <TrashBin />
      </Button>
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

export const CustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Style the button with Tailwind CSS utility classes through `className`, such as a gradient background and hover or press effects.",
      },
    },
  },
  render: () => (
    <Button className="w-50 justify-between bg-linear-to-tr from-pink-500 to-red-500 transition hover:brightness-110 active:scale-95">
      Button
      <HeartFill />
    </Button>
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
    <a
      className="fri-button fri-button-primary fri-button-md"
      href="/?path=/docs/bases-actions-button--docs"
    >
      Button
    </a>
  ),
};
