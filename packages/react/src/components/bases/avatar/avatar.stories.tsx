import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "../flex";

import { Avatar } from ".";

const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
const SHAPES = ["square", "radius", "full"] as const;

const AVATAR_SRC =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMjgnIGhlaWdodD0nMTI4Jz48cmVjdCB3aWR0aD0nMTI4JyBoZWlnaHQ9JzEyOCcgZmlsbD0nIzRmNDZlNScvPjwvc3ZnPg==";
const BROKEN_SRC = "data:image/png;base64,broken";

const meta = {
  title: "Bases/Media/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      description: "Use the `size` prop to set the avatar diameter.",
      control: "select",
      options: SIZES,
      table: {
        type: { summary: SIZES.join(" | ") },
        defaultValue: { summary: "md" },
      },
    },
    shape: {
      description:
        "Use the `shape` prop to set the corner: a `full` circle, a size-scaled `radius`, or `square`.",
      control: "radio",
      options: SHAPES,
      table: {
        type: { summary: SHAPES.join(" | ") },
        defaultValue: { summary: "full" },
      },
    },
    isDisabled: {
      description: "Set `isDisabled` to dim an inactive avatar.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    className: {
      description: "Additional CSS classes to apply to the avatar.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (storyArgs) => (
    <Avatar {...storyArgs}>
      <Avatar.Image alt="Avatar" src={AVATAR_SRC} />
      <Avatar.Fallback>AV</Avatar.Fallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector('[data-slot="avatar"]');

    await expect(element).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `size` prop to set the diameter, from `xs` (24px) to `2xl` (112px).",
      },
    },
  },
  render: () => (
    <Flex align="center" gap="md">
      <Avatar size="xs">
        <Avatar.Fallback>XS</Avatar.Fallback>
      </Avatar>

      <Avatar size="sm">
        <Avatar.Fallback>SM</Avatar.Fallback>
      </Avatar>

      <Avatar size="md">
        <Avatar.Fallback>MD</Avatar.Fallback>
      </Avatar>

      <Avatar size="lg">
        <Avatar.Fallback>LG</Avatar.Fallback>
      </Avatar>

      <Avatar size="xl">
        <Avatar.Fallback>XL</Avatar.Fallback>
      </Avatar>

      <Avatar size="2xl">
        <Avatar.Fallback>2XL</Avatar.Fallback>
      </Avatar>
    </Flex>
  ),
};

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Overlap avatars with `Avatar.Group`. `size` cascades to the children, `ring` (default on) separates them, `stacking` sets the paint order, and a trailing `+N` avatar is composed by hand.",
      },
    },
  },
  render: () => (
    <Flex direction="column" gap="lg">
      <Avatar.Group size="lg">
        <Avatar>
          <Avatar.Image alt="A" src={AVATAR_SRC} />
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar>

        <Avatar>
          <Avatar.Image alt="B" src={AVATAR_SRC} />
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar>

        <Avatar>
          <Avatar.Image alt="C" src={AVATAR_SRC} />
          <Avatar.Fallback>C</Avatar.Fallback>
        </Avatar>

        <Avatar>
          <Avatar.Fallback>+5</Avatar.Fallback>
        </Avatar>
      </Avatar.Group>

      <Avatar.Group ring={false}>
        <Avatar>
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar>

        <Avatar>
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar>

        <Avatar>
          <Avatar.Fallback>C</Avatar.Fallback>
        </Avatar>
      </Avatar.Group>

      <Avatar.Group stacking="first-on-top">
        <Avatar>
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar>

        <Avatar>
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar>

        <Avatar>
          <Avatar.Fallback>C</Avatar.Fallback>
        </Avatar>
      </Avatar.Group>
    </Flex>
  ),
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="avatar-group"]',
    );
    const cascadeGroup = groups[0]!;
    const firstOnTopGroup = groups[2]!;

    const cascadeChild = cascadeGroup.querySelector<HTMLElement>(
      '[data-slot="avatar"]',
    )!;
    await expect(
      getComputedStyle(cascadeChild).getPropertyValue("--avatar-units").trim(),
    ).toBe("16");

    const stackedChildren = [
      ...firstOnTopGroup.querySelectorAll<HTMLElement>('[data-slot="avatar"]'),
    ];
    const firstZ = Number(getComputedStyle(stackedChildren[0]!).zIndex);
    const lastZ = Number(getComputedStyle(stackedChildren.at(-1)!).zIndex);
    await expect(firstZ).toBeGreaterThan(lastZ);
  },
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `shape` prop: `square`, a size-scaled `radius`, or a `full` circle.",
      },
    },
  },
  render: () => (
    <Flex align="center" gap="md">
      <Avatar shape="square">
        <Avatar.Image alt="Square" src={AVATAR_SRC} />
        <Avatar.Fallback>SQ</Avatar.Fallback>
      </Avatar>

      <Avatar shape="radius">
        <Avatar.Image alt="Radius" src={AVATAR_SRC} />
        <Avatar.Fallback>RA</Avatar.Fallback>
      </Avatar>

      <Avatar shape="full">
        <Avatar.Image alt="Full" src={AVATAR_SRC} />
        <Avatar.Fallback>FU</Avatar.Fallback>
      </Avatar>
    </Flex>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: "Set `isDisabled` to dim an inactive avatar.",
      },
    },
  },
  render: () => (
    <Flex align="center" gap="md">
      <Avatar>
        <Avatar.Fallback>ON</Avatar.Fallback>
      </Avatar>

      <Avatar isDisabled>
        <Avatar.Fallback>OFF</Avatar.Fallback>
      </Avatar>
    </Flex>
  ),
};

export const Fallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`Avatar.Fallback` renders when no image is set or the image fails to load. Pass initials or custom content as children, and use `delayMs` to avoid a flash on a fast connection.",
      },
    },
  },
  render: () => (
    <Flex align="center" gap="md">
      <Avatar>
        <Avatar.Image alt="Loaded" src={AVATAR_SRC} />
        <Avatar.Fallback>IM</Avatar.Fallback>
      </Avatar>

      <Avatar>
        <Avatar.Fallback>AV</Avatar.Fallback>
      </Avatar>

      <Avatar>
        <Avatar.Image alt="Broken" src={BROKEN_SRC} />
        <Avatar.Fallback delayMs={300}>BR</Avatar.Fallback>
      </Avatar>
    </Flex>
  ),
};
