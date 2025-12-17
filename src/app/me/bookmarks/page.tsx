'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { PostCard } from "@comp/board/PostCard";
import { formatDateDot } from "@utils/formatDate";

export default function MyBookmarksPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("userId");
    if (!stored) {
      router.push("/");
      return;
    }
    setUserId(Number(stored));
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users/me/bookmarks", {
          headers: { "x-user-id": String(userId) },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("북마크를 불러오지 못했습니다.");
        const data = await res.json();
        setItems(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "북마크를 불러오지 못했습니다.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
    return () => controller.abort();
  }, [userId]);

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={0}>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-900">내 북마크</h1>
        {loading && <p className="text-sm text-gray-600">불러오는 중...</p>}
        {error && <p className="text-sm text-primary">{error}</p>}
        {!loading && !error &&
          items.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              commentCount={post.commentsCount ?? 0}
              preview={post.content ?? ""}
              category={post.category?.name ?? ""}
              author="익명"
              postedAt={formatDateDot(new Date(post.createdAt))}
              likes={post.likesCount ?? 0}
              favorites={post.bookmarksCount ?? 0}
            />
          ))}
      </section>
    </AppLayout>
  );
}
