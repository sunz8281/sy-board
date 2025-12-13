'use client';

import { PostCard } from "@comp/board/PostCard";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDateDot } from "@utils/formatDate";

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const activeCategory = Number.isNaN(Number(params.id)) ? 0 : Number(params.id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<
    Array<{
      id: number;
      title: string;
      content: string;
      createdAt: string;
      category: { id: number; name: string };
      author: string | null;
      commentsCount: number;
      likesCount: number;
      bookmarksCount: number;
    }>
  >([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = activeCategory ? `?category=${activeCategory}` : "";
        const res = await fetch(`/api/articles${qs}`, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to fetch articles (${res.status})`);
        }
        const data = await res.json();
        setArticles(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message ?? "게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    return () => controller.abort();
  }, [activeCategory]);

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={activeCategory}>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        {loading && <div className="text-sm text-gray-600">게시글을 불러오는 중...</div>}
        {error && <div className="text-sm text-primary">{error}</div>}
        {!loading &&
          !error &&
          articles.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              commentCount={post.commentsCount ?? 0}
              preview={post.content ?? ""}
              category={post.category?.name ?? ""}
              author={post.author ?? "익명"}
              postedAt={formatDateDot(new Date(post.createdAt))}
              views={0}
              likes={post.likesCount ?? 0}
              favorites={post.bookmarksCount ?? 0}
            />
          ))}
      </section>
    </AppLayout>
  );
}
