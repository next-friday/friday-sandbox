import { type Meta, type StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { LongList } from "../../samples/long-list";
import { WideRow } from "../../samples/wide-row";

import { ScrollArea } from ".";

const meta = {
  title: "Layout/Primitives/ScrollArea",
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
          '  <ScrollArea.Scrollbar orientation="vertical">',
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
        "When the scrollbars are visible. `hover` only shows them on pointer hover; `always` keeps them visible.",
      control: "radio",
      options: ["hover", "always"],
      table: {
        type: { summary: "hover | always" },
        defaultValue: { summary: "hover" },
      },
    },
    scrollHideDelay: {
      description:
        "How long (in ms) the scrollbars stay visible after the user stops scrolling.",
      control: "number",
      table: { defaultValue: { summary: "600" } },
    },
    dir: {
      description:
        "Text direction. Use `rtl` for right-to-left languages so the scrollbars and corner sit correctly.",
      control: "radio",
      options: ["ltr", "rtl"],
      table: { type: { summary: "ltr | rtl" } },
    },
  },
} satisfies Meta<typeof ScrollArea.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (storyArgs) => (
    <ScrollArea.Root
      {...storyArgs}
      className="h-72 w-64 rounded-md border border-muted"
    >
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <LongList />
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
    <ScrollArea.Root
      {...storyArgs}
      className="w-96 rounded-md border border-muted"
    >
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
    <ScrollArea.Root
      {...storyArgs}
      className="h-72 w-96 rounded-md border border-muted"
    >
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div className="space-y-2 p-4">
            {Array.from({ length: 20 }, (_, position) => position + 1).map(
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
                      {rowIndex}-{columnIndex}
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
  args: { size: "lg" },
  render: (storyArgs) => (
    <ScrollArea.Root
      {...storyArgs}
      className="h-72 w-64 rounded-md border border-muted"
    >
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <LongList />
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};

export const Always: Story = {
  args: { variant: "always" },
  render: (storyArgs) => (
    <ScrollArea.Root
      {...storyArgs}
      className="h-72 w-64 rounded-md border border-muted"
    >
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <LongList />
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};
