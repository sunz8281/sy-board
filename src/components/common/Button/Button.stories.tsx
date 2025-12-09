import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "grayscale", "outlined"],
    },
    size: {
      control: "select",
      options: ["big", "small"],
    },
    disabled: {
      control: "boolean",
    },
    rounded: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary",
  },
};

export const Outline: Story = {
  args: {
    variant: "outlined",
    children: "Outlined",
  },
};

export const GrayScale: Story = {
  args: {
    variant: "grayscale",
    children: "GrayScale",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "big",
    children: "Big",
  },
};

export const RoundedFalse: Story = {
  args: {
    rounded: false,
    children: "Square",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};
