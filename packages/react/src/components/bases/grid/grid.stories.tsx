import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ElementType } from "react";

import { Box } from "../../samples/box";
import { Boxes } from "../../samples/boxes";

import { Grid, GridItem } from ".";

const meta = {
  title: "Bases/Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "CSS Grid layout in one line. Set columns, rows, flow, and gap with named props.",
          "Use `GridItem` inside `Grid` when a child needs to span more than one column or row.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Grid, GridItem } from "@friday-sandbox/react";',
          "```",
          "",
          "## Anatomy",
          "",
          "```tsx",
          "<Grid>",
          "  <GridItem />",
          "</Grid>",
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    cols: 3,
    flow: "row",
    gap: "md",
  },
  argTypes: {
    cols: {
      description:
        "Use the `cols` prop to set the number of columns, or a responsive track with `auto-fit` / `auto-fill`.",
      control: "select",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "auto-fit", "auto-fill"],
      table: {
        type: { summary: "1 to 12 | auto-fit | auto-fill" },
        defaultValue: { summary: "1" },
      },
    },
    rows: {
      description: "Use the `rows` prop to set a fixed number of rows.",
      control: { type: "number", min: 1, max: 6 },
      options: [1, 2, 3, 4, 5, 6],
      table: { type: { summary: "1 | 2 | 3 | 4 | 5 | 6" } },
    },
    flow: {
      description: "Use the `flow` prop to control how items fill the grid.",
      control: "select",
      options: ["row", "col", "row-dense", "col-dense"],
      table: {
        type: { summary: "row | col | row-dense | col-dense" },
        defaultValue: { summary: "row" },
      },
    },
    gap: {
      description: "Use the `gap` prop to change the space between cells.",
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
      description: "Use the `inline` prop to render an inline-level grid.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    autoRows: {
      description: "Use the `autoRows` prop to size implicitly-created rows.",
      control: "select",
      options: ["auto", "min", "max", "fr"],
      table: { type: { summary: "auto | min | max | fr" } },
    },
    autoCols: {
      description:
        "Use the `autoCols` prop to size implicitly-created columns.",
      control: "select",
      options: ["auto", "min", "max", "fr"],
      table: { type: { summary: "auto | min | max | fr" } },
    },
    as: {
      description:
        "Use the `as` prop to render the grid as a different element.",
      control: "select",
      options: ["div", "section", "ul", "main", "article"],
      table: {
        type: { summary: "ElementType" },
        defaultValue: { summary: "div" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the grid.",
      control: "text",
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const Columns: Story = {
  args: { cols: 4 },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs}>
      <Boxes count={8} />
    </Grid>
  ),
};

export const Rows: Story = {
  args: { cols: 3, rows: 2 },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const Flow: Story = {
  args: { rows: 2, flow: "col" },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const Gap: Story = {
  args: { cols: 3, gap: "xl" },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const WithItems: Story = {
  args: { cols: 4, gap: "sm" },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs}>
      <GridItem colSpan={2}>
        <Box index={1} />
      </GridItem>

      <GridItem>
        <Box index={2} />
      </GridItem>

      <GridItem>
        <Box index={3} />
      </GridItem>

      <GridItem rowSpan={2}>
        <Box index={4} />
      </GridItem>

      <GridItem colSpan={3}>
        <Box index={5} />
      </GridItem>
    </Grid>
  ),
};

export const Inline: Story = {
  args: { cols: 3, inline: true },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const Placement: Story = {
  args: { cols: 4, rows: 3, gap: "sm" },
  parameters: {
    docs: {
      description: {
        story:
          'Use `colStart` / `colEnd` and `rowStart` / `rowEnd` to place an item on explicit grid lines, or `colSpan="full"` to span every column.',
      },
    },
  },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs}>
      <GridItem colEnd={3} colStart={1} rowEnd={3} rowStart={1}>
        <Box index={1} />
      </GridItem>

      <GridItem colEnd={5} colStart={3}>
        <Box index={2} />
      </GridItem>

      <GridItem colSpan="full">
        <Box index={3} />
      </GridItem>
    </Grid>
  ),
};

export const As: Story = {
  args: { as: "section" },
  parameters: {
    docs: {
      description: {
        story: "Use the `as` prop to render the grid as a different element.",
      },
    },
  },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs} aria-label="Gallery">
      <Boxes count={6} />
    </Grid>
  ),
};

export const AsList: Story = {
  args: { as: "ul", cols: 3, gap: "sm" },
  parameters: {
    docs: {
      description: {
        story:
          "The `as` prop is polymorphic on every part: render the grid as a `<ul>` and each item as a `<li>`.",
      },
    },
  },
  render: (storyArgs) => (
    <Grid<ElementType> {...storyArgs} aria-label="Gallery">
      <GridItem as="li">
        <Box index={1} />
      </GridItem>

      <GridItem as="li">
        <Box index={2} />
      </GridItem>

      <GridItem as="li">
        <Box index={3} />
      </GridItem>
    </Grid>
  ),
};
