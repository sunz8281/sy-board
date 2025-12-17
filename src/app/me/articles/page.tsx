'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { PostCard } from "@comp/board/PostCard";
import { formatDateDot } from "@utils/formatDate";

export default function MyArticlesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("userId");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsed = Number(stored);
    setUserId(parsed);
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users/me/articles", {
          headers: { "x-user-id": String(userId) },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("내 글을 불러오지 못했습니다.");
        const data = await res.json();
        setArticles(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "내 글을 불러오지 못했습니다.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
    return () => controller.abort();
  }, [userId]);

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={0}>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">내 글 모음</h1>
        </div>
        {loading && <p className="text-sm text-gray-600">불러오는 중...</p>}
        {error && <p className="text-sm text-primary">{error}</p>}
        {!loading && !error &&
          articles.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              commentCount={post.commentsCount ?? 0}
              preview={post.content ?? ""}
              category={post.category?.name ?? ""}
              author="나"
              postedAt={formatDateDot(new Date(post.createdAt))}
              likes={post.likesCount ?? 0}
              favorites={post.bookmarksCount ?? 0}
            />
          ))}
      </section>
    </AppLayout>
  );
}
