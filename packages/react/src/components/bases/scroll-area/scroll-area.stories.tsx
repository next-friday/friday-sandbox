import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Lorem } from "../../samples/lorem";
import { WideRow } from "../../samples/wide-row";

import { ScrollArea } from ".";

const meta = {
  title: "Bases/Layout/ScrollArea",
  component: ScrollArea.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Scrollable container with custom scrollbars that match your theme. Put your scrollable content inside `ScrollArea.Viewport > ScrollArea.Content`, and pick which scrollbars to show by adding `ScrollArea.Scrollbar` for each direction.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { ScrollArea } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          "<ScrollArea.Root>",
          "  <ScrollArea.Viewport>",
          "    <ScrollArea.Content />",
          "  </ScrollArea.Viewport>",
          "  <ScrollArea.Scrollbar>",
          "    <ScrollArea.Thumb />",
          "  </ScrollArea.Scrollbar>",
          "  <ScrollArea.Corner />",
          "</ScrollArea.Root>",
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    size: "md",
    variant: "hover",
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
  },
} satisfies Meta<typeof ScrollArea.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => (
    <ScrollArea.Root {...storyArgs} className="h-72">
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <Lorem paragraph={9} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};

export const Horizontal: Story = {
  render: (storyArgs) => (
    <ScrollArea.Root {...storyArgs} className="w-96">
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <WideRow />
        </ScrollArea.Content>
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
        <ScrollArea.Content>
          <Flex direction="column" gap="sm">
            {Array.from({ length: 12 }, (_, position) => position + 1).map(
              (rowIndex) => (
                <WideRow count={12} key={rowIndex} />
              ),
            )}
          </Flex>
        </ScrollArea.Content>
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

export const Size: Story = {
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
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <ScrollArea.Root key={size} {...storyArgs} className="h-72" size={size}>
          <ScrollArea.Viewport>
            <ScrollArea.Content>
              <Lorem paragraph={9} />
            </ScrollArea.Content>
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>

          <ScrollArea.Corner />
        </ScrollArea.Root>
      ))}
    </Flex>
  ),
};

export const Always: Story = {
  args: { variant: "always" },
  render: (storyArgs) => (
    <ScrollArea.Root {...storyArgs} className="h-72">
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <Lorem paragraph={9} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};

export const HiddenScrollbar: Story = {
  args: { variant: "hidden" },
  parameters: {
    docs: {
      description: {
        story:
          "The scrollbar is hidden, but the area still scrolls with wheel, touch, and keyboard.",
      },
    },
  },
  render: (storyArgs) => (
    <ScrollArea.Root {...storyArgs} className="h-72">
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <Lorem paragraph={9} />
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};
