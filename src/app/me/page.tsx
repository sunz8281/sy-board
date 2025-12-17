'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { Button } from "@comp/common/Button/Button";

export default function MyPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<{ id: number; name?: string | null; email: string } | null>(null);
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
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users/me", { headers: { "x-user-id": String(userId) }, signal: controller.signal });
        if (!res.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setUser(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "사용자 정보를 불러오지 못했습니다.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    return () => controller.abort();
  }, [userId]);

  const shortcuts = [
    { label: "내 글 모음", href: "/me/articles" },
    { label: "댓글 단 글", href: "/me/comments" },
    { label: "내 북마크", href: "/me/bookmarks" },
  ];

  return (
    <AppLayout header leftSidebar rightSidebar>
      <section className="flex min-w-[400px] flex-1 flex-col gap-6">
        <div className="rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">내 정보</h1>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            {loading && <p>불러오는 중...</p>}
            {error && <p className="text-primary">{error}</p>}
            {user && (
              <>
                <p>이름: {user.name ?? "미등록"}</p>
                <p>이메일: {user.email}</p>
                <p>사용자 ID: {user.id}</p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((item) => (
            <Button
              key={item.href}
              className="w-full justify-start rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-left text-[14px] font-semibold text-gray-800 shadow-sm"
              variant="grayscale"
              onClick={() => router.push(item.href)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
