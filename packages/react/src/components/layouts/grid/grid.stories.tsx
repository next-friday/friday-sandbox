import { type Meta, type StoryObj } from "@storybook/react-vite";

import { Box } from "../../samples/box";

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
          'import { type GridProps, type GridItemProps } from "@friday-sandbox/react";',
          "```",
          "",
          "Add the stylesheet once at the top of your app:",
          "",
          "```css",
          '@import "@friday-sandbox/styles";',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    columns: 3,
    flow: "row",
    gap: "md",
  },
  argTypes: {
    columns: {
      description: "How many columns the grid has — 1 through 12.",
      control: { type: "number", min: 1, max: 12 },
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      table: {
        type: { summary: "1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12" },
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
    <Grid {...storyArgs}>
      <Box index={1} />
      <Box index={2} />
      <Box index={3} />
      <Box index={4} />
      <Box index={5} />
      <Box index={6} />
    </Grid>
  ),
};

export const Columns: Story = {
  args: { columns: 4 },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
      <Box index={1} />
      <Box index={2} />
      <Box index={3} />
      <Box index={4} />
      <Box index={5} />
      <Box index={6} />
      <Box index={7} />
      <Box index={8} />
    </Grid>
  ),
};

export const Rows: Story = {
  args: { columns: 3, rows: 2 },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
      <Box index={1} />
      <Box index={2} />
      <Box index={3} />
      <Box index={4} />
      <Box index={5} />
      <Box index={6} />
    </Grid>
  ),
};

export const Flow: Story = {
  args: { rows: 2, flow: "col" },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
      <Box index={1} />
      <Box index={2} />
      <Box index={3} />
      <Box index={4} />
      <Box index={5} />
      <Box index={6} />
    </Grid>
  ),
};

export const Gap: Story = {
  args: { columns: 3, gap: "xl" },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
      <Box index={1} />
      <Box index={2} />
      <Box index={3} />
      <Box index={4} />
      <Box index={5} />
      <Box index={6} />
    </Grid>
  ),
};

export const WithItems: Story = {
  args: { columns: 4, gap: "sm" },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
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
