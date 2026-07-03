import {
  ArrowRightFromSquare,
  ArrowsRotateLeft,
  Envelope,
  FloppyDisk,
  Gear,
  HeartFill,
  TrashBin,
  Person,
} from "@gravity-ui/icons";
import { expect, fn, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";
import { GoogleIcon } from "../../icons";
import { COLORS, SIZES } from "../../samples/story-constants";

import { Button } from ".";

const VARIANTS = [
  { value: "solid", label: "Solid" },
  { value: "subtle", label: "Subtle" },
  { value: "surface", label: "Surface" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost" },
  { value: "plain", label: "Plain" },
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
    isFullWidth: false,
    isRoundedFull: false,
    isIconOnly: false,
    isPending: false,
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
    isIconOnly: {
      description:
        "Whether the button should display only an icon. Provide an `aria-label` so the action is announced to assistive technologies.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isPending: {
      description:
        "Use the `isPending` prop to show a spinner and block interaction while an action is in progress.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onPress: {
      description: "Handler that is called when the button is pressed.",
      action: "pressed",
    },
    className: {
      description: "Additional CSS classes to apply to the button.",
      control: "text",
      table: { type: { summary: "string" } },
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
      <Button {...storyArgs} variant="solid">
        Solid
      </Button>

      <Button {...storyArgs} variant="subtle">
        Subtle
      </Button>

      <Button {...storyArgs} variant="surface">
        Surface
      </Button>

      <Button {...storyArgs} variant="outline">
        Outline
      </Button>

      <Button {...storyArgs} variant="ghost">
        Ghost
      </Button>

      <Button {...storyArgs} variant="plain">
        Plain
      </Button>
    </Flex>
  ),
};

export const Primary: Story = {
  parameters: {
    docs: {
      description: { story: "The `primary` color across every variant." },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      {VARIANTS.map((variant) => (
        <Button
          key={variant.value}
          {...storyArgs}
          color="primary"
          variant={variant.value}
        >
          {variant.label}
        </Button>
      ))}
    </Flex>
  ),
};

export const Secondary: Story = {
  parameters: {
    docs: {
      description: { story: "The `secondary` color across every variant." },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      {VARIANTS.map((variant) => (
        <Button
          key={variant.value}
          {...storyArgs}
          color="secondary"
          variant={variant.value}
        >
          {variant.label}
        </Button>
      ))}
    </Flex>
  ),
};

export const Accent: Story = {
  parameters: {
    docs: {
      description: { story: "The `accent` color across every variant." },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      {VARIANTS.map((variant) => (
        <Button
          key={variant.value}
          {...storyArgs}
          color="accent"
          variant={variant.value}
        >
          {variant.label}
        </Button>
      ))}
    </Flex>
  ),
};

export const Info: Story = {
  parameters: {
    docs: {
      description: { story: "The `info` color across every variant." },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      {VARIANTS.map((variant) => (
        <Button
          key={variant.value}
          {...storyArgs}
          color="info"
          variant={variant.value}
        >
          {variant.label}
        </Button>
      ))}
    </Flex>
  ),
};

export const Success: Story = {
  parameters: {
    docs: {
      description: { story: "The `success` color across every variant." },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      {VARIANTS.map((variant) => (
        <Button
          key={variant.value}
          {...storyArgs}
          color="success"
          variant={variant.value}
        >
          {variant.label}
        </Button>
      ))}
    </Flex>
  ),
};

export const Warning: Story = {
  parameters: {
    docs: {
      description: { story: "The `warning` color across every variant." },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      {VARIANTS.map((variant) => (
        <Button
          key={variant.value}
          {...storyArgs}
          color="warning"
          variant={variant.value}
        >
          {variant.label}
        </Button>
      ))}
    </Flex>
  ),
};

export const Danger: Story = {
  parameters: {
    docs: {
      description: { story: "The `danger` color across every variant." },
    },
  },
  render: (storyArgs) => (
    <Flex wrap="wrap" align="center" gap="md">
      {VARIANTS.map((variant) => (
        <Button
          key={variant.value}
          {...storyArgs}
          color="danger"
          variant={variant.value}
        >
          {variant.label}
        </Button>
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
      <Button {...storyArgs} size="xs">
        Extra Small
      </Button>

      <Button {...storyArgs} size="sm">
        Small
      </Button>

      <Button {...storyArgs} size="md">
        Medium
      </Button>

      <Button {...storyArgs} size="lg">
        Large
      </Button>

      <Button {...storyArgs} size="xl">
        Extra Large
      </Button>
    </Flex>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  parameters: {
    docs: {
      description: {
        story: "Use the `isDisabled` prop to disable the button.",
      },
    },
  },
};

export const Pending: Story = {
  args: { isPending: true },
  parameters: {
    docs: {
      description: {
        story:
          "Use the `isPending` prop to show a spinner and block interaction while an action is in progress.",
      },
    },
  },
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

export const RoundedFull: Story = {
  args: { isRoundedFull: true },
  parameters: {
    docs: {
      description: {
        story:
          "Use the `isRoundedFull` prop for a fully rounded button. Combine it with `isIconOnly` for a circle.",
      },
    },
  },
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

      <Button {...storyArgs} color="danger" aria-label="Settings" isIconOnly>
        <Gear />
      </Button>

      <Button
        {...storyArgs}
        variant="outline"
        aria-label="Account"
        isIconOnly
        isRoundedFull
      >
        <Person />
      </Button>
    </Flex>
  ),
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
      <Flex wrap="wrap" align="center" gap="md">
        <Button {...storyArgs}>
          <Envelope />
          Email
        </Button>

        <Button {...storyArgs} color="danger">
          <TrashBin />
          Delete
        </Button>

        <Button {...storyArgs} color="accent" variant="ghost">
          Reset
          <ArrowsRotateLeft />
        </Button>
      </Flex>

      <Flex flex={1}>
        <Button {...storyArgs} color="accent" variant="solid" isFullWidth>
          <ArrowRightFromSquare />
          Sign out
        </Button>
      </Flex>

      <Flex flex={1}>
        <Button {...storyArgs} color="accent" variant="outline" isFullWidth>
          <GoogleIcon />
          Continue With Google
        </Button>
      </Flex>
    </Flex>
  ),
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
