import type { Meta, StoryObj } from "@storybook/react";
import TextArea from "./TextArea";

const meta: Meta<typeof TextArea> = {
  title: "Components/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "게시글 본문 등의 멀티라인 입력용 텍스트에어리어입니다. 라벨/도움말, 에러, 크기 조절을 지원합니다.",
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
    rounded: {
      control: "boolean",
    },
    width: {
      control: "text",
    },
    height: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Basic: Story = {
  args: {
    label: "내용",
    placeholder: "자유 게시판의 글을 작성하세요",
    helperText: "200자 이내로 작성하세요",
  },
};

export const CustomSize: Story = {
  args: {
    label: "내용",
    placeholder: "자유 게시판의 글을 작성하세요",
    width: "100%",
    height: 340,
  },
};

export const Error: Story = {
  args: {
    label: "내용",
    placeholder: "자유 게시판의 글을 작성하세요",
    errorText: "내용을 입력해주세요",
    isError: true,
  },
};
