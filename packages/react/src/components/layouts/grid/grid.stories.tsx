import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ElementType } from "react";

import { Box } from "../../samples/box";
import { Boxes } from "../../samples/boxes";

import { Grid, GridItem } from ".";

const meta = {
  title: "Layout/Primitives/Grid",
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
        "Column count 1 through 12, or `auto-fit` / `auto-fill` for a responsive grid whose track width comes from the `--grid-min` token.",
      control: "select",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "auto-fit", "auto-fill"],
      table: {
        type: { summary: "1 … 12 | auto-fit | auto-fill" },
        defaultValue: { summary: "1" },
      },
    },
    rows: {
      description:
        "Fixed row count, 1 through 6. Leave empty to let the grid grow automatically.",
      control: { type: "number", min: 1, max: 6 },
      options: [1, 2, 3, 4, 5, 6],
      table: { type: { summary: "1 | 2 | 3 | 4 | 5 | 6" } },
    },
    flow: {
      description:
        "How extra items fill the grid. `row` fills left-to-right; `col` fills top-to-bottom; `dense` variants backfill earlier gaps.",
      control: "select",
      options: ["row", "col", "row-dense", "col-dense"],
      table: {
        type: { summary: "row | col | row-dense | col-dense" },
        defaultValue: { summary: "row" },
      },
    },
    gap: {
      description:
        "Space between cells. Five-step scale from `xs` (tight) to `xl` (roomy).",
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
        "Render as an inline-level grid (`inline-grid`) instead of block-level.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    autoRows: {
      description:
        "Size of implicitly-created rows. `fr` makes them share leftover space evenly.",
      control: "select",
      options: ["auto", "min", "max", "fr"],
      table: { type: { summary: "auto | min | max | fr" } },
    },
    autoCols: {
      description: "Size of implicitly-created columns.",
      control: "select",
      options: ["auto", "min", "max", "fr"],
      table: { type: { summary: "auto | min | max | fr" } },
    },
    as: {
      description:
        "Render the Grid as a different element (`section`, `ul`, …) instead of the default `<div>`, keeping semantic markup.",
      control: "select",
      options: ["div", "section", "ul", "main", "article"],
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
          '`colStart`/`colEnd` and `rowStart`/`rowEnd` place an item on explicit grid lines instead of spanning. `colSpan="full"` stretches across every column.',
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
        story:
          "`as` renders the Grid as a different element — here a semantic `<section>` — instead of a generic `<div>`.",
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
          "`as` is polymorphic on every part: render the Grid as a `<ul>` and each GridItem as a `<li>` for a semantic list that still lays out on the grid.",
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
