'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { formatDateDot } from "@utils/formatDate";
import Link from "next/link";

export default function MyCommentsPage() {
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
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users/me/comments", {
          headers: { "x-user-id": String(userId) },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("댓글 단 글을 불러오지 못했습니다.");
        const data = await res.json();
        setItems(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "댓글 단 글을 불러오지 못했습니다.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
    return () => controller.abort();
  }, [userId]);

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={0}>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-900">댓글 단 글</h1>
        {loading && <p className="text-sm text-gray-600">불러오는 중...</p>}
        {error && <p className="text-sm text-primary">{error}</p>}
        {!loading && !error &&
          items.map((item) => (
            <div key={item.id} className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
              <Link href={`/board/article/${item.article?.id ?? ""}`} className="text-base font-semibold text-primary">
                {item.article?.title ?? "(삭제된 글)"}
              </Link>
              <p className="mt-1 text-sm text-gray-600">{item.content}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {item.article?.category?.name ?? ""} · {item.article ? `${item.article.commentsCount}댓글 / ${item.article.likesCount}좋아요` : ""}
                </span>
                <span>{formatDateDot(new Date(item.createdAt))}</span>
              </div>
            </div>
          ))}
      </section>
    </AppLayout>
  );
}
