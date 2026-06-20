import type { Meta, StoryObj } from "@storybook/react-vite";

import type { CSSProperties } from "react";

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
    asChild: {
      description:
        "Merge props onto the single child element instead of rendering a `<div>`, to keep semantic markup. Requires exactly one child element.",
      control: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
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
    <Grid {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const Columns: Story = {
  args: { cols: 4 },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
      <Boxes count={8} />
    </Grid>
  ),
};

export const Rows: Story = {
  args: { cols: 3, rows: 2 },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const Flow: Story = {
  args: { rows: 2, flow: "col" },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const Gap: Story = {
  args: { cols: 3, gap: "xl" },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
      <Boxes count={6} />
    </Grid>
  ),
};

export const WithItems: Story = {
  args: { cols: 4, gap: "sm" },
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

export const Responsive: Story = {
  args: { cols: "auto-fit", autoRows: "fr" },
  parameters: {
    docs: {
      description: {
        story:
          '`cols="auto-fit"` fits as many columns per row as will hold, each at least `--grid-min` wide (default `16rem`). Override the track width per instance with `style={{ "--grid-min": "…" }}`.',
      },
    },
  },
  render: (storyArgs) => {
    const responsiveStyle = { "--grid-min": "8rem" } as CSSProperties;

    return (
      <Grid {...storyArgs} style={responsiveStyle}>
        <Boxes count={10} />
      </Grid>
    );
  },
};

export const Inline: Story = {
  args: { cols: 3, inline: true },
  render: (storyArgs) => (
    <Grid {...storyArgs}>
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
    <Grid {...storyArgs}>
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

export const AsChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "With `asChild`, the grid classes merge onto the consumer's own element — here a semantic `<section>`. Requires exactly one child element.",
      },
    },
  },
  render: (storyArgs) => (
    <Grid {...storyArgs} asChild>
      <section aria-label="Gallery">
        <Boxes count={6} />
      </section>
    </Grid>
  ),
};
