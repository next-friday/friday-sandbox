import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from ".";

const variants = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
] as const;

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Base/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Accessible button built on `react-aria-components` Button + `@friday-sandbox/styles` tokens.",
          "Variant props (`variant`, `size`) compose `fri-button*` classes through tailwind-variants.",
          "Behavior props (`isDisabled`, `isPending`, `autoFocus`, `onPress`) come from react-aria.",
          "",
          "## Import",
          "",
          "```tsx",
          'import { Button } from "@friday-sandbox/react";',
          'import { type ButtonProps } from "@friday-sandbox/react";',
          "```",
          "",
          "Stylesheet (once per app):",
          "",
          "```css",
          '@import "@friday-sandbox/styles";',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    isDisabled: false,
    isPending: false,
    autoFocus: false,
  },
  argTypes: {
    children: {
      description: "Visible label or icon content rendered inside the button.",
      control: "text",
      table: { type: { summary: "ReactNode" } },
    },
    variant: {
      description:
        "Semantic color variant from `@friday-sandbox/styles`. Maps to `fri-button-<variant>` class.",
      control: "select",
      options: variants,
      table: {
        type: { summary: variants.join(" | ") },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      description:
        "Action-rhythm height. Computed as `calc(var(--size-action) * N)` where N is 6/8/10/12/14 for xs/sm/md/lg/xl (24 / 32 / 40 / 48 / 56 px at default base).",
      control: "radio",
      options: sizes,
      table: {
        type: { summary: sizes.join(" | ") },
        defaultValue: { summary: "md" },
      },
    },
    isDisabled: {
      description: "Disables interaction. Forwarded to react-aria.",
      control: "boolean",
    },
    isPending: {
      description:
        "Shows pending indicator and disables interaction. `children` are replaced via `composePendingChildren`.",
      control: "boolean",
    },
    autoFocus: {
      description: "Focuses the button on mount.",
      control: "boolean",
    },
    onPress: {
      description: "react-aria press handler. Use instead of `onClick`.",
      action: "pressed",
    },
    className: {
      description:
        "Extra Tailwind classes. Merged after variant classes; use to override layout or spacing.",
      control: "text",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: "One button per semantic variant at default size.",
      },
    },
  },
  render: (storyArgs) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Button key={variant} {...storyArgs} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Size rhythm xs → xl. Rendered in mobile viewport to verify touch-target heights.",
      },
    },
  },
  render: (storyArgs) => (
    <div className="flex flex-wrap items-center gap-2">
      {sizes.map((size) => (
        <Button key={size} {...storyArgs} size={size}>
          Button
        </Button>
      ))}
    </div>
  ),
};

export const PlainHtml: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Proof that `@friday-sandbox/styles` works on a raw `<button>` element without the React wrapper. " +
          "Compose `fri-button` with explicit color (`fri-button-primary`) and size (`fri-button-md`) classes.",
      },
    },
  },
  render: () => (
    <a className="fri-button fri-button-primary fri-button-md" href="/">
      Button
    </a>
  ),
};
