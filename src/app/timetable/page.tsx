'use client';

import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { Button } from "@comp/common/Button/Button";
import Input from "@comp/common/Input/Input";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

type Entry = {
  id: number;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  memo?: string | null;
};

export default function TimetablePage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", dayOfWeek: 1, startTime: "09:00", endTime: "10:00", memo: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("userId");
    if (!stored) return;
    setUserId(Number(stored));
  }, []);

  const grouped = useMemo(() => {
    return entries.reduce<Record<number, Entry[]>>((acc, cur) => {
      acc[cur.dayOfWeek] = acc[cur.dayOfWeek] ? [...acc[cur.dayOfWeek], cur] : [cur];
      return acc;
    }, {});
  }, [entries]);

  const fetchEntries = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/timetable", { headers: { "x-user-id": String(userId) } });
      if (!res.ok) throw new Error("시간표를 불러오지 못했습니다.");
      const data = await res.json();
      setEntries(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "시간표를 불러오지 못했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": String(userId) },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("시간표 저장에 실패했습니다.");
      setForm({ title: "", dayOfWeek: 1, startTime: "09:00", endTime: "10:00", memo: "" });
      await fetchEntries();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "시간표 저장에 실패했습니다.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/timetable/${id}`, { method: "DELETE", headers: { "x-user-id": String(userId) } });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      await fetchEntries();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "삭제에 실패했습니다.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout header leftSidebar rightSidebar>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-900">시간표</h1>
        {error && <p className="text-sm text-primary">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 rounded-[12px] border border-gray-200 bg-white p-4 md:grid-cols-5 md:items-end">
          <Input
            label="과목/활동"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="md:col-span-2"
            required
          />
          <div className="space-y-1">
            <label className="text-xs text-gray-600">요일</label>
            <select
              className="w-full rounded border border-gray-300 bg-white p-2 text-sm"
              value={form.dayOfWeek}
              onChange={(e) => setForm((prev) => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
            >
              {dayLabels.map((label, idx) => (
                <option key={label} value={idx}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="시작"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
            required
          />
          <Input
            label="종료"
            type="time"
            value={form.endTime}
            onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
            required
          />
          <Input
            label="메모"
            value={form.memo}
            onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
            className="md:col-span-2"
          />
          <Button type="submit" disabled={saving || !form.title} className="md:col-span-5">
            {saving ? "저장 중..." : "추가"}
          </Button>
        </form>

        {loading ? (
          <p className="text-sm text-gray-600">불러오는 중...</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {dayLabels.map((label, idx) => (
              <div key={label} className="rounded-[12px] border border-gray-200 bg-white p-4">
                <div className="mb-2 text-sm font-semibold text-gray-800">{label}</div>
                <div className="space-y-2">
                  {(grouped[idx] ?? []).map((item) => (
                    <div key={item.id} className="rounded border border-gray-100 bg-[#fafafa] p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <button className="text-xs text-primary" type="button" onClick={() => handleDelete(item.id)} disabled={saving}>
                          삭제
                        </button>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.startTime} ~ {item.endTime}
                      </div>
                      {item.memo ? <div className="text-xs text-gray-500">{item.memo}</div> : null}
                    </div>
                  ))}
                  {grouped[idx]?.length ? null : <p className="text-xs text-gray-400">등록된 일정이 없습니다.</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
