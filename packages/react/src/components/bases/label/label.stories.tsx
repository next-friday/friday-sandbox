import { expect, userEvent } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Label } from ".";

const BASE_PROBE_STYLE = { fontSize: "40px" };

const meta = {
  title: "Bases/Forms/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Accessible form label with required, invalid, and disabled states.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Label } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          '<Label htmlFor="email">Email</Label>',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    children: "Email",
  },
  argTypes: {
    isRequired: {
      description:
        "Use the `isRequired` prop to append a danger-colored required marker.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isInvalid: {
      description:
        "Use the `isInvalid` prop to mark the label when its field fails validation.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      description:
        "Use the `isDisabled` prop to mute the label when its field is disabled.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the label.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => <Label {...storyArgs} />,
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('[data-slot="label"]');

    await expect(label).toBeInTheDocument();
    await expect(label?.tagName).toBe("LABEL");
  },
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Layer the `isRequired`, `isInvalid`, and `isDisabled` flags over the default resting label.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex direction="column" gap="md">
      <Label {...storyArgs}>Default</Label>

      <Label {...storyArgs} isRequired>
        Required
      </Label>

      <Label {...storyArgs} isInvalid>
        Invalid
      </Label>

      <Label {...storyArgs} isDisabled>
        Disabled
      </Label>
    </Flex>
  ),
};

export const WithInput: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Associate the label with a control through `htmlFor`, so clicking the label focuses its input.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex direction="column" gap="xs">
      <Label {...storyArgs} htmlFor="label-with-input">
        Email
      </Label>

      <input id="label-with-input" type="email" placeholder="you@example.com" />
    </Flex>
  ),
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector<HTMLElement>(
      '[data-slot="label"]',
    );
    const input =
      canvasElement.querySelector<HTMLInputElement>("#label-with-input");
    await expect(label).toBeTruthy();
    await expect(input).toBeTruthy();

    await userEvent.click(label!);
    await expect(input).toHaveFocus();
  },
};

export const CustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Style the label with Tailwind CSS utility classes through `className`, such as a custom color.",
      },
    },
  },
  render: () => <Label className="text-primary">Custom</Label>,
};

export const PlainHtml: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Apply the label styling to a plain label element, so a label renders in plain markup without the React component.",
      },
    },
  },
  render: () => (
    <Flex direction="column" gap="xs">
      <label className="fri-label" htmlFor="label-plain-html">
        Email
      </label>

      <input id="label-plain-html" type="email" />
    </Flex>
  ),
};

export const BaseClassDefault: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The base class on its own applies the label typography, so hand-written HTML needs no extra class for a usable default.",
      },
    },
  },
  render: () => (
    <div style={BASE_PROBE_STYLE}>
      <Flex direction="column" gap="xs">
        <span className="fri-label" data-testid="label-base-styled">
          Labeled
        </span>

        <span data-testid="label-base-unstyled">Unstyled</span>
      </Flex>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const styled = canvasElement.querySelector<HTMLElement>(
      '[data-testid="label-base-styled"]',
    );
    const unstyled = canvasElement.querySelector<HTMLElement>(
      '[data-testid="label-base-unstyled"]',
    );
    await expect(styled).toBeTruthy();
    await expect(unstyled).toBeTruthy();

    await expect(getComputedStyle(styled!).fontSize).not.toBe(
      getComputedStyle(unstyled!).fontSize,
    );
  },
};
