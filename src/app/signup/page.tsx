'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import Input from "@comp/common/Input/Input";
import { Button } from "@comp/common/Button/Button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("userId");
    if (stored) {
      router.replace("/board/0");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      setSuccess(null);
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      setSuccess(null);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "회원가입에 실패했습니다.");
      }

      const headerUserId = res.headers.get("x-user-id");
      const responseUserId = headerUserId ?? data?.user?.id?.toString();
      if (!responseUserId) {
        throw new Error("회원가입 응답에 사용자 ID가 없습니다.");
      }
      const parsedId = Number.parseInt(responseUserId, 10);
      if (Number.isNaN(parsedId)) {
        throw new Error("잘못된 사용자 ID입니다.");
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("userId", String(parsedId));
        if (data?.user?.name || name.trim()) {
          window.localStorage.setItem("userName", data?.user?.name ?? name.trim());
        }
      }

      setSuccess("회원가입이 완료되었습니다. 게시판으로 이동합니다.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/board/0"), 600);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <section className="w-full max-w-[560px] rounded-[20px] border border-[#e8e8e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-headline font-semibold text-[#666666]">Sign Up</div>
              <p className="text-xs text-gray-500">계정을 생성하고 게시판을 이용해 보세요.</p>
            </div>
            <button
              type="button"
              className="text-xs text-primary underline"
              onClick={() => router.push("/")}
            >
              로그인으로 돌아가기
            </button>
          </div>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              name="name"
              label="이름"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              rounded={false}
            />
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
            <Input
              name="confirmPassword"
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              rounded={false}
              isError={Boolean(error)}
            />

            {error ? <div className="text-[13px] text-primary">{error}</div> : null}
            {success ? <div className="text-[13px] text-[#1c7d36]">{success}</div> : null}

            <Button type="submit" disabled={loading} className="w-full rounded-[10px]">
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
