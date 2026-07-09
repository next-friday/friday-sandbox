import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";
import { Text } from "../text";

import { Lorem } from "../../../samples/lorem";
import { WideRow } from "../../../samples/wide-row";

import { ScrollArea } from ".";

const meta = {
  title: "Bases/Layout/ScrollArea",
  component: ScrollArea.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Scrollable container with custom scrollbars that match your theme. Put your scrollable content inside `ScrollArea.Viewport`, and pick which scrollbars to show by adding `ScrollArea.Scrollbar` for each direction.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { ScrollArea } from "@friday-sandbox/react";',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      description: "Use the `size` prop to change the scrollbar thickness.",
      control: "radio",
      options: ["xs", "sm", "md", "lg"],
      table: {
        type: { summary: "xs | sm | md | lg" },
        defaultValue: { summary: "md" },
      },
    },
    variant: {
      description:
        "Use the `variant` prop to change when the scrollbars are visible.",
      control: "radio",
      options: ["hover", "always", "hidden"],
      table: {
        type: { summary: "hover | always | hidden" },
        defaultValue: { summary: "hover" },
      },
    },
    scrollHideDelay: {
      description:
        "Use the `scrollHideDelay` prop to set how long the scrollbars stay visible after scrolling stops. Left unset, it falls back to the underlying scroll primitive's own default.",
      control: "number",
      table: { type: { summary: "number" } },
    },
    dir: {
      description: "Use the `dir` prop to set the text direction.",
      control: "radio",
      options: ["ltr", "rtl"],
      table: { type: { summary: "ltr | rtl" } },
    },
    asChild: {
      description:
        "Use the `asChild` prop to merge props onto the child element instead of rendering a default element.",
      control: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    nonce: {
      description:
        "Use the `nonce` prop to set a CSP nonce on the injected inline styles.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    className: {
      description: "Additional CSS classes to apply to the scroll area.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof ScrollArea.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => (
    <ScrollArea.Root {...storyArgs} className="h-72">
      <ScrollArea.Viewport>
        <Lorem paragraph={9} />
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
  play: async ({ canvasElement }) => {
    const scrollArea = canvasElement.querySelector('[data-slot="scroll-area"]');

    await expect(scrollArea).toBeInTheDocument();
  },
};

export const Horizontal: Story = {
  render: (storyArgs) => (
    <ScrollArea.Root {...storyArgs} className="w-96">
      <ScrollArea.Viewport>
        <WideRow />
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};

export const Both: Story = {
  render: (storyArgs) => (
    <ScrollArea.Root {...storyArgs} className="h-72">
      <ScrollArea.Viewport>
        <WideRow count={12} rows={12} />
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `size` prop to change the scrollbar thickness. The columns step through each size from thin to thick.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex align="start" gap="md">
      <ScrollArea.Root {...storyArgs} className="h-72" size="xs">
        <ScrollArea.Viewport>
          <Lorem paragraph={9} />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </ScrollArea.Root>

      <ScrollArea.Root {...storyArgs} className="h-72" size="sm">
        <ScrollArea.Viewport>
          <Lorem paragraph={9} />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </ScrollArea.Root>

      <ScrollArea.Root {...storyArgs} className="h-72" size="md">
        <ScrollArea.Viewport>
          <Lorem paragraph={9} />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </ScrollArea.Root>

      <ScrollArea.Root {...storyArgs} className="h-72" size="lg">
        <ScrollArea.Viewport>
          <Lorem paragraph={9} />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </ScrollArea.Root>
    </Flex>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `variant` prop to change when the scrollbars are visible: `hover` shows them while the pointer is over the area, `always` keeps them visible, and `hidden` removes them while the area still scrolls with wheel, touch, and keyboard.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex align="start" gap="md">
      <Flex direction="column" gap="sm">
        <Text variant="label-md">Hover</Text>

        <ScrollArea.Root {...storyArgs} className="h-72" variant="hover">
          <ScrollArea.Viewport>
            <Lorem paragraph={9} />
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>

          <ScrollArea.Corner />
        </ScrollArea.Root>
      </Flex>

      <Flex direction="column" gap="sm">
        <Text variant="label-md">Always</Text>

        <ScrollArea.Root {...storyArgs} className="h-72" variant="always">
          <ScrollArea.Viewport>
            <Lorem paragraph={9} />
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>

          <ScrollArea.Corner />
        </ScrollArea.Root>
      </Flex>

      <Flex direction="column" gap="sm">
        <Text variant="label-md">Hidden</Text>

        <ScrollArea.Root {...storyArgs} className="h-72" variant="hidden">
          <ScrollArea.Viewport>
            <Lorem paragraph={9} />
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>

          <ScrollArea.Corner />
        </ScrollArea.Root>
      </Flex>
    </Flex>
  ),
};

export const AsChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `asChild` prop to render the scroll area as your own element, such as a `<section>`, instead of the default `<div>`. Your element receives the scroll area's props and behavior.",
      },
    },
  },
  render: (storyArgs) => (
    <ScrollArea.Root {...storyArgs} className="h-72" asChild>
      <section aria-label="Release notes">
        <ScrollArea.Viewport>
          <Lorem paragraph={9} />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </section>
    </ScrollArea.Root>
  ),
  play: async ({ canvasElement }) => {
    const scrollArea = canvasElement.querySelector('[data-slot="scroll-area"]');

    await expect(scrollArea?.tagName).toBe("SECTION");
  },
};

export const CustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Style the scroll area with Tailwind CSS utility classes through `className`, such as a rounded border around the viewport.",
      },
    },
  },
  render: () => (
    <ScrollArea.Root className="h-72 rounded-box border border-border p-4">
      <ScrollArea.Viewport>
        <Lorem paragraph={9} />
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};
