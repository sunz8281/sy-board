import type { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "기본 인풋과 라벨/도움말을 포함한 텍스트 필드를 제공합니다. 상태(`default`/`error`), 비활성화, 우측 아이콘을 지원합니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    isError: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    rightIcon: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "자유 게시판의 글을 검색하세요",
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: "자유 게시판의 글을 검색하세요",
    rightIcon: <span aria-hidden>🔍</span>,
  },
};

export const Error: Story = {
  args: {
    placeholder: "자유 게시판의 글을 검색하세요",
    isError: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "자유 게시판의 글을 검색하세요",
    disabled: true,
  },
};

export const TextFieldWithLabel: Story = {
  render: (args) => (
    <div className="w-full">
      <Input label="검색" helperText="키워드를 입력하세요" placeholder="자유 게시판의 글을 검색하세요" {...args} />
    </div>
  ),
};
