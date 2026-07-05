import { ArrowRightFromSquare } from "@gravity-ui/icons";
import { expect, fn, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Link, LinkIcon } from ".";

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

const DECORATIONS = [
  { value: "underline", label: "Underline" },
  { value: "plain", label: "Plain" },
] as const;

const meta = {
  title: "Bases/Navigation/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Accessible navigational link with keyboard support, plus hover, press, and focus states built in.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Link } from "@friday-sandbox/react";',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    children: "Link",
    variant: "inherit",
    decoration: "underline",
    isCurrent: false,
    isDisabled: false,
  },
  argTypes: {
    children: {
      description: "The content to display inside the link.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    href: {
      description:
        'The URL the link points to. With `href` the link renders an `<a>`; without it, a `<span role="link">`.',
      control: "text",
      table: { type: { summary: "string" } },
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
    decoration: {
      description:
        "Use the `decoration` prop to set the underline behavior. `underline` underlines at rest and hides on hover; `plain` has no underline at rest and shows one on hover.",
      control: "inline-radio",
      options: DECORATIONS.map((decoration) => decoration.value),
      table: {
        type: { summary: "underline | plain" },
        defaultValue: { summary: "underline" },
      },
    },
    isCurrent: {
      description:
        'Whether the link is the current page. Sets `aria-current="page"`.',
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      description: "Whether the link is disabled.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onPress: {
      description: "Handler that is called when the link is pressed.",
      action: "pressed",
    },
    className: {
      description: "Additional CSS classes to apply to the link.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onPress: fn() },
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Link" });

    await userEvent.tab();
    await expect(link).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(args.onPress).toHaveBeenCalled();
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
      <Link {...storyArgs} variant="display-xxl">
        Display XXL
      </Link>

      <Link {...storyArgs} variant="display-xl">
        Display XL
      </Link>

      <Link {...storyArgs} variant="display-lg">
        Display LG
      </Link>

      <Link {...storyArgs} variant="display-md">
        Display MD
      </Link>

      <Link {...storyArgs} variant="display-sm">
        Display SM
      </Link>

      <Link {...storyArgs} variant="body-lg">
        Body LG
      </Link>

      <Link {...storyArgs} variant="body-lg-strong">
        Body LG Strong
      </Link>

      <Link {...storyArgs} variant="body-md">
        Body MD
      </Link>

      <Link {...storyArgs} variant="body-md-strong">
        Body MD Strong
      </Link>

      <Link {...storyArgs} variant="body-sm">
        Body SM
      </Link>

      <Link {...storyArgs} variant="body-sm-strong">
        Body SM Strong
      </Link>

      <Link {...storyArgs} variant="body-xs">
        Body XS
      </Link>

      <Link {...storyArgs} variant="body-xs-strong">
        Body XS Strong
      </Link>

      <Link {...storyArgs} variant="label-lg">
        Label LG
      </Link>

      <Link {...storyArgs} variant="label-md">
        Label MD
      </Link>

      <Link {...storyArgs} variant="label-sm">
        Label SM
      </Link>

      <Link {...storyArgs} variant="caption">
        Caption
      </Link>

      <Link {...storyArgs} variant="caption-strong">
        Caption Strong
      </Link>

      <Link {...storyArgs} variant="code">
        Code
      </Link>
    </Flex>
  ),
};

export const Decoration: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `decoration` prop to set the underline behavior. Hover each link to see it invert.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex direction="column" gap="md">
      <Link {...storyArgs} href="#" decoration="underline">
        Underline at rest, hides on hover
      </Link>

      <Link {...storyArgs} href="#" decoration="plain">
        Plain at rest, underlines on hover
      </Link>
    </Flex>
  ),
};

export const Current: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `isCurrent` prop to mark the active page. It sets `aria-current="page"` and shows the focus ring.',
      },
    },
  },
  render: (storyArgs) => (
    <Link {...storyArgs} href="#" isCurrent>
      Current page
    </Link>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  parameters: {
    docs: {
      description: {
        story: "Use the `isDisabled` prop to disable the link.",
      },
    },
  },
  render: (storyArgs) => (
    <Link {...storyArgs} href="#">
      Unavailable
    </Link>
  ),
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add `Link.Icon` after the label for the default external-link glyph.",
      },
    },
  },
  render: (storyArgs) => (
    <Link
      {...storyArgs}
      href="https://example.com"
      target="_blank"
      rel="noreferrer"
    >
      Documentation
      <Link.Icon />
    </Link>
  ),
};

export const WithCustomIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: "Pass children to `LinkIcon` to replace the default glyph.",
      },
    },
  },
  render: (storyArgs) => (
    <Link
      {...storyArgs}
      href="https://example.com"
      target="_blank"
      rel="noreferrer"
    >
      External resource
      <LinkIcon>
        <ArrowRightFromSquare />
      </LinkIcon>
    </Link>
  ),
};
