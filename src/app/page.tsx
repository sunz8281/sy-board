'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import Input from "@comp/common/Input/Input";
import { Button } from "@comp/common/Button/Button";
import Link from "next/link";

type UserPreview = {
  id: number;
  email: string;
  name?: string | null;
};

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedId = window.localStorage.getItem("userId");
    if (storedId) {
      fetchCurrentUser(storedId);
    }
  }, []);

  const fetchCurrentUser = async (userId: string) => {
    try {
      const res = await fetch("/api/users/me", { headers: { "x-user-id": userId } });
      if (res.ok) {
        const data = await res.json();
        if (data.email) setEmail(data.email);
      }
    } catch {
      // ignore stale session errors
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "로그인에 실패했습니다.");
      }

      const headerUserId = res.headers.get("x-user-id");
      const responseUserId = headerUserId ?? data?.user?.id?.toString();
      if (!responseUserId) {
        throw new Error("로그인 응답에 사용자 ID가 없습니다.");
      }
      const parsedId = Number.parseInt(responseUserId, 10);
      if (Number.isNaN(parsedId)) {
        throw new Error("잘못된 사용자 ID입니다.");
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("userId", String(parsedId));
        if (data?.user?.name) {
          window.localStorage.setItem("userName", data.user.name);
        }
      }

      await fetch("/api/users/me", { headers: { "x-user-id": String(parsedId) } }).catch(() => undefined);

      setPassword("");
      setTimeout(() => router.push("/board/0"), 600);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
        <div className="flex flex-col items-center justify-center gap-4 h-full">
            <section className="w-1/2 rounded-[20px] border border-[#e8e8e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-headline font-semibold text-[#666666]">Login</div>
                    </div>
                    <Link href="/signup" className="text-xs text-primary underline">
                        회원가입
                    </Link>
                </div>

                <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input
                        name="email"
                        label="이메일"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        rounded={false}
                        isError={Boolean(error)}
                    />
                    <Input
                        name="password"
                        type="password"
                        label="비밀번호"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        rounded={false}
                        isError={Boolean(error)}
                    />

                    {error ? <div className="text-[13px] text-primary">{error}</div> : null}

                    <Button type="submit" disabled={loading} className="w-full rounded-[10px]">
                        {loading ? "로그인 중..." : "로그인"}
                    </Button>
                </form>
            </section>
        </div>
    </AppLayout>
  );
}
