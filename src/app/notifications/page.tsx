'use client';

import { useEffect, useState } from "react";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { Button } from "@comp/common/Button/Button";
import Link from "next/link";

interface NotificationItem {
  id: number;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("userId");
    if (!stored) return;
    setUserId(Number(stored));
  }, []);

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notifications", { headers: { "x-user-id": String(userId) } });
      if (!res.ok) throw new Error("알림을 불러오지 못했습니다.");
      const data = await res.json();
      setItems(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "알림을 불러오지 못했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const markRead = async (id: number) => {
    if (!userId) return;
    setSaving(true);
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH", headers: { "x-user-id": String(userId) } });
      await fetchNotifications();
    } catch (err) {
      setError("읽음 처리에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout header leftSidebar rightSidebar>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">알림</h1>
          <Button variant="outlined" size="small" onClick={fetchNotifications} disabled={loading}>
            새로고침
          </Button>
        </div>
        {loading && <p className="text-sm text-gray-600">불러오는 중...</p>}
        {error && <p className="text-sm text-primary">{error}</p>}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`rounded-[12px] border bg-white p-4 ${item.read ? "border-gray-200" : "border-primary/40"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">{item.message}</p>
                  {item.link ? (
                    <Link href={item.link} className="text-xs text-primary underline">
                      바로가기
                    </Link>
                  ) : null}
                  <p className="text-[11px] text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                {!item.read && (
                  <Button size="small" variant="outlined" onClick={() => markRead(item.id)} disabled={saving}>
                    읽음
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && <p className="text-sm text-gray-500">알림이 없습니다.</p>}
        </div>
      </section>
    </AppLayout>
  );
}
