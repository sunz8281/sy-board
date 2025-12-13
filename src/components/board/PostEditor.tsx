'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";
import Input from "@comp/common/Input/Input";
import { Button } from "@comp/common/Button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type EditorMode = "create" | "edit";

type PostEditorProps = {
  mode: EditorMode;
  activeCategory?: number;
  initialTitle?: string;
  initialContent?: string;
  postId?: number;
};

export function PostEditor({ mode, activeCategory = 0, initialContent, initialTitle, postId }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle ?? "");
  const [content, setContent] = useState(initialContent ?? "");
  const [categoryId, setCategoryId] = useState<number>(activeCategory === 0 ? 1 : activeCategory);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [catError, setCatError] = useState<string | null>(null);
  const [catLoading, setCatLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const heading = mode === "edit" ? "글 수정" : "새 글쓰기";
  const submitLabel = mode === "edit" ? "수정하기" : "새 글쓰기";

  const selectedCategoryLabel = useMemo(() => {
    const found = categories.find((item) => item.id === categoryId);
    return found?.name ?? "전체게시판";
  }, [categories, categoryId]);

  useEffect(() => {
    if (initialTitle !== undefined) setTitle(initialTitle);
    if (initialContent !== undefined) setContent(initialContent);
    if (activeCategory && activeCategory !== 0) setCategoryId(activeCategory);
  }, [initialTitle, initialContent, activeCategory]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      setCatLoading(true);
      setCatError(null);
      try {
        const res = await fetch("/api/categories", { signal: controller.signal });
        if (!res.ok) throw new Error(`카테고리를 불러오지 못했습니다. (${res.status})`);
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setCatError(err.message ?? "카테고리를 불러오지 못했습니다.");
      } finally {
        setCatLoading(false);
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setSubmitError("제목과 본문을 입력하세요.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      if (mode === "edit" && postId) {
        const res = await fetch(`/api/articles/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, categoryId }),
        });
        if (!res.ok) throw new Error("게시글 수정에 실패했습니다.");
        router.push(`/board/article/${postId}`);
      } else {
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            categoryId,
            authorId: 1, // TODO: 로그인 사용자 ID로 대체
          }),
        });
        if (!res.ok) throw new Error("게시글 등록에 실패했습니다.");
        const created = await res.json();
        router.push(`/board/article/${created.id ?? ""}`);
      }
    } catch (err: any) {
      setSubmitError(err.message ?? "요청에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-w-[400px] flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Link href="/board/1" type="button" className="w-fit text-sm font-medium text-[#596673]">
          ←  목록으로
        </Link>
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
              {categories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <span aria-hidden className="text-[18px] text-[#9a9a9a]">
              ⌵
            </span>
          </div>
          {catLoading ? (
            <p className="text-[12px] text-gray-500">카테고리를 불러오는 중...</p>
          ) : catError ? (
            <p className="text-[12px] text-primary">{catError}</p>
          ) : (
            <p className="text-[12px] text-gray-500">현재 선택: {selectedCategoryLabel}</p>
          )}
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
          <Button
            type="submit"
            disabled={submitting}
            className="w-1/2 rounded-[16px] bg-primary text-[16px] font-semibold text-white disabled:opacity-70"
          >
            {submitLabel}
          </Button>
        </div>
        {submitError && <p className="text-[12px] text-primary">{submitError}</p>}
      </form>
    </section>
  );
}

export default PostEditor;
