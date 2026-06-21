import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ElementType } from "react";

import { Boxes } from "../../samples/boxes";

import { Flex } from ".";

const meta = {
  title: "Bases/Layout/Flex",
  component: Flex,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Flexbox layout in one line. Set direction, alignment, distribution, wrapping, and gap with named props instead of class strings.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Flex } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          "<Flex />",
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    direction: "row",
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
    gap: "md",
  },
  argTypes: {
    direction: {
      description:
        "Flow direction. `row` lays children left-to-right; `column` stacks them top-to-bottom.",
      control: "radio",
      options: ["row", "column", "row-reverse", "column-reverse"],
      table: {
        type: { summary: "row | column | row-reverse | column-reverse" },
        defaultValue: { summary: "row" },
      },
    },
    align: {
      description:
        "How children line up across the layout — top, center, bottom (or left/center/right when direction is `column`).",
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
      table: {
        type: { summary: "start | center | end | stretch | baseline" },
        defaultValue: { summary: "stretch" },
      },
    },
    justify: {
      description:
        "How children spread out along the flow. `between` pushes them to the edges with equal space in the middle.",
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      table: {
        type: { summary: "start | center | end | between | around | evenly" },
        defaultValue: { summary: "start" },
      },
    },
    wrap: {
      description:
        "Whether children wrap to a new line when they run out of room.",
      control: "select",
      options: ["nowrap", "wrap", "wrap-reverse"],
      table: {
        type: { summary: "nowrap | wrap | wrap-reverse" },
        defaultValue: { summary: "nowrap" },
      },
    },
    gap: {
      description:
        "Space between children. Five-step scale from `xs` (tight) to `xl` (roomy).",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    gapX: {
      description:
        "Horizontal gap only. Use this to override `gap` on one axis.",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    gapY: {
      description: "Vertical gap only. Use this to override `gap` on one axis.",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    inline: {
      description:
        "Render as an inline-level flex container (`inline-flex`) instead of block-level.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    grow: {
      description:
        "Flex-grow of the Flex root itself — set when a Flex is also a flex item inside a parent Flex. `true` fills the remaining space, `false` holds its base size.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    shrink: {
      description:
        "Flex-shrink of the Flex root itself. `false` stops it from shrinking below its content.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    basis: {
      description:
        "Flex-basis of the Flex root itself — its starting main size before grow and shrink apply.",
      control: "radio",
      options: ["auto", "full", 0],
      table: { type: { summary: "auto | full | 0" } },
    },
    as: {
      description:
        "Render the Flex as a different element (`section`, `nav`, `ul`, …) instead of the default `<div>`, keeping semantic markup.",
      control: "select",
      options: ["div", "section", "nav", "ul", "article"],
      table: {
        type: { summary: "ElementType" },
        defaultValue: { summary: "div" },
      },
    },
    className: {
      description: "Extra Tailwind classes appended after the variant classes.",
      control: "text",
    },
  },
} satisfies Meta<typeof Flex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};

export const Direction: Story = {
  args: { direction: "column" },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};

export const Align: Story = {
  args: { align: "center" },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs} className="h-32">
      <Boxes count={3} />
    </Flex>
  ),
};

export const Justify: Story = {
  args: { justify: "between" },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};

export const Wrap: Story = {
  args: { wrap: "wrap", gap: "sm" },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs} className="w-64">
      <Boxes count={10} />
    </Flex>
  ),
};

export const Gap: Story = {
  args: { gap: "xl" },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};

export const Inline: Story = {
  args: { inline: true },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs}>
      <Boxes count={3} />
    </Flex>
  ),
};

export const Grow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`grow`, `shrink`, and `basis` apply to the Flex root itself, useful when a Flex is also a flex item inside a parent Flex. Here the first item grows to fill the remaining space.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs}>
      <Flex grow>
        <Boxes count={1} />
      </Flex>

      <Boxes count={1} />
    </Flex>
  ),
};

export const Basis: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`basis={0}` with `grow` on each item gives equal-width columns regardless of content.",
      },
    },
  },
  render: () => (
    <Flex className="w-80" gap="md">
      <Flex basis={0} grow>
        <Boxes count={1} />
      </Flex>

      <Flex basis={0} grow>
        <Boxes count={1} />
      </Flex>
    </Flex>
  ),
};

export const As: Story = {
  args: { as: "nav" },
  parameters: {
    docs: {
      description: {
        story:
          "`as` renders the Flex as a different element — here a semantic `<nav>` — instead of a generic `<div>`. The variant classes and props land on the chosen tag.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs} aria-label="Primary">
      <Boxes count={3} />
    </Flex>
  ),
};
