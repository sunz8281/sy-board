'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import Input from "@comp/common/Input/Input";
import { PostCard } from "@comp/board/PostCard";
import { formatDateDot } from "@utils/formatDate";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error("검색에 실패했습니다.");
      const data = await res.json();
      setResults(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "검색에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    setQuery(current);
    if (current) {
      runSearch(current);
    } else {
      setResults([]);
    }
  }, [searchParams]);

  return (
    <AppLayout header leftSidebar rightSidebar>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-900">검색결과: {query}</h1>
        {loading && <p className="text-sm text-gray-600">검색 중...</p>}
        {error && <p className="text-sm text-primary">{error}</p>}
        {!loading && !error &&
          results.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              commentCount={post.commentsCount ?? 0}
              preview={post.content ?? ""}
              category={post.category?.name ?? ""}
              author={post.author ?? "익명"}
              postedAt={formatDateDot(new Date(post.createdAt))}
              likes={post.likesCount ?? 0}
              favorites={post.bookmarksCount ?? 0}
            />
          ))}
        {!loading && results.length === 0 && query && <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>}
      </section>
    </AppLayout>
  );
}
