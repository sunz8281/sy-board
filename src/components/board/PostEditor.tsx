'use client';

import { FormEvent, useMemo, useState } from "react";
import Input from "@comp/common/Input/Input";
import { Button } from "@comp/common/Button/Button";

type EditorMode = "create" | "edit";

type PostEditorProps = {
  mode: EditorMode;
  activeCategory?: number;
  initialTitle?: string;
  initialContent?: string;
};

const categoryOptions = [
  { id: 0, label: "전체게시판" },
  { id: 1, label: "자유게시판" },
  { id: 2, label: "비밀게시판" },
  { id: 3, label: "졸업생게시판" },
  { id: 4, label: "새내기게시판" },
];

export function PostEditor({ mode, activeCategory = 0, initialContent, initialTitle }: PostEditorProps) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [content, setContent] = useState(initialContent ?? "");
  const [categoryId, setCategoryId] = useState<number>(activeCategory);

  const heading = mode === "edit" ? "글 수정" : "새 글쓰기";
  const submitLabel = mode === "edit" ? "수정하기" : "새 글쓰기";

  const selectedCategoryLabel = useMemo(() => {
    const found = categoryOptions.find((item) => item.id === categoryId);
    return found?.label ?? "전체게시판";
  }, [categoryId]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: wire up submit logic
  };

  return (
    <section className="flex min-w-[400px] flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <button type="button" className="w-fit text-sm font-medium text-[#596673]">
          ←  목록으로
        </button>
        <h1 className="text-[28px] font-bold leading-[34px] text-[#1e1e1e]">{heading}</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-[16px] border border-[#e8e8e8] bg-white p-6"
      >
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#666666]" htmlFor="post-title">
            제목
          </label>
          <Input
            id="post-title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="h-[52px] rounded-[4px] border-[#e1e1e1] bg-[#fafafa]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#666666]" htmlFor="post-category">
            게시판
          </label>
          <div className="flex h-12 w-[240px] items-center justify-between rounded-[24px] border border-[#e1e1e1] bg-white px-4">
            <select
              id="post-category"
              name="category"
              className="w-full bg-transparent text-[15px] font-semibold text-[#1a1a1a] outline-none"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <span aria-hidden className="text-[18px] text-[#9a9a9a]">
              ⌵
            </span>
          </div>
          <p className="text-[12px] text-gray-500">현재 선택: {selectedCategoryLabel}</p>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#666666]" htmlFor="post-content">
            본문
          </label>
          <textarea
            id="post-content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요."
            className="min-h-[340px] w-full resize-vertical rounded-[4px] border border-[#e1e1e1] bg-[#fbfbfb] p-4 text-[14px] text-[#1a1a1a] placeholder:text-[#8e8e8e] outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="text-[13px] font-semibold text-[#666666]">첨부</div>
          <label
            htmlFor="post-attachment"
            className="inline-flex h-11 w-[150px] cursor-pointer items-center rounded-[8px] border border-[#e1e1e1] bg-[#f7f7f7] px-3 text-[13px] font-medium text-[#737373]"
          >
            📎 이미지 업로드
            <input id="post-attachment" name="attachment" type="file" className="hidden" />
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outlined"
            className="w-1/2 rounded-[16px] border-[#d1d1d1] text-[15px] font-semibold text-[#737373]"
          >
            임시 저장
          </Button>
          <Button type="submit" className="w-1/2 rounded-[16px] bg-primary text-[16px] font-semibold text-white">
            {submitLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default PostEditor;
