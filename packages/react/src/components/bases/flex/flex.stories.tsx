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
        "Use the `direction` prop to change the flow direction of the children.",
      control: "radio",
      options: ["row", "column", "row-reverse", "column-reverse"],
      table: {
        type: { summary: "row | column | row-reverse | column-reverse" },
        defaultValue: { summary: "row" },
      },
    },
    align: {
      description:
        "Use the `align` prop to align the children on the cross axis.",
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
      table: {
        type: { summary: "start | center | end | stretch | baseline" },
        defaultValue: { summary: "stretch" },
      },
    },
    justify: {
      description:
        "Use the `justify` prop to distribute the children along the main axis.",
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      table: {
        type: { summary: "start | center | end | between | around | evenly" },
        defaultValue: { summary: "start" },
      },
    },
    wrap: {
      description:
        "Use the `wrap` prop to control whether the children wrap onto multiple lines.",
      control: "select",
      options: ["nowrap", "wrap", "wrap-reverse"],
      table: {
        type: { summary: "nowrap | wrap | wrap-reverse" },
        defaultValue: { summary: "nowrap" },
      },
    },
    gap: {
      description: "Use the `gap` prop to change the space between children.",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    gapX: {
      description: "Use the `gapX` prop to set the horizontal gap only.",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    gapY: {
      description: "Use the `gapY` prop to set the vertical gap only.",
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { type: { summary: "xs | sm | md | lg | xl" } },
    },
    inline: {
      description:
        "Use the `inline` prop to render an inline-level flex container.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    grow: {
      description:
        "Use the `grow` prop to let the container grow when it is itself a flex item.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    shrink: {
      description:
        "Use the `shrink` prop to control whether the container shrinks when it is itself a flex item.",
      control: "boolean",
      table: { type: { summary: "boolean" } },
    },
    basis: {
      description:
        "Use the `basis` prop to set the container's base size before growing or shrinking.",
      control: "radio",
      options: ["auto", "full", 0],
      table: { type: { summary: "auto | full | 0" } },
    },
    flex: {
      description:
        "Use the `flex` prop as a shorthand for grow, shrink, and basis together.",
      control: "select",
      options: [1, "auto", "initial", "none"],
      table: { type: { summary: "1 | auto | initial | none" } },
    },
    as: {
      description:
        "Use the `as` prop to render the container as a different element.",
      control: "select",
      options: ["div", "section", "nav", "ul", "article"],
      table: {
        type: { summary: "ElementType" },
        defaultValue: { summary: "div" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the container.",
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
          "Use the `grow`, `shrink`, and `basis` props to size the container when it is itself a flex item inside a parent Flex.",
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
          "Use `basis={0}` with `grow` for equal-width columns regardless of content.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs} className="w-80">
      <Flex basis={0} grow>
        <Boxes count={1} />
      </Flex>

      <Flex basis={0} grow>
        <Boxes count={1} />
      </Flex>
    </Flex>
  ),
};

export const FlexShorthand: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `flex` prop as a shorthand for grow, shrink, and basis. `flex={1}` gives each child an equal share of the space.",
      },
    },
  },
  render: () => (
    <Flex className="w-80" gap="md">
      <Flex flex={1}>
        <Boxes count={1} />
      </Flex>

      <Flex flex={1}>
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
          "Use the `as` prop to render the container as a different element while keeping its layout props.",
      },
    },
  },
  render: (storyArgs) => (
    <Flex<ElementType> {...storyArgs} aria-label="Primary">
      <Boxes count={3} />
    </Flex>
  ),
};
