'use client';

import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import PostEditor from "@comp/board/PostEditor";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoardEditPage() {
  const params = useParams<{ id: string; pageId: string }>();
  const activeCategory = Number.isNaN(Number(params.id)) ? 0 : Number(params.id);

  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");
  const [initialCategory, setInitialCategory] = useState<number>(activeCategory || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/articles/${params.pageId}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`게시글을 불러오지 못했습니다. (${res.status})`);
        const data = await res.json();
        setInitialTitle(data.title ?? "");
        setInitialContent(data.content ?? "");
        setInitialCategory(data.category?.id ?? activeCategory || 1);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message ?? "게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    return () => controller.abort();
  }, [params.pageId, activeCategory]);

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={activeCategory}>
      {loading && <div className="text-sm text-gray-600">불러오는 중...</div>}
      {error && <div className="text-sm text-primary">{error}</div>}
      {!loading && !error && (
        <PostEditor
          mode="edit"
          activeCategory={initialCategory}
          initialTitle={initialTitle}
          initialContent={initialContent}
          postId={Number(params.pageId)}
        />
      )}
    </AppLayout>
  );
}
