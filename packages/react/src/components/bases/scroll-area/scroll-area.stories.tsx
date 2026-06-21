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
          "  <ScrollArea.Scrollbar />",
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
      description:
        "Scrollbar thickness. Pick a larger size if your users need easier-to-grab scrollbars (touch UIs).",
      control: "radio",
      options: ["xs", "sm", "md", "lg"],
      table: {
        type: { summary: "xs | sm | md | lg" },
        defaultValue: { summary: "md" },
      },
    },
    variant: {
      description:
        "When the scrollbars are visible. `hover` shows them on pointer hover; `always` keeps them visible; `hidden` removes them while the area still scrolls (wheel, touch, keyboard).",
      control: "radio",
      options: ["hover", "always", "hidden"],
      table: {
        type: { summary: "hover | always | hidden" },
        defaultValue: { summary: "hover" },
      },
    },
    scrollHideDelay: {
      description:
        "How long (in ms) the scrollbars stay visible after the user stops scrolling.",
      control: "number",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "600" },
      },
    },
    dir: {
      description:
        "Text direction. Use `rtl` for right-to-left languages so the scrollbars and corner sit correctly.",
      control: "radio",
      options: ["ltr", "rtl"],
      table: { type: { summary: "ltr | rtl" } },
    },
    asChild: {
      description:
        "Render as the child element instead of a `<div>`, merging props onto it (Radix composition).",
      control: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    nonce: {
      description: "CSP nonce applied to the injected inline styles.",
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
          <div className="space-y-2">
            {Array.from({ length: 12 }, (_, position) => position + 1).map(
              (rowIndex) => (
                <Flex gap="sm" key={rowIndex}>
                  {Array.from(
                    { length: 12 },
                    (_, position) => position + 1,
                  ).map((columnIndex) => (
                    <div
                      className="w-24 shrink-0 rounded-md bg-muted px-3 py-2 text-sm text-foreground"
                      key={columnIndex}
                    >
                      Item {rowIndex}-{columnIndex}
                    </div>
                  ))}
                </Flex>
              ),
            )}
          </div>
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
  render: (storyArgs) => (
    <Flex align="start" gap="md">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Flex direction="column" gap="md" key={size}>
          <span className="text-sm font-medium">Size {size}</span>

          <ScrollArea.Root {...storyArgs} className="h-72" size={size}>
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
        </Flex>
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
